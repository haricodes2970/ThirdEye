import { getDailySummary, getToolBreakdown, getProjects, getMonthlyTotals } from '@/lib/queries';
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

  return (
    <main className="min-h-screen text-gray-100 p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 fade-slide-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            &#128065; ThirdEye
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest">
            AI &amp; Code Activity
          </p>
        </div>
        <LiveIndicator userId={userId} />
      </div>

      {/* Summary cards */}
      <div className="fade-slide-up delay-100">
        <TotalTimeCards aiMinutes={monthly.aiMinutes} codeMinutes={monthly.codeMinutes} />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-slide-up delay-200">
        <DailyBarChart data={daily} />
        <ToolBreakdown data={tools} />
      </div>

      {/* Project table */}
      <div className="fade-slide-up delay-300">
        <ProjectTable data={projects} />
      </div>

      {/* Heatmap */}
      <div className="fade-slide-up delay-400">
        <Heatmap data={daily} />
      </div>
    </main>
  );
}
