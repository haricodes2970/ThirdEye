import { getDailySummary, getToolBreakdown } from '@/lib/queries';
import MeshBackground from '@/components/MeshBackground';

export const revalidate = 300;

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
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          color: '#f3f4f6',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '20px 24px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: '#4b5563',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 6,
            }}
          >
            AI Tool Usage — Last 7 Days
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#818cf8',
              marginBottom: 16,
              lineHeight: 1,
            }}
          >
            {h > 0 ? `${h}h ${m}m` : `${m}m`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tools.map(t => (
              <div
                key={t.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                }}
              >
                <span style={{ color: '#9ca3af' }}>{t.name}</span>
                <span style={{ fontFamily: 'monospace', color: '#a5b4fc', fontSize: 12 }}>
                  {t.minutes}m
                </span>
              </div>
            ))}
            {tools.length === 0 && (
              <p style={{ color: '#374151', fontSize: 13 }}>No data yet</p>
            )}
          </div>
          <p style={{ fontSize: 10, color: '#1f2937', marginTop: 16 }}>powered by ThirdEye</p>
        </div>
      </div>
    </div>
  );
}
