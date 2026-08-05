import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

import StatsCard from "@/features/dashboard/components/StatsCard";
import ContinueLearningCard from "@/features/dashboard/components/ContinueLearningCard";
import RecentCoursesCard from "@/features/dashboard/components/RecentCoursesCard";

export default function DashboardPage() {
  const { data, isLoading, isError } =
    useDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Dashboard ma'lumotlarini yuklab bo'lmadi.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Assalomu alaykum, {data.user.fullName} 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Kurslar"
            value={data.stats.enrolledCourses}
          />

          <StatsCard
            title="Tugatilgan kurslar"
            value={data.stats.completedCourses}
          />

          <StatsCard
            title="Sertifikatlar"
            value={data.stats.certificates}
          />

          <StatsCard
            title="Progress"
            value={`${data.stats.averageProgress}%`}
          />
        </div>

        <ContinueLearningCard
          data={data.continueLearning}
        />

        <RecentCoursesCard
          courses={data.recentCourses}
        />
      </div>
    </main>
  );
}