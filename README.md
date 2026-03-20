# ThirdEye

ThirdEye is a personal AI tool usage tracker that automatically measures how much time you spend on AI tools like ChatGPT, Claude, and Grok. It runs silently in the background — a Chrome extension tracks your browser activity, a VS Code extension tracks your coding sessions, and a Next.js dashboard visualizes everything in one place. All data is stored in your own Supabase project with a single hardcoded user ID, requiring no login or manual input.

---

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) → **New Project** (free tier)
2. After the project is ready, go to **Settings → API** and copy:
   - **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
   - **anon (public)** key
3. Generate a UUID for yourself at [uuidgenerator.net](https://www.uuidgenerator.net/) — this is your permanent `user_id`
4. Open the **SQL Editor** in your Supabase dashboard and run the contents of [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)
5. In the migration SQL, replace all three occurrences of `'your-uuid-here'` with your actual UUID before running, **or** run the migration first then update the policies:
   ```sql
   DROP POLICY "User reads own data" ON time_entries;
   DROP POLICY "User inserts own data" ON time_entries;
   DROP POLICY "User updates own data" ON time_entries;

   CREATE POLICY "User reads own data" ON time_entries FOR SELECT USING (user_id = 'YOUR-UUID'::uuid);
   CREATE POLICY "User inserts own data" ON time_entries FOR INSERT WITH CHECK (user_id = 'YOUR-UUID'::uuid);
   CREATE POLICY "User updates own data" ON time_entries FOR UPDATE USING (user_id = 'YOUR-UUID'::uuid);
   ```

---

## Chrome Extension — Install

1. Open `chrome-extension/src/supabase-client.js` and replace:
   ```js
   const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   const USER_ID = 'YOUR_UUID';
   ```
2. Build the extension:
   ```bash
   cd chrome-extension
   npm install
   npm run build
   ```
3. Open Chrome → go to `chrome://extensions`
4. Enable **Developer mode** (top right toggle)
5. Click **Load unpacked** → select the `chrome-extension/dist/` folder
6. The ThirdEye icon will appear in your toolbar — click it to see today's times

Tracks **ChatGPT**, **Claude**, and **Grok** by default. Add custom AI tool URLs via the popup.

---

## Project Structure

```
ThirdEye/
  supabase/
    migrations/
      001_init.sql          # Full schema, indexes, upsert function, RLS, realtime
  chrome-extension/
    src/
      background.js         # Service worker — timer logic + Supabase flush
      trackers.js           # Default + custom tracker management
      supabase-client.js    # Supabase client (fill in your credentials)
      popup.js              # Popup UI logic
    popup.html              # Extension popup
    manifest.json           # MV3 manifest
    vite.config.js          # Bundles background.js
    vite.config.popup.js    # Bundles popup.js
```
