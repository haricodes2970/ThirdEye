import { getDailySummary, getToolBreakdown, getProjects, getMonthlyTotals } from '@/lib/queries';
import GlassPanel from '@/components/GlassPanel';
import TotalTimeCards from '@/components/TotalTimeCards';
import DailyBarChart from '@/components/DailyBarChart';
import ToolBreakdown from '@/components/ToolBreakdown';
import ProjectTable from '@/components/ProjectTable';
import Heatmap from '@/components/Heatmap';
import LiveIndicator from '@/components/LiveIndicator';

export const revalidate = 60;

export default async function Dashboard() {
  const userId = process.env.NEXT_PUBLIC_USER_ID!;

  const [daily, tools, projects, monthly] = await Promise.all([
    getDailySummary(userId, 30),
    getToolBreakdown(userId, 30),
    getProjects(userId, 30),
    getMonthlyTotals(userId),
  ]);

  const totalCommits = projects.reduce((sum, p) => sum + p.commits, 0);

  return (
    <main className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30">
      <div className="relative z-10 w-full min-h-screen p-6 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col pt-12 md:pt-16">

        {/* Header */}
        <header className="mb-10 flex items-center justify-between fade-slide-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 drop-shadow-[0_0_20px_rgba(217,70,239,0.6)]">
              THIRD EYE
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
              AI &amp; Code Activity
            </p>
          </div>
          <LiveIndicator userId={userId} />
        </header>

        {/* 2-panel grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 fade-slide-up delay-100">

          {/* Left — AI Tools */}
          <GlassPanel className="lg:col-span-1 min-h-[480px] ring-1 ring-white/10 hover:ring-fuchsia-500/50 hover:bg-fuchsia-500/5">
            <ToolBreakdown data={tools} />
          </GlassPanel>

          {/* Right — Code Activities */}
          <GlassPanel className="lg:col-span-2 min-h-[480px] ring-1 ring-white/10 hover:ring-cyan-500/50 hover:bg-cyan-500/5">
            <div className="flex flex-col h-full space-y-6">

              {/* Code panel header */}
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.4)] tracking-wide">
                  Code Activities
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">Last 30 Days Overview</p>
              </div>

              {/* Stats cards */}
              <TotalTimeCards
                aiMinutes={monthly.aiMinutes}
                codeMinutes={monthly.codeMinutes}
                totalCommits={totalCommits}
                projectCount={projects.length}
              />

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <DailyBarChart data={daily} />
                <Heatmap data={daily} />
              </div>

              {/* Project table */}
              <ProjectTable data={projects} />

            </div>
          </GlassPanel>

        </div>
      </div>
    </main>
  );
}
