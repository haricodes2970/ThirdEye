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
    <div className="flex items-center gap-2 text-sm text-green-400">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      Active on {lastUpdate}
    </div>
  );
}
