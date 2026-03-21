'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LiveIndicator({ userId }: { userId: string }) {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('live-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'time_entries',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setLastUpdate((payload.new as { tool_name: string }).tool_name);
          setTimeout(() => setLastUpdate(null), 5000);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  if (!lastUpdate) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-fuchsia-300 px-3 py-1.5 rounded-full border border-fuchsia-500/25 bg-black/40 backdrop-blur-md shadow-[0_0_12px_rgba(217,70,239,0.15)]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-400" />
      </span>
      Active on {lastUpdate}
    </div>
  );
}
