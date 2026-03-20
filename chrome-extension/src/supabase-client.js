import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE THESE with your Supabase project values
const SUPABASE_URL = 'https://nxmusgkffmlfyizktgvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54bXVzZ2tmZm1sZnlpemt0Z3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTkzNTQsImV4cCI6MjA4OTU3NTM1NH0.zRmGifgCbwO3QHs4OLT8KG_D8JvmoQaqtrIMCm1TaXM';
const USER_ID = '712e7996-6a09-4656-b336-fd7a752c2a09'; // hardcoded single user

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
