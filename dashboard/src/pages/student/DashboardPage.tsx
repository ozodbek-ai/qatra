import { EmptyState } from "@/components/common/empty-state";
import { useDashboard } from "@/hooks/useDashboard";
import RecommendedCoursesCard from "@/features/dashboard/components/RecommendedCoursesCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import StatsCard from "@/components/dashboard/StatsCard";
import ContinueLearningCard from "@/components/dashboard/ContinueLearningCard";
import RecentCoursesCard from "@/components/dashboard/RecentCoursesCard";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Dashboard yuklanmadi"
        description="Dashboard ma'lumotlarini yuklashda xatolik yuz berdi."
      />
    );
  }

  return (
    <main className="space-y-8 p-8">

      {/* Welcome */}

      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Xush kelibsiz, {data.user.fullName}
        </h1>

        <p className="mt-2 text-slate-500">
          O'qishingizdagi holatni shu yerdan
          kuzatishingiz mumkin.
        </p>
      </section>

      {/* Weekly Login Activity */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Haftalik faollik
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Shu hafta tizimga kirgan kunlaringiz.
            </p>
          </div>

          <span className="text-sm font-medium text-slate-500">
            {data.loginDays.filter(
              (day) => day.loggedIn
            ).length}
            /7 kun
          </span>

        </div>

        <div className="mt-6 grid grid-cols-7 gap-2">

          {data.loginDays.map((day) => (
            <div
              key={day.date}
              className="flex flex-col items-center gap-3"
            >
              <div
                className={`h-4 w-4 rounded-full transition-colors ${
                  day.loggedIn
                    ? "bg-blue-500"
                    : "bg-slate-300"
                }`}
                title={
                  day.loggedIn
                    ? `${day.day} — tizimga kirgansiz`
                    : `${day.day} — tizimga kirmagansiz`
                }
              />

              <span className="text-xs font-medium text-slate-500">
                {day.day}
              </span>
            </div>
          ))}

        </div>

        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-slate-500">

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Kirilgan kun
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            Kirilmagan kun
          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

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

        <StatsCard
          title="O'rtacha progress"
          value={`${data.stats.averageProgress}%`}
        />

      </section>

      {/* Continue Learning */}

      <section>
        <ContinueLearningCard
          data={data.continueLearning}
        />
      </section>
      <section>
  <RecommendedCoursesCard
    courses={data.recommendedCourses}
  />
</section>

      {/* Recent Courses */}

      <section>
        <RecentCoursesCard
          courses={data.recentCourses}
        />
      </section>

    </main>
  );
}