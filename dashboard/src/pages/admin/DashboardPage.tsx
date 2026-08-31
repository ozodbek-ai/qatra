import {
  Users,
  UserCheck,
  ShieldCheck,
  BookOpen,
  FileText,
  ClipboardList,
  GraduationCap,
  CheckCircle2,
  Award,
  Trophy,
  TrendingUp,
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
      <div className="p-6 md:p-8">
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
                className="h-32 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="mt-8 rounded-xl border border-red-300 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Dashboard ma'lumotlarini yuklab
            bo'lmadi.
          </h2>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  const {
    overview,
    quiz,
    completion,
    latestStudents,
    latestEnrollments,
    popularCourses,
  } = data;

  const statistics = [
    {
      title: "Studentlar",
      value: overview.students,
      icon: Users,
    },

    {
      title: "Faol studentlar",
      value: overview.activeStudents,
      icon: UserCheck,
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
      title: "Tugatilgan kurslar",
      value: overview.completedCourses,
      icon: Trophy,
    },

    {
      title: "Sertifikatlar",
      value: overview.certificates,
      icon: Award,
    },
  ];

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Platformaning umumiy statistikasi va
          faoliyati.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Analytics */}

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Quiz o'rtacha natijasi
              </p>

              <p className="mt-2 text-4xl font-bold">
                {quiz.averageScore}%
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] p-3">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm text-[var(--color-muted)]">
            Quizdan o'tish darajasi
          </p>

          <p className="mt-2 text-4xl font-bold">
            {quiz.passRate}%
          </p>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {quiz.passedAttempts} /{" "}
            {quiz.attempts} urinish
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm text-[var(--color-muted)]">
            Kursni tugatish darajasi
          </p>

          <p className="mt-2 text-4xl font-bold">
            {completion.completionRate}%
          </p>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {completion.completedCourses} ta
            kurs tugatilgan
          </p>
        </div>
      </div>

      {/* Latest students + enrollments */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest students */}

        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="border-b border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold">
              Yaqinda qo'shilgan studentlar
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Platformaga oxirgi qo'shilgan
              studentlar.
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border font-semibold">
                      {student.avatarUrl ? (
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        student.fullName
                          .charAt(0)
                          .toUpperCase()
                      )}
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
                      ).toLocaleDateString(
                        "uz-UZ"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest enrollments */}

        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="border-b border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold">
              Oxirgi enrollmentlar
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Kurslarga eng so'nggi yozilgan
              studentlar.
            </p>
          </div>

          {latestEnrollments.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-muted)]">
              Hozircha enrollmentlar mavjud
              emas.
            </div>
          ) : (
            <div>
              {latestEnrollments.map(
                (enrollment) => (
                  <div
                    key={enrollment.id}
                    className="border-b border-[var(--color-border)] p-5 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {enrollment.user.fullName}
                        </p>

                        <p className="mt-1 truncate text-sm text-[var(--color-muted)]">
                          {enrollment.user.email}
                        </p>

                        <p className="mt-2 text-sm">
                          Kurs:{" "}
                          <span className="font-medium">
                            {
                              enrollment.course
                                .title
                            }
                          </span>
                        </p>
                      </div>

                      <div className="hidden shrink-0 text-right sm:block">
                        <p className="text-xs text-[var(--color-muted)]">
                          Sana
                        </p>

                        <p className="text-sm">
                          {new Date(
                            enrollment.enrolledAt
                          ).toLocaleDateString(
                            "uz-UZ"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popular courses */}

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Eng ko'p enrollment olgan kurslar
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Platformadagi eng mashhur 5 ta kurs.
          </p>
        </div>

        {popularCourses.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Hozircha kurslar mavjud emas.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {popularCourses.map(
              (course, index) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-bold">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {course.title}
                      </p>

                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {course._count.enrollments}{" "}
                        ta enrollment
                      </p>
                    </div>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-sm">
                      {course._count.completions}{" "}
                      tugatilgan
                    </p>

                    <p className="text-xs text-[var(--color-muted)]">
                      {course._count.reviews} ta
                      review
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}