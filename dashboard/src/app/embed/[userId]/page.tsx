import { getDailySummary, getToolBreakdown } from '@/lib/queries';
import MeshBackground from '@/components/MeshBackground';

export const revalidate = 300;

const TOOL_COLORS: Record<string, string> = {
  'ChatGPT': '#06b6d4',
  'Claude':  '#d946ef',
  'Grok':    '#a855f7',
};

const FALLBACK_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default async function EmbedPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const [daily, tools] = await Promise.all([
    getDailySummary(userId, 7),
    getToolBreakdown(userId, 7),
  ]);

  const totalMin = daily.reduce((sum, d) => sum + d.minutes, 0);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', position: 'relative' }}>
      <MeshBackground nodeCount={35} />
      <div style={{ position: 'relative', zIndex: 10, padding: 20 }}>
        <div
          style={{
            background: 'rgba(2,6,23,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: '20px 24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.36)',
          }}
        >
          {/* Header */}
          <p style={{
            fontSize: 11,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 6,
            fontFamily: 'system-ui, sans-serif',
          }}>
            AI Tool Usage — Last 7 Days
          </p>
          <p style={{
            fontSize: 30,
            fontWeight: 800,
            fontFamily: 'monospace',
            background: 'linear-gradient(to right, #22d3ee, #d946ef, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 16,
            lineHeight: 1,
          }}>
            {h > 0 ? `${h}h ${m}m` : `${m}m`}
          </p>

          {/* Tool list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tools.map((t, i) => {
              const color = TOOL_COLORS[t.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
              return (
                <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontFamily: 'system-ui, sans-serif' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                    <span style={{ color: '#d1d5db' }}>{t.name}</span>
                  </div>
                  <span style={{ fontFamily: 'monospace', color, fontSize: 12 }}>{t.minutes}m</span>
                </div>
              );
            })}
            {tools.length === 0 && (
              <p style={{ color: '#374151', fontSize: 13 }}>No data yet</p>
            )}
          </div>

          <p style={{ fontSize: 10, color: '#1f2937', marginTop: 16, fontFamily: 'system-ui, sans-serif' }}>
            powered by ThirdEye
          </p>
        </div>
      </div>
    </div>
  );
}
