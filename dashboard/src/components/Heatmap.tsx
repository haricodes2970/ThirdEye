'use client';

interface HeatmapProps {
  data: { date: string; minutes: number }[];
}

function HeatmapCell({ minutes, date }: { minutes: number; date: string }) {
  let colorClass = 'bg-white/5 border-white/10';
  let glowStyle: React.CSSProperties = {};
  const maxRef = 120; // ~2hrs = bright cell

  if (minutes > maxRef * 0.8) {
    colorClass = 'bg-emerald-400 border-emerald-400';
    glowStyle = { boxShadow: '0 0 10px rgba(52,211,153,0.6)' };
  } else if (minutes > maxRef * 0.4) {
    colorClass = 'bg-emerald-500/80 border-emerald-500/80';
    glowStyle = { boxShadow: '0 0 8px rgba(16,185,129,0.4)' };
  } else if (minutes > 0) {
    colorClass = 'bg-emerald-700/60 border-emerald-700/60';
  }

  return (
    <div
      title={`${date}: ${minutes}m`}
      className={`w-4 h-4 rounded-sm border transition-colors duration-200 cursor-help ${colorClass}`}
      style={glowStyle}
    />
  );
}

export default function Heatmap({ data }: HeatmapProps) {
  // Pad to 35 cells (5 weeks × 7 days)
  const padded = [...data];
  while (padded.length < 35) padded.push({ date: '', minutes: 0 });
  const cells = padded.slice(0, 35);

  return (
    <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">Activity Heatmap</h3>
        <span className="text-xs text-gray-500">Last 30 Days</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 space-y-3">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 p-2 bg-white/5 rounded-lg border border-white/5">
          {cells.map((d, i) =>
            d.date ? (
              <HeatmapCell key={i} minutes={d.minutes} date={d.date} />
            ) : (
              <div key={i} className="w-4 h-4 rounded-sm bg-transparent" />
            )
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700/60 border border-emerald-700/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500/80 border border-emerald-500/80" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.5)' }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
