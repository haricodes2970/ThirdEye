-- Table
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tool_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_sec INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL CHECK (source IN ('chrome', 'vscode')),
  commit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, tool_name, date)
);

-- Indexes
CREATE INDEX idx_time_entries_user_date ON time_entries (user_id, date DESC);
CREATE INDEX idx_time_entries_source ON time_entries (user_id, source, date DESC);

-- Upsert function
CREATE OR REPLACE FUNCTION upsert_time_entry(
  p_user_id UUID,
  p_tool_name TEXT,
  p_date DATE,
  p_duration_sec INTEGER,
  p_source TEXT,
  p_commit_count INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO time_entries (user_id, tool_name, date, duration_sec, source, commit_count)
  VALUES (p_user_id, p_tool_name, p_date, p_duration_sec, p_source, p_commit_count)
  ON CONFLICT (user_id, tool_name, date)
  DO UPDATE SET
    duration_sec = time_entries.duration_sec + EXCLUDED.duration_sec,
    commit_count = GREATEST(time_entries.commit_count, EXCLUDED.commit_count),
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- REPLACE 'your-uuid-here' WITH YOUR ACTUAL UUID
CREATE POLICY "User reads own data" ON time_entries FOR SELECT
  USING (user_id = 'your-uuid-here'::uuid);
CREATE POLICY "User inserts own data" ON time_entries FOR INSERT
  WITH CHECK (user_id = 'your-uuid-here'::uuid);
CREATE POLICY "User updates own data" ON time_entries FOR UPDATE
  USING (user_id = 'your-uuid-here'::uuid);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE time_entries;
