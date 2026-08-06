import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton";
import StatsCard from "@/features/dashboard/components/StatsCard";
import ContinueLearningCard from "@/features/dashboard/components/ContinueLearningCard";
import RecentCoursesCard from "@/features/dashboard/components/RecentCoursesCard";
import { EmptyState } from "@/components/common/empty-state";


export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
  return <DashboardSkeleton />;
}

  if (!data) {
  return (
    <EmptyState
      title="Dashboard mavjud emas"
      description="Hozircha ko'rsatish uchun ma'lumot topilmadi."
    />
  );
}

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Xush kelibsiz, {data.user.fullName}
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatsCard
          title="Kurslar"
          value={data.stats.enrolledCourses}
        />

        <StatsCard
          title="Yakunlangan kurslar"
          value={data.stats.completedCourses}
        />

        <StatsCard
          title="Yakunlangan darslar"
          value={data.stats.completedLessons}
        />

        <StatsCard
          title="Sertifikatlar"
          value={data.stats.certificates}
        />
      </div>

      <ContinueLearningCard
        data={data.continueLearning}
      />

      <RecentCoursesCard
        courses={data.recentCourses}
      />
    </div>
  );
}