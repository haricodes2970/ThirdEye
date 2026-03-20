'use client';

interface ProjectTableProps {
  data: { name: string; hours: number; commits: number }[];
}

const glassStyle = {
  background: 'rgba(0,0,0,0.3)',
};

export default function ProjectTable({ data }: ProjectTableProps) {
  if (data.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 border border-white/10 backdrop-blur-md mt-6"
        style={glassStyle}
      >
        <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
          Projects — Last 30 Days
        </h2>
        <p className="text-gray-600 text-sm">No VS Code project data yet</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 border border-white/10 backdrop-blur-md mt-6"
      style={glassStyle}
    >
      <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
        Projects — Last 30 Days
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <th className="text-left pb-3 font-medium text-gray-600 text-xs uppercase tracking-wider">
              Project
            </th>
            <th className="text-right pb-3 font-medium text-gray-600 text-xs uppercase tracking-wider">
              Hours
            </th>
            <th className="text-right pb-3 font-medium text-gray-600 text-xs uppercase tracking-wider">
              Commits
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr
              key={i}
              className="transition-colors"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
              }}
            >
              <td className="py-3 text-gray-200">{p.name}</td>
              <td className="py-3 text-right font-mono text-indigo-400">{p.hours}h</td>
              <td className="py-3 text-right">
                {p.commits > 0 ? (
                  <span
                    className="inline-block font-mono text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(99,102,241,0.15)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99,102,241,0.2)',
                    }}
                  >
                    {p.commits} commits
                  </span>
                ) : (
                  <span className="text-gray-700 font-mono">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
