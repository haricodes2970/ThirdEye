# ThirdEye — Detailed Setup Guide

This guide walks you through setting up ThirdEye from scratch. Follow in order.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (free account)
2. Click **New Project**
3. Choose an org, give it a name (e.g. `thirdeye`), set a strong DB password, pick a region close to you
4. Wait ~2 minutes for the project to spin up

### Find your credentials

Go to your project → **Settings** (gear icon, bottom left) → **API**:

- **Project URL** — looks like `https://abcdefghijkl.supabase.co`
- **anon public** key — a long `eyJ...` string under "Project API keys"

Copy both — you'll need them in every component.

---

## 2. Run the Database Migration

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click **+ New query**
3. Copy the entire contents of [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql) and paste it
4. **Before running**, replace all three occurrences of `'your-uuid-here'` with your UUID (see step 3 below)
5. Click **Run** (Ctrl+Enter)

You should see: `Success. No rows returned.`

This creates:
- `time_entries` table
- Two query indexes
- `upsert_time_entry()` Postgres function
- RLS policies (locked to your UUID)
- Realtime publication

---

## 3. Generate Your UUID

Go to [uuidgenerator.net](https://www.uuidgenerator.net/) and copy the UUID shown.

Example: `712e7996-6a09-4656-b336-fd7a752c2a09`

This is your permanent `user_id`. Save it somewhere — you'll use it in all three components.

**If you already ran the migration with `'your-uuid-here'`**, update the RLS policies now:

```sql
DROP POLICY "User reads own data" ON time_entries;
DROP POLICY "User inserts own data" ON time_entries;
DROP POLICY "User updates own data" ON time_entries;

CREATE POLICY "User reads own data" ON time_entries FOR SELECT
  USING (user_id = 'YOUR-UUID-HERE'::uuid);
CREATE POLICY "User inserts own data" ON time_entries FOR INSERT
  WITH CHECK (user_id = 'YOUR-UUID-HERE'::uuid);
CREATE POLICY "User updates own data" ON time_entries FOR UPDATE
  USING (user_id = 'YOUR-UUID-HERE'::uuid);
```

Paste into SQL Editor, replace `YOUR-UUID-HERE`, and run.

---

## 4. Chrome Extension — Fill Credentials

Open `chrome-extension/src/supabase-client.js` and replace the three placeholder values:

```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';  // ← your project URL
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';                // ← your anon key
const USER_ID = 'YOUR_UUID';                               // ← your UUID
```

Then build and load:

```bash
cd chrome-extension
npm install
npm run build
```

Open `chrome://extensions` (or `brave://extensions`) → enable **Developer mode** → **Load unpacked** → select `chrome-extension/dist/`.

---

## 5. VS Code Extension — Fill Credentials

After compiling the extension (`npm run compile` in `vscode-extension/`), open VS Code Settings:

Press `Ctrl+Shift+P` → **Open User Settings (JSON)** and add:

```json
"thirdeye.supabaseUrl": "https://YOUR_PROJECT.supabase.co",
"thirdeye.supabaseAnonKey": "YOUR_ANON_KEY",
"thirdeye.userId": "YOUR_UUID"
```

Install via `Ctrl+Shift+P` → **Developer: Install Extension from Location** → select the `vscode-extension/` folder.

---

## 6. Dashboard — Fill Credentials

Copy the example env file and fill it in:

```bash
cp dashboard/.env.example dashboard/.env.local
```

Edit `dashboard/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_USER_ID=YOUR_UUID
```

Run locally:

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 7. Verify Everything Works

### Test RLS is set up correctly

In Supabase SQL Editor, run:

```sql
-- Insert a test row
INSERT INTO time_entries (user_id, tool_name, date, duration_sec, source)
VALUES ('YOUR-UUID-HERE', 'TestTool', CURRENT_DATE, 60, 'chrome');

-- Read it back
SELECT * FROM time_entries WHERE user_id = 'YOUR-UUID-HERE';
```

You should see your test row. If you get an RLS error, double-check the UUID in your policies matches the one you used.

### Confirm the Chrome extension is writing data

1. Open [claude.ai](https://claude.ai) — the ThirdEye popup should show a timer counting up
2. Wait 1 minute (the alarm flush interval)
3. In Supabase → **Table Editor** → `time_entries` — you should see a row: `tool_name: Claude`, `source: chrome`

### Confirm the VS Code extension is writing data

1. Open any folder in VS Code — the `$(eye) ThirdEye` status bar item should appear
2. Type something, wait 60 seconds
3. In Supabase → `time_entries` — you should see a new row: `tool_name: <your folder name>`, `source: vscode`

---

## Troubleshooting

**Chrome extension popup is blank** — credentials are wrong or Supabase URL is invalid. Check the browser console (right-click popup → Inspect).

**VS Code extension shows warning** — open Settings and make sure all three `thirdeye.*` values are filled in.

**Dashboard shows no data** — check `.env.local` values and confirm the table has rows in Supabase.

**RLS blocking writes** — the UUID in your RLS policies must exactly match the `USER_ID` / `userId` / `NEXT_PUBLIC_USER_ID` you set in each component.
