interface TotalTimeCardsProps {
  aiMinutes: number;
  codeMinutes: number;
  totalCommits: number;
  projectCount: number;
}

function formatMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export default function TotalTimeCards({ aiMinutes, codeMinutes, totalCommits, projectCount }: TotalTimeCardsProps) {
  const stats = [
    {
      label: 'Hours',
      value: formatMinutes(codeMinutes),
      icon: '⏱',
      accent: 'text-cyan-400',
      glow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
      labelColor: 'text-cyan-300',
    },
    {
      label: 'Commits',
      value: totalCommits.toString(),
      icon: '⊕',
      accent: 'text-emerald-400',
      glow: 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
      labelColor: 'text-emerald-300',
    },
    {
      label: 'Projects',
      value: projectCount.toString(),
      icon: '◈',
      accent: 'text-fuchsia-400',
      glow: 'drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]',
      labelColor: 'text-fuchsia-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors group"
        >
          <div className={`flex items-center space-x-2 ${stat.accent} mb-1 ${stat.glow}`}>
            <span className="text-sm">{stat.icon}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider ${stat.labelColor}`}>
              {stat.label}
            </span>
          </div>
          <span className="text-3xl font-bold font-mono text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
