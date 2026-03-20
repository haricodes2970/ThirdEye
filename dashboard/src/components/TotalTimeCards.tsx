interface TotalTimeCardsProps {
  aiMinutes: number;
  codeMinutes: number;
}

function formatMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

const cardBase =
  'rounded-2xl p-6 border border-white/10 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_28px_rgba(99,102,241,0.12)]';

const cardStyle = {
  background: 'rgba(0,0,0,0.3)',
};

export default function TotalTimeCards({ aiMinutes, codeMinutes }: TotalTimeCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className={cardBase} style={cardStyle}>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">AI Tool Time — This Month</p>
        <p className="text-4xl font-bold font-mono text-indigo-400 tracking-tight">
          {formatMinutes(aiMinutes)}
        </p>
        <p className="text-xs text-gray-600 mt-2">ChatGPT · Claude · Grok</p>
      </div>
      <div className={cardBase} style={cardStyle}>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Coding Time — This Month</p>
        <p className="text-4xl font-bold font-mono text-purple-400 tracking-tight">
          {formatMinutes(codeMinutes)}
        </p>
        <p className="text-xs text-gray-600 mt-2">VS Code · Cursor · Antigravity</p>
      </div>
    </div>
  );
}
