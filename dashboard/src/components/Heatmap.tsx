'use client';

interface HeatmapProps {
  data: { date: string; minutes: number }[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const maxMin = Math.max(...data.map(d => d.minutes), 1);

  const getColor = (min: number) => {
    if (min === 0) return 'bg-gray-800';
    const ratio = min / maxMin;
    if (ratio < 0.25) return 'bg-indigo-900';
    if (ratio < 0.5) return 'bg-indigo-700';
    if (ratio < 0.75) return 'bg-indigo-500';
    return 'bg-indigo-400';
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-6">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Activity Heatmap</h2>
      <div className="flex flex-wrap gap-1">
        {data.map(d => (
          <div
            key={d.date}
            className={`w-4 h-4 rounded-sm ${getColor(d.minutes)} cursor-default`}
            title={`${d.date}: ${d.minutes}m`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-gray-500">Less</span>
        {['bg-gray-800', 'bg-indigo-900', 'bg-indigo-700', 'bg-indigo-500', 'bg-indigo-400'].map(c => (
          <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-xs text-gray-500">More</span>
      </div>
    </div>
  );
}
