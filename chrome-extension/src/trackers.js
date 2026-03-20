const DEFAULT_TRACKERS = [
  { name: 'ChatGPT', urlPattern: 'chatgpt.com' },
  { name: 'Claude',  urlPattern: 'claude.ai' },
  { name: 'Grok',   urlPattern: 'grok.com' },
];

async function getCustomTrackers() {
  const { customTrackers = [] } = await chrome.storage.local.get('customTrackers');
  return customTrackers;
}

async function addCustomTracker(name, urlPattern) {
  const trackers = await getCustomTrackers();
  trackers.push({ name, urlPattern });
  await chrome.storage.local.set({ customTrackers: trackers });
}

async function removeCustomTracker(urlPattern) {
  let trackers = await getCustomTrackers();
  trackers = trackers.filter(t => t.urlPattern !== urlPattern);
  await chrome.storage.local.set({ customTrackers: trackers });
}

async function matchTracker(url) {
  if (!url) return null;
  const custom = await getCustomTrackers();
  const all = [...DEFAULT_TRACKERS, ...custom];
  for (const tracker of all) {
    if (url.includes(tracker.urlPattern)) return tracker;
  }
  return null;
}

export { DEFAULT_TRACKERS, getCustomTrackers, addCustomTracker, removeCustomTracker, matchTracker };
