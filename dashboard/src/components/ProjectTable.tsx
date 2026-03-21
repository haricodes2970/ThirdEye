'use client';

interface ProjectTableProps {
  data: { name: string; hours: number; commits: number }[];
}

export default function ProjectTable({ data }: ProjectTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-black/20 border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Projects</h3>
        <p className="text-gray-600 text-sm">No VS Code project data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-black/20 border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Projects — Last 30 Days</h3>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <th className="text-left pb-2 font-medium text-gray-500 text-xs uppercase tracking-wider">Project</th>
            <th className="text-right pb-2 font-medium text-gray-500 text-xs uppercase tracking-wider">Hours</th>
            <th className="text-right pb-2 font-medium text-gray-500 text-xs uppercase tracking-wider">Commits</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr
              key={i}
              className="hover:bg-white/5 transition-colors"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <td className="py-2.5 text-gray-200">{p.name}</td>
              <td className="py-2.5 text-right font-mono text-cyan-400">{p.hours}h</td>
              <td className="py-2.5 text-right">
                {p.commits > 0 ? (
                  <span
                    className="inline-block font-mono text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(217,70,239,0.12)',
                      color: '#e879f9',
                      border: '1px solid rgba(217,70,239,0.25)',
                    }}
                  >
                    {p.commits}
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
