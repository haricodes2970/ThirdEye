import { supabase } from './supabase';

// Daily summary: total seconds per day (all tools combined)
export async function getDailySummary(userId: string, days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('time_entries')
    .select('date, duration_sec, tool_name, source')
    .eq('user_id', userId)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;

  const byDate = new Map<string, number>();
  for (const row of data) {
    byDate.set(row.date, (byDate.get(row.date) || 0) + row.duration_sec);
  }

  return Array.from(byDate.entries()).map(([date, sec]) => ({
    date,
    minutes: Math.round(sec / 60),
  }));
}

// Tool breakdown: total time per AI tool (chrome source only)
export async function getToolBreakdown(userId: string, days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('time_entries')
    .select('tool_name, duration_sec')
    .eq('user_id', userId)
    .eq('source', 'chrome')
    .gte('date', since.toISOString().split('T')[0]);

  if (error) throw error;

  const totals = new Map<string, number>();
  for (const row of data) {
    totals.set(row.tool_name, (totals.get(row.tool_name) || 0) + row.duration_sec);
  }

  return Array.from(totals.entries())
    .map(([name, sec]) => ({ name, minutes: Math.round(sec / 60) }))
    .sort((a, b) => b.minutes - a.minutes);
}

// Projects: time + commits per project (vscode source only)
export async function getProjects(userId: string, days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('time_entries')
    .select('tool_name, duration_sec, commit_count, date')
    .eq('user_id', userId)
    .eq('source', 'vscode')
    .gte('date', since.toISOString().split('T')[0]);

  if (error) throw error;

  const projects = new Map<string, { totalSec: number; totalCommits: number }>();
  for (const row of data) {
    const p = projects.get(row.tool_name) || { totalSec: 0, totalCommits: 0 };
    p.totalSec += row.duration_sec;
    p.totalCommits += row.commit_count;
    projects.set(row.tool_name, p);
  }

  return Array.from(projects.entries())
    .map(([name, { totalSec, totalCommits }]) => ({
      name,
      hours: Math.round((totalSec / 3600) * 10) / 10,
      commits: totalCommits,
    }))
    .sort((a, b) => b.hours - a.hours);
}

// Monthly totals for summary cards
export async function getMonthlyTotals(userId: string) {
  const since = new Date();
  since.setDate(1); // start of current month

  const { data, error } = await supabase
    .from('time_entries')
    .select('duration_sec, source')
    .eq('user_id', userId)
    .gte('date', since.toISOString().split('T')[0]);

  if (error) throw error;

  const aiSec = data.filter(r => r.source === 'chrome').reduce((s, r) => s + r.duration_sec, 0);
  const codeSec = data.filter(r => r.source === 'vscode').reduce((s, r) => s + r.duration_sec, 0);

  return {
    aiMinutes: Math.round(aiSec / 60),
    codeMinutes: Math.round(codeSec / 60),
  };
}
