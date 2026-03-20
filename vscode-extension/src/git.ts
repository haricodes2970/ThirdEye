import { exec } from 'child_process';
import * as vscode from 'vscode';

export async function getTodayCommitCount(): Promise<number> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return 0;

  const cwd = folders[0].uri.fsPath;
  const today = new Date().toISOString().split('T')[0];

  return new Promise((resolve) => {
    exec(
      `git rev-list --count --after="${today}T00:00:00" HEAD`,
      { cwd },
      (error, stdout) => {
        if (error) {
          // Not a git repo or git not installed — that's fine
          resolve(0);
          return;
        }
        const count = parseInt(stdout.trim(), 10);
        resolve(isNaN(count) ? 0 : count);
      }
    );
  });
}
