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

export default function TotalTimeCards({ aiMinutes, codeMinutes }: TotalTimeCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <p className="text-sm text-gray-400 mb-1">AI Tool Time — This Month</p>
        <p className="text-3xl font-bold font-mono text-indigo-400">{formatMinutes(aiMinutes)}</p>
        <p className="text-xs text-gray-500 mt-1">ChatGPT · Claude · Grok</p>
      </div>
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <p className="text-sm text-gray-400 mb-1">Coding Time — This Month</p>
        <p className="text-3xl font-bold font-mono text-indigo-400">{formatMinutes(codeMinutes)}</p>
        <p className="text-xs text-gray-500 mt-1">VS Code · Cursor · Antigravity</p>
      </div>
    </div>
  );
}
