import { supabase, USER_ID } from './supabase-client.js';
import { DEFAULT_TRACKERS, getCustomTrackers, addCustomTracker, removeCustomTracker } from './trackers.js';

function formatSeconds(sec) {
  if (!sec || sec < 60) return sec ? `${sec}s` : '0s';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

async function fetchTodayTimes() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('time_entries')
    .select('tool_name, duration_sec')
    .eq('user_id', USER_ID)
    .eq('date', today)
    .eq('source', 'chrome');

  if (error) return {};

  const map = {};
  for (const row of data) {
    map[row.tool_name] = row.duration_sec;
  }
  return map;
}

async function renderTrackers() {
  const [custom, times] = await Promise.all([getCustomTrackers(), fetchTodayTimes()]);
  const all = [...DEFAULT_TRACKERS, ...custom];
  const list = document.getElementById('trackerList');

  if (all.length === 0) {
    list.innerHTML = '<div class="empty">No trackers yet.</div>';
    return;
  }

  list.innerHTML = all.map(t => {
    const sec = times[t.name] || 0;
    const isDefault = DEFAULT_TRACKERS.some(d => d.urlPattern === t.urlPattern);
    const removeBtn = isDefault ? '' : `<button class="remove-btn" data-pattern="${t.urlPattern}">remove</button>`;
    return `
      <div class="tracker-row">
        <span class="tracker-name">${t.name}</span>
        <span>
          <span class="tracker-time">${formatSeconds(sec)}</span>
          ${removeBtn}
        </span>
      </div>`;
  }).join('');

  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await removeCustomTracker(btn.dataset.pattern);
      renderTrackers();
    });
  });
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const urlInput = document.getElementById('urlInput');
  const nameInput = document.getElementById('nameInput');
  const pattern = urlInput.value.trim();
  const name = nameInput.value.trim();
  if (!pattern || !name) return;
  await addCustomTracker(name, pattern);
  urlInput.value = '';
  nameInput.value = '';
  renderTrackers();
});

// Initial render + refresh every 5 seconds
renderTrackers();
setInterval(renderTrackers, 5000);
