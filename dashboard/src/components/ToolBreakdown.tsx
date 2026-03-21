'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ToolBreakdownProps {
  data: { name: string; minutes: number }[];
}

const TOOL_COLORS: Record<string, string> = {
  'ChatGPT': '#06b6d4',
  'Claude':  '#d946ef',
  'Grok':    '#a855f7',
};

const FALLBACK_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

function getColor(name: string, index: number): string {
  return TOOL_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export default function ToolBreakdown({ data }: ToolBreakdownProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('monthly');
  const total = data.reduce((sum, d) => sum + d.minutes, 0);
  const totalH = Math.floor(total / 60);
  const totalM = total % 60;

  if (data.length === 0) {
    return (
      <div className="flex flex-col h-full text-white items-center justify-center">
        <p className="text-gray-500 text-sm">No AI tool data yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(217,70,239,0.3)] tracking-wide">
          AI Tools Usage
        </h2>
        {/* Toggle */}
        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 backdrop-blur-md">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-300 ${
              viewMode === 'daily'
                ? 'bg-gradient-to-r from-fuchsia-500/80 to-purple-500/80 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-300 ${
              viewMode === 'monthly'
                ? 'bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Donut chart */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="h-52 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="minutes"
                stroke="none"
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, i) => {
                  const color = getColor(entry.name, i);
                  return (
                    <Cell
                      key={i}
                      fill={color}
                      style={{ filter: `drop-shadow(0px 0px 8px ${color}99)` }}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  backdropFilter: 'blur(12px)',
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)',
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(v) => [`${v}m`, 'Time']}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold font-mono text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {totalH > 0 ? `${totalH}h ${totalM}m` : `${totalM}m`}
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">
              {viewMode}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {data.map((item, i) => {
            const color = getColor(item.name, i);
            return (
              <div key={item.name} className="flex items-center justify-between group">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full transition-colors shrink-0"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors truncate text-xs">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-gray-200 text-xs ml-1 shrink-0">{item.minutes}m</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
