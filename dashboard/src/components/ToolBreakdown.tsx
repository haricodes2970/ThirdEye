'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ToolBreakdownProps {
  data: { name: string; minutes: number }[];
}

const COLORS = ['#818cf8', '#a78bfa', '#6366f1', '#c4b5fd', '#4f46e5', '#e0e7ff'];

const glassStyle = {
  background: 'rgba(0,0,0,0.3)',
};

const tooltipStyle = {
  background: 'rgba(5,5,15,0.85)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  backdropFilter: 'blur(12px)',
};

export default function ToolBreakdown({ data }: ToolBreakdownProps) {
  if (data.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 border border-white/10 backdrop-blur-md flex items-center justify-center"
        style={glassStyle}
      >
        <p className="text-gray-600 text-sm">No AI tool data yet</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 border border-white/10 backdrop-blur-md"
      style={glassStyle}
    >
      <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
        AI Tool Breakdown — Last 30 Days
      </h2>
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
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            itemStyle={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'var(--font-geist-mono)' }}
            formatter={(v: number) => [`${v}m`, 'Time']}
          />
          <Legend
            iconType="circle"
            iconSize={6}
            formatter={(value) => (
              <span style={{ color: '#6b7280', fontSize: 11 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
