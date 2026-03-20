'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ToolBreakdownProps {
  data: { name: string; minutes: number }[];
}

const COLORS = ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc', '#3730a3', '#c7d2fe'];

export default function ToolBreakdown({ data }: ToolBreakdownProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No AI tool data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">AI Tool Breakdown (last 30 days)</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="minutes"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            itemStyle={{ color: '#818cf8' }}
            formatter={(v: number) => [`${v}m`, 'Time']}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
