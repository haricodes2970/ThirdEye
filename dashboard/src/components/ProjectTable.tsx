'use client';

interface ProjectTableProps {
  data: { name: string; hours: number; commits: number }[];
}

export default function ProjectTable({ data }: ProjectTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Projects (last 30 days)</h2>
        <p className="text-gray-500 text-sm">No VS Code project data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-6">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Projects (last 30 days)</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b border-gray-800">
            <th className="text-left pb-3 font-medium">Project</th>
            <th className="text-right pb-3 font-medium">Hours</th>
            <th className="text-right pb-3 font-medium">Commits</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
              <td className="py-3 text-gray-100">{p.name}</td>
              <td className="py-3 text-right font-mono text-indigo-400">{p.hours}h</td>
              <td className="py-3 text-right font-mono text-gray-400">{p.commits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
