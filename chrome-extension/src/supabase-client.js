import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE THESE with your Supabase project values
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const USER_ID = 'YOUR_UUID'; // hardcoded single user

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function supabaseUpsert(toolName, durationSec, source) {
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase.rpc('upsert_time_entry', {
    p_user_id: USER_ID,
    p_tool_name: toolName,
    p_date: today,
    p_duration_sec: durationSec,
    p_source: source,
    p_commit_count: 0,
  });

  if (error) throw error;
}

export { supabase, supabaseUpsert, USER_ID };
