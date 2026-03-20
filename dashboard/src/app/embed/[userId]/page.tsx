import { getDailySummary, getToolBreakdown } from '@/lib/queries';

export const revalidate = 300; // 5 minute cache

export default async function EmbedPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const [daily, tools] = await Promise.all([
    getDailySummary(userId, 7),
    getToolBreakdown(userId, 7),
  ]);

  const totalMin = daily.reduce((sum, d) => sum + d.minutes, 0);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  return (
    <div className="p-5 bg-gray-950 text-gray-100 font-sans min-h-screen">
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">AI Tool Usage — Last 7 Days</p>
      <p className="text-3xl font-bold font-mono text-indigo-400 mb-4">
        {h > 0 ? `${h}h ${m}m` : `${m}m`}
      </p>
      <div className="space-y-2">
        {tools.map(t => (
          <div key={t.name} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{t.name}</span>
            <span className="font-mono text-indigo-400">{t.minutes}m</span>
          </div>
        ))}
        {tools.length === 0 && (
          <p className="text-gray-600 text-sm">No data yet</p>
        )}
      </div>
      <p className="text-xs text-gray-700 mt-4">powered by ThirdEye</p>
    </div>
  );
}
