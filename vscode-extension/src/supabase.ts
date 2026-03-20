import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as vscode from 'vscode';

let supabase: SupabaseClient | null = null;
let userId: string = '';

export function createSupabaseClient(): boolean {
  const config = vscode.workspace.getConfiguration('thirdeye');
  const url = config.get<string>('supabaseUrl') || '';
  const key = config.get<string>('supabaseAnonKey') || '';
  userId = config.get<string>('userId') || '';

  if (!url || !key || !userId) {
    vscode.window.showWarningMessage(
      'ThirdEye: Missing config. Set thirdeye.supabaseUrl, thirdeye.supabaseAnonKey, and thirdeye.userId in settings.'
    );
    return false;
  }

  supabase = createClient(url, key);
  return true;
}

export async function upsertTimeEntry(data: {
  toolName: string;
  durationSec: number;
  source: string;
  commitCount: number;
}): Promise<void> {
  if (!supabase) return;

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase.rpc('upsert_time_entry', {
    p_user_id: userId,
    p_tool_name: data.toolName,
    p_date: today,
    p_duration_sec: data.durationSec,
    p_source: data.source,
    p_commit_count: data.commitCount,
  });

  if (error) throw error;
}
