'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DailyBarChartProps {
  data: { date: string; minutes: number }[];
}

const glassStyle = {
  background: 'rgba(0,0,0,0.3)',
};

const tooltipStyle = {
  background: 'rgba(5,5,15,0.85)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  backdropFilter: 'blur(12px)',
};

export default function DailyBarChart({ data }: DailyBarChartProps) {
  const formatted = data.map(d => ({
    ...d,
    label: d.date.slice(5),
  }));

  return (
    <div
      className="rounded-2xl p-6 border border-white/10 backdrop-blur-md"
      style={glassStyle}
    >
      <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
        Daily Activity — Last 30 Days
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'var(--font-geist-mono)' }}
            interval="preserveStartEnd"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'var(--font-geist-mono)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#6b7280', fontSize: 11 }}
            itemStyle={{ color: '#818cf8', fontSize: 12, fontFamily: 'var(--font-geist-mono)' }}
            cursor={{ fill: 'rgba(99,102,241,0.06)' }}
            formatter={(v: number) => [`${v}m`, 'Time']}
          />
          <Bar dataKey="minutes" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
