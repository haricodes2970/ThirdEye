'use client';

interface HeatmapProps {
  data: { date: string; minutes: number }[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const maxMin = Math.max(...data.map(d => d.minutes), 1);

  const getCellStyle = (min: number) => {
    if (min === 0) return { background: 'rgba(255,255,255,0.04)' };
    const ratio = min / maxMin;
    if (ratio < 0.25) return { background: 'rgba(79,70,229,0.25)' };
    if (ratio < 0.5)  return { background: 'rgba(99,102,241,0.45)' };
    if (ratio < 0.75) return { background: 'rgba(129,140,248,0.65)' };
    return { background: 'rgba(199,210,254,0.85)' };
  };

  const legendCells = [
    { style: { background: 'rgba(255,255,255,0.04)' } },
    { style: { background: 'rgba(79,70,229,0.25)' } },
    { style: { background: 'rgba(99,102,241,0.45)' } },
    { style: { background: 'rgba(129,140,248,0.65)' } },
    { style: { background: 'rgba(199,210,254,0.85)' } },
  ];

  return (
    <div
      className="rounded-2xl p-6 border border-white/10 backdrop-blur-md mt-6"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
        Activity Heatmap
      </h2>
      <div className="flex flex-wrap gap-1">
        {data.map(d => (
          <div
            key={d.date}
            className="w-4 h-4 rounded-sm cursor-default transition-opacity hover:opacity-80"
            style={getCellStyle(d.minutes)}
            title={`${d.date}: ${d.minutes}m`}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-xs text-gray-600">Less</span>
        {legendCells.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={c.style} />
        ))}
        <span className="text-xs text-gray-600">More</span>
      </div>
    </div>
  );
}
