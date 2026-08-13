import {
  Users,
  ShieldCheck,
  BookOpen,
  FileText,
  ClipboardList,
  GraduationCap,
  CheckCircle2,
  Trophy,
} from "lucide-react";

import { useAdminDashboard } from "@/features/admin/hooks/useAdminDashboard";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Ma'lumotlar yuklanmoqda...
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl border bg-[var(--color-card)]"
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="mt-8 rounded-xl border border-red-300 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Dashboard ma'lumotlarini yuklab bo'lmadi.
          </h2>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  const { overview, quiz, latestStudents } =
    data;

  const statistics = [
    {
      title: "Studentlar",
      value: overview.students,
      icon: Users,
    },
    {
      title: "Adminlar",
      value: overview.admins,
      icon: ShieldCheck,
    },
    {
      title: "Kurslar",
      value: overview.courses,
      icon: BookOpen,
    },
    {
      title: "Darslar",
      value: overview.lessons,
      icon: FileText,
    },
    {
      title: "Quizlar",
      value: overview.quizzes,
      icon: ClipboardList,
    },
    {
      title: "Enrollmentlar",
      value: overview.enrollments,
      icon: GraduationCap,
    },
    {
      title: "Tugatilgan darslar",
      value: overview.completedLessons,
      icon: CheckCircle2,
    },
    {
      title: "Quiz urinishlari",
      value: quiz.attempts,
      icon: Trophy,
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Platformaning umumiy statistikasi va
          faoliyati.
        </p>
      </div>

      {/* Statistikalar */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">
                    {item.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {item.value}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--color-border)] p-3">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quiz statistikasi */}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm text-[var(--color-muted)]">
            Quizlar bo'yicha o'rtacha natija
          </p>

          <p className="mt-2 text-4xl font-bold">
            {quiz.averageScore}%
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm text-[var(--color-muted)]">
            Jami quiz urinishlari
          </p>

          <p className="mt-2 text-4xl font-bold">
            {quiz.attempts}
          </p>
        </div>
      </div>

      {/* Oxirgi studentlar */}

      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Yaqinda qo'shilgan studentlar
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Platformaga oxirgi qo'shilgan 5 ta
            student.
          </p>
        </div>

        {latestStudents.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Hozircha studentlar mavjud emas.
          </div>
        ) : (
          <div>
            {latestStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] p-5 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-semibold">
                    {student.fullName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {student.fullName}
                    </p>

                    <p className="truncate text-sm text-[var(--color-muted)]">
                      {student.email}
                    </p>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-xs text-[var(--color-muted)]">
                    Ro'yxatdan o'tgan
                  </p>

                  <p className="text-sm">
                    {new Date(
                      student.createdAt
                    ).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}