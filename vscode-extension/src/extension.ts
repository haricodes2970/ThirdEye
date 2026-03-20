import * as vscode from 'vscode';
import { createSupabaseClient, upsertTimeEntry } from './supabase';
import { getProjectName } from './tracker';
import { getTodayCommitCount } from './git';

let accumulatedSec = 0;
let lastActivityTs = Date.now();
let isWindowFocused = true;

const IDLE_THRESHOLD_MS = 120_000; // 2 minutes no edits → idle

export function activate(context: vscode.ExtensionContext) {
  const projectName = getProjectName();
  if (!projectName) return; // No workspace open — nothing to track

  const ready = createSupabaseClient();
  if (!ready) return;

  // Activity listeners
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => markActive()),
    vscode.window.onDidChangeActiveTextEditor(() => markActive()),
    vscode.window.onDidChangeWindowState((e) => {
      isWindowFocused = e.focused;
      if (e.focused) markActive();
    })
  );

  // 1-second activity counter (safe — extension host is long-lived)
  const tickInterval = setInterval(() => {
    const isIdle = (Date.now() - lastActivityTs) >= IDLE_THRESHOLD_MS;
    if (isWindowFocused && !isIdle) {
      accumulatedSec++;
    }
  }, 1000);

  // Flush to Supabase every 60 seconds
  const flushInterval = setInterval(() => flush(projectName), 60_000);

  context.subscriptions.push(
    { dispose: () => clearInterval(tickInterval) },
    { dispose: () => clearInterval(flushInterval) }
  );

  // Status bar indicator
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = '$(eye) ThirdEye';
  statusBar.tooltip = 'ThirdEye: tracking active';
  statusBar.show();
  context.subscriptions.push(statusBar);
}

function markActive() {
  lastActivityTs = Date.now();
  isWindowFocused = true;
}

async function flush(projectName: string) {
  if (accumulatedSec < 1) return;

  const commitCount = await getTodayCommitCount();
  const secondsToFlush = accumulatedSec;
  accumulatedSec = 0; // Reset before async call to avoid losing ticks

  try {
    await upsertTimeEntry({
      toolName: projectName,
      durationSec: secondsToFlush,
      source: 'vscode',
      commitCount,
    });
  } catch (e) {
    // Add back if flush failed — don't lose time
    accumulatedSec += secondsToFlush;
    console.warn('ThirdEye: flush failed', e);
  }
}

export function deactivate() {
  // Extension host is shutting down — nothing to clean up
}
