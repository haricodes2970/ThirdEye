import { getDailySummary, getToolBreakdown, getProjects, getMonthlyTotals } from '@/lib/queries';
import TotalTimeCards from '@/components/TotalTimeCards';
import DailyBarChart from '@/components/DailyBarChart';
import ToolBreakdown from '@/components/ToolBreakdown';
import ProjectTable from '@/components/ProjectTable';
import Heatmap from '@/components/Heatmap';
import LiveIndicator from '@/components/LiveIndicator';

export const revalidate = 60; // revalidate every 60s

export default async function Dashboard() {
  const userId = process.env.NEXT_PUBLIC_USER_ID!;

  const [daily, tools, projects, monthly] = await Promise.all([
    getDailySummary(userId, 30),
    getToolBreakdown(userId, 30),
    getProjects(userId, 30),
    getMonthlyTotals(userId),
  ]);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">&#128065; ThirdEye</h1>
        <LiveIndicator userId={userId} />
      </div>

      <TotalTimeCards aiMinutes={monthly.aiMinutes} codeMinutes={monthly.codeMinutes} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyBarChart data={daily} />
        <ToolBreakdown data={tools} />
      </div>

      <ProjectTable data={projects} />
      <Heatmap data={daily} />
    </main>
  );
}
