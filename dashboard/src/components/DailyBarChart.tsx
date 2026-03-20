'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DailyBarChartProps {
  data: { date: string; minutes: number }[];
}

export default function DailyBarChart({ data }: DailyBarChartProps) {
  const formatted = data.map(d => ({
    ...d,
    label: d.date.slice(5), // "MM-DD"
  }));

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Daily Activity (last 30 days)</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#818cf8' }}
            formatter={(v: number) => [`${v}m`, 'Time']}
          />
          <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
