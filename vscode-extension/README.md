# ThirdEye — VS Code Extension

Automatically tracks three things per workspace per day with zero manual input:

| What | How |
|------|-----|
| **Active coding time** | Counts seconds while you're editing. Pauses when you switch to another app or stop editing for 2 minutes. |
| **Project name** | Workspace folder name (e.g. `thirdeye`, `portfolio`). Automatic. |
| **Git commits today** | Runs `git rev-list --count` on every flush. Works silently if not a git repo. |

Everything flushes to your Supabase `time_entries` table every 60 seconds. No commands, no buttons, no notes.

---

## Setup

### 1. Build the extension

```bash
cd vscode-extension
npm install
npm run compile
```

### 2. Load in VS Code / Cursor / Antigravity

- Press `F5` in VS Code to launch an Extension Development Host, **or**
- Copy the `vscode-extension/` folder to your extensions directory and reload

### 3. Set your credentials in settings

Open **Settings** (`Ctrl+,`) and search for `thirdeye`, or add to your `settings.json`:

```json
{
  "thirdeye.supabaseUrl": "https://your-project.supabase.co",
  "thirdeye.supabaseAnonKey": "your-anon-key",
  "thirdeye.userId": "your-uuid"
}
```

Once saved, open any workspace folder — the `$(eye) ThirdEye` indicator appears in the status bar and tracking begins immediately.

---

## Compatibility

Works in **VS Code**, **Cursor**, and **Antigravity** — all Chromium-based VS Code forks that respect the `vscode ^1.85.0` engine. Only uses core APIs (`workspace`, `window`) with no VS-Code-exclusive features.

---

## How it works

```
onStartupFinished → activate()
  ├── getProjectName()  → workspace folder name
  ├── onDidChangeTextDocument / onDidChangeActiveTextEditor → markActive()
  ├── onDidChangeWindowState → pause on blur
  ├── setInterval 1s → increment accumulatedSec (if active + not idle)
  └── setInterval 60s → flush to Supabase + read git commit count
```

Data lands in `time_entries` with `source: 'vscode'` and `tool_name` = your folder name. The Chrome extension writes separately with `source: 'chrome'` and AI tool names — no conflicts.
