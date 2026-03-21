'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyBarChartProps {
  data: { date: string; minutes: number }[];
}

export default function DailyBarChart({ data }: DailyBarChartProps) {
  const formatted = data.map(d => ({
    date: d.date.slice(5),
    hours: Math.round((d.minutes / 60) * 10) / 10,
  }));

  return (
    <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Daily Activity</h3>
      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(34,211,238,0.3)',
                borderRadius: 8,
                backdropFilter: 'blur(12px)',
                color: '#fff',
                boxShadow: '0 0 15px rgba(34,211,238,0.15)',
              }}
              itemStyle={{ color: '#22d3ee' }}
              formatter={(v) => [`${v}h`, 'Hours']}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#22d3ee"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
