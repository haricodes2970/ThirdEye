import { matchTracker } from './trackers.js';
import { supabaseUpsert } from './supabase-client.js';

// --- State Management (chrome.storage.session survives worker restarts) ---

async function getTimerState() {
  const { activeTracker } = await chrome.storage.session.get('activeTracker');
  return activeTracker || null;
}

async function saveTimerState(state) {
  await chrome.storage.session.set({ activeTracker: state });
}

async function clearTimerState() {
  await chrome.storage.session.remove('activeTracker');
}

// --- Timer Control ---

async function startTimer(trackerName) {
  const current = await getTimerState();

  // Already timing this tracker — do nothing
  if (current && current.name === trackerName) return;

  // Different tracker running — stop it first
  if (current) await stopTimer();

  await saveTimerState({
    name: trackerName,
    startedAt: Date.now(),
    accumulatedSec: 0,
  });
}

async function stopTimer() {
  const state = await getTimerState();
  if (!state) return;

  const elapsed = calcElapsedSec(state);
  if (elapsed >= 1) {
    await bufferFlush(state.name, elapsed);
  }
  await clearTimerState();
}

async function pauseTimer() {
  const state = await getTimerState();
  if (!state || !state.startedAt) return;

  const segmentSec = Math.floor((Date.now() - state.startedAt) / 1000);
  state.accumulatedSec += segmentSec;
  state.startedAt = null; // paused
  await saveTimerState(state);
}

async function resumeTimer() {
  const state = await getTimerState();
  if (!state || state.startedAt) return; // not paused or no state

  state.startedAt = Date.now();
  await saveTimerState(state);
}

function calcElapsedSec(state) {
  let total = state.accumulatedSec || 0;
  if (state.startedAt) {
    total += Math.floor((Date.now() - state.startedAt) / 1000);
  }
  return total;
}

// --- Buffer & Flush ---

async function bufferFlush(toolName, seconds) {
  const { flushBuffer = {} } = await chrome.storage.local.get('flushBuffer');
  flushBuffer[toolName] = (flushBuffer[toolName] || 0) + seconds;
  await chrome.storage.local.set({ flushBuffer });
}

// --- Alarm-based periodic flush (every 1 minute) ---

chrome.alarms.create('thirdeye-flush', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'thirdeye-flush') return;

  // Snapshot currently running timer into buffer
  const state = await getTimerState();
  if (state && state.startedAt) {
    const segmentSec = Math.floor((Date.now() - state.startedAt) / 1000);
    if (segmentSec > 0) {
      await bufferFlush(state.name, segmentSec + state.accumulatedSec);
      state.startedAt = Date.now();
      state.accumulatedSec = 0;
      await saveTimerState(state);
    }
  }

  // Flush buffer to Supabase
  const { flushBuffer = {} } = await chrome.storage.local.get('flushBuffer');
  if (Object.keys(flushBuffer).length === 0) return;

  for (const [toolName, seconds] of Object.entries(flushBuffer)) {
    try {
      await supabaseUpsert(toolName, seconds, 'chrome');
      delete flushBuffer[toolName];
    } catch (e) {
      console.warn('ThirdEye: flush failed for', toolName, e);
      // Keep in buffer, retry next alarm
    }
  }

  await chrome.storage.local.set({ flushBuffer });
});

// --- Event Listeners ---

// Tab switch
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  const tracker = await matchTracker(tab.url);
  if (tracker) {
    await startTimer(tracker.name);
  } else {
    await stopTimer();
  }
});

// URL change in active tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url || !tab.active) return;
  const tracker = await matchTracker(changeInfo.url);
  if (tracker) {
    await startTimer(tracker.name);
  } else {
    await stopTimer();
  }
});

// Window focus
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await pauseTimer();
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) {
      const tracker = await matchTracker(tab.url);
      if (tracker) await resumeTimer();
      else await stopTimer();
    }
  }
});

// Idle detection (60 second threshold)
chrome.idle.setDetectionInterval(60);
chrome.idle.onStateChanged.addListener(async (state) => {
  if (state === 'idle' || state === 'locked') {
    await pauseTimer();
  } else if (state === 'active') {
    await resumeTimer();
  }
});
