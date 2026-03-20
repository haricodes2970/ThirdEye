# 👁 ThirdEye — Personal AI Tool Usage Tracker

> Automatically track how much time you spend on AI tools and coding — no manual input, ever.

<!-- Add a screenshot here once deployed: ![ThirdEye Dashboard](docs/screenshot.png) -->

---

## What It Tracks

| Source | Tracks |
|--------|--------|
| **Chrome Extension** | Time on ChatGPT, Claude, Grok + any custom AI URL you add |
| **VS Code Extension** | Active coding time, project name, git commits per day |

Everything is written to your own **Supabase** database and visualised on a **Next.js dashboard** you can embed in your portfolio.

---

## Architecture

```
┌──────────────────────┐    ┌──────────────────────┐    ┌───────────────────────┐
│  Chrome Extension     │    │  VS Code Extension    │    │  Next.js Dashboard     │
│                       │    │  (Cursor/Antigravity) │    │                        │
│  • AI website time    │    │  • Coding time        │    │  • Time per tool/day   │
│  • Custom URL add     │    │  • Project name       │    │  • Activity heatmap    │
│                       │    │  • Git commit count   │    │  • Portfolio embed     │
└───────┬──────────────┘    └────────┬──────────────┘    └────────┬──────────────┘
        │                            │                             │
        └────────────┬───────────────┘                             │
                     ▼                                             │
              ┌──────────────────┐                                 │
              │    Supabase      │◄────────────────────────────────┘
              │  time_entries    │
              └──────────────────┘
```

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome_MV3-4285F4?style=flat-square&logo=googlechrome&logoColor=white)

---

## Quick Start

### 1. Create a free Supabase project

Go to [supabase.com](https://supabase.com) → **New Project** (free tier is enough).

### 2. Run the migration

Open **SQL Editor** in your Supabase dashboard and paste the contents of [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql).

### 3. Generate your UUID

Go to [uuidgenerator.net](https://www.uuidgenerator.net/) and copy a UUID — this is your permanent `user_id`.

### 4. Replace placeholders in all three components

**Chrome extension** — open `chrome-extension/src/supabase-client.js`:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const USER_ID = 'YOUR_UUID';
```

**VS Code extension** — open Settings (`Ctrl+,`) and search `thirdeye`:
```json
{
  "thirdeye.supabaseUrl": "https://YOUR_PROJECT.supabase.co",
  "thirdeye.supabaseAnonKey": "YOUR_ANON_KEY",
  "thirdeye.userId": "YOUR_UUID"
}
```

**Dashboard** — create `dashboard/.env.local` (copy from `dashboard/.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_USER_ID=YOUR_UUID
```

Also replace `'your-uuid-here'` in the RLS policies — see [SETUP.md](SETUP.md) for the exact SQL.

### 5. Load the Chrome extension

```bash
cd chrome-extension
npm install
npm run build
```

Open `chrome://extensions` (or `brave://extensions`) → enable **Developer mode** → **Load unpacked** → select `chrome-extension/dist/`.

### 6. Install the VS Code extension

```bash
cd vscode-extension
npm install
npm run compile
```

Press `Ctrl+Shift+P` → **Developer: Install Extension from Location** → select the `vscode-extension/` folder.

The `$(eye) ThirdEye` indicator appears in the status bar when tracking starts.

### 7. Deploy the dashboard to Vercel

```bash
cd dashboard
npm install
npx vercel --prod
```

Set the three environment variables in the Vercel dashboard when prompted.

---

## Add Custom AI Tools

Click the ThirdEye icon in your browser toolbar → scroll to **Add Tracker** → enter a URL pattern (e.g. `perplexity.ai`) and a display name → **Add**.

The tracker appears in the list immediately and starts accumulating time when you visit that URL.

---

## Portfolio Embed

Embed your live AI usage stats anywhere with an iframe:

```html
<iframe
  src="https://srihariprasad.vercel.app/embed/YOUR_USER_ID"
  width="100%"
  height="220"
  frameborder="0"
  style="border-radius: 12px; max-width: 400px;"
></iframe>
```

Or fetch JSON for a custom widget:

```
GET https://srihariprasad.vercel.app/api/embed?userId=YOUR_USER_ID
```

---

## Project Structure

```
ThirdEye/
├── supabase/
│   └── migrations/
│       └── 001_init.sql          # Schema, indexes, upsert function, RLS, realtime
├── chrome-extension/
│   ├── manifest.json             # MV3 manifest
│   ├── popup.html                # Extension popup UI
│   └── src/
│       ├── background.js         # Service worker — timer + alarm flush
│       ├── trackers.js           # Default + custom tracker management
│       ├── supabase-client.js    # ⚠️ Fill in your credentials here
│       └── popup.js              # Popup logic
├── vscode-extension/
│   ├── package.json              # Extension manifest
│   └── src/
│       ├── extension.ts          # Activate, tick counter, flush interval
│       ├── tracker.ts            # getProjectName() from workspace
│       ├── git.ts                # getTodayCommitCount() via git rev-list
│       └── supabase.ts           # Reads credentials from VS Code settings
├── dashboard/
│   ├── .env.example              # Copy to .env.local and fill in credentials
│   └── src/
│       ├── app/
│       │   ├── page.tsx          # Main dashboard (Server Component)
│       │   ├── embed/[userId]/   # Portfolio embed route
│       │   └── api/embed/        # JSON API endpoint
│       └── components/
│           ├── TotalTimeCards.tsx
│           ├── DailyBarChart.tsx
│           ├── ToolBreakdown.tsx
│           ├── ProjectTable.tsx
│           ├── Heatmap.tsx
│           ├── LiveIndicator.tsx
│           └── MeshBackground.tsx
├── SETUP.md                      # Detailed Supabase setup guide
└── README.md
```

---

## License

MIT © [Srihari Prasad S](LICENSE)
