import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge, Button } from "@/components/ui";
import { useUserActivityStats } from "@/features/settings/hooks/useUserActivityStats";
import { api } from "@/lib/axios";

interface UserDetails {
  id: string;
  fullName: string;
  email: string;

  role:
    | "ADMIN"
    | "STUDENT"
    | "SUPER_ADMIN";

  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;

  enrollments: {
    id: string;
    enrolledAt: string;

    course: {
      id: string;
      title: string;
      slug: string;
    };
  }[];

  certificates: {
    id: string;
    certificateNo: string;
    issuedAt: string;

    course: {
      id: string;
      title: string;
    };
  }[];

  quizAttempts: {
    id: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    createdAt: string;
  }[];

  lessonProgress: {
    id: string;
    lessonId: string;
    completed: boolean;
    completedAt: string | null;
  }[];

  activities: {
    id: string;

    type:
      | "LOGIN"
      | "LOGOUT"
      | "LESSON_VIEW"
      | "QUIZ_ATTEMPT"
      | "COURSE_VIEW";

    startedAt: string;
    endedAt: string | null;
    durationSeconds: number;

    metadata: {
      lessonId?: string;
      courseId?: string;
    } | null;
  }[];
}

const formatDuration = (seconds: number) => {
  if (!seconds || seconds <= 0) {
    return "0 daqiqa";
  }

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60,
  );

  if (hours > 0) {
    return `${hours} soat ${minutes} daqiqa`;
  }

  return `${minutes} daqiqa`;
};

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString("uz-UZ");
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString("uz-UZ");
};

const getActivityLabel = (
  type: UserDetails["activities"][number]["type"],
) => {
  switch (type) {
    case "LOGIN":
      return "Tizimga kirdi";

    case "LOGOUT":
      return "Tizimdan chiqdi";

    case "LESSON_VIEW":
      return "Dars ko‘rdi";

    case "QUIZ_ATTEMPT":
      return "Quiz ishladi";

    case "COURSE_VIEW":
      return "Kursni ko‘rdi";

    default:
      return "Faoliyat";
  }
};

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] =
    useState<UserDetails | null>(null);

  const [loading, setLoading] =
    useState(Boolean(id));

  const [error, setError] = useState(
    id ? "" : "User ID topilmadi.",
  );

  const {
    data: activityStats,
    isLoading: activityStatsLoading,
    isError: activityStatsError,
  } = useUserActivityStats(id);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<{
          success: boolean;
          data: UserDetails;
        }>(`/admin/users/${id}`);

        setUser(response.data.data);
      } catch (err: unknown) {
        const message = isAxiosError<{
          message?: string;
        }>(err)
          ? err.response?.data?.message ??
            "Foydalanuvchi ma'lumotlarini yuklab bo‘lmadi."
          : "Foydalanuvchi ma'lumotlarini yuklab bo‘lmadi.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        Yuklanmoqda...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <Button
          variant="outline"
          onClick={() =>
            navigate("/admin/users")
          }
        >
          ← Foydalanuvchilar
        </Button>

        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
          {error || "Foydalanuvchi topilmadi."}
        </div>
      </div>
    );
  }

  const completedLessons =
    user.lessonProgress.filter(
      (item) => item.completed,
    ).length;

  const totalLessonProgress =
    user.lessonProgress.length;

  const lessonCompletionRate =
    totalLessonProgress === 0
      ? 0
      : Math.round(
          (completedLessons /
            totalLessonProgress) *
            100,
        );

  const averageQuizScore =
    user.quizAttempts.length === 0
      ? 0
      : Math.round(
          user.quizAttempts.reduce(
            (sum, attempt) =>
              sum + attempt.percentage,
            0,
          ) / user.quizAttempts.length,
        );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Button
            variant="outline"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            ← Foydalanuvchilar
          </Button>

          <h1 className="mt-5 text-3xl font-bold">
            {user.fullName}
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            {user.email}
          </p>
        </div>

        <Badge
          variant={
            user.role === "SUPER_ADMIN"
              ? "warning"
              : user.role === "ADMIN"
                ? "success"
                : "info"
          }
        >
          {user.role === "SUPER_ADMIN"
            ? "Bosh admin"
            : user.role === "ADMIN"
              ? "Admin"
              : "Student"}
        </Badge>
      </div>

      {/* Main Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Kurslar
          </p>

          <p className="mt-2 text-3xl font-bold">
            {user.enrollments.length}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Dars progressi
          </p>

          <p className="mt-2 text-3xl font-bold">
            {lessonCompletionRate}%
          </p>

          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {completedLessons} /{" "}
            {totalLessonProgress} dars
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Quiz urinishlari
          </p>

          <p className="mt-2 text-3xl font-bold">
            {user.quizAttempts.length}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            O‘rtacha quiz
          </p>

          <p className="mt-2 text-3xl font-bold">
            {averageQuizScore}%
          </p>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Foydalanuvchi faolligi
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Tizimga kirish va dars ko‘rish statistikasi.
          </p>
        </div>

        {activityStatsLoading ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Faollik statistikasi yuklanmoqda...
          </div>
        ) : activityStatsError ? (
          <div className="p-8 text-center text-red-500">
            Faollik statistikasini yuklab bo‘lmadi.
          </div>
        ) : (
          <>
            {/* Weekly Login Indicator */}
            <div className="border-b border-[var(--color-border)] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">
                    Haftalik kirish
                  </h3>

                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    Foydalanuvchining shu haftadagi tizimga kirish kunlari.
                  </p>
                </div>

                <span className="text-sm font-medium text-[var(--color-muted)]">
                  {activityStats?.logins.week ?? 0} ta kirish
                </span>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-2">
                {activityStats?.loginDays?.map(
                  (day) => (
                    <div
                      key={day.date}
                      className="flex min-w-0 flex-col items-center gap-2"
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded-full transition-colors ${
                          day.loggedIn
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                        title={
                          day.loggedIn
                            ? `${day.day} — tizimga kirgan`
                            : `${day.day} — tizimga kirmagan`
                        }
                      />

                      <span className="text-xs text-[var(--color-muted)]">
                        {day.day}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-4 flex items-center justify-center gap-5 text-xs text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Kirgan
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  Kirmagan
                </div>
              </div>
            </div>

            {/* Activity Cards */}
            <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-[var(--color-background)] p-5">
                <p className="text-sm text-[var(--color-muted)]">
                  Bugungi kirishlar
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {activityStats?.logins.today ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--color-background)] p-5">
                <p className="text-sm text-[var(--color-muted)]">
                  Haftalik kirishlar
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {activityStats?.logins.week ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--color-background)] p-5">
                <p className="text-sm text-[var(--color-muted)]">
                  Oylik kirishlar
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {activityStats?.logins.month ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--color-background)] p-5">
                <p className="text-sm text-[var(--color-muted)]">
                  Bugungi dars vaqti
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatDuration(
                    activityStats?.lessonDuration.today ??
                      0,
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--color-background)] p-5">
                <p className="text-sm text-[var(--color-muted)]">
                  Haftalik dars vaqti
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatDuration(
                    activityStats?.lessonDuration.week ??
                      0,
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--color-background)] p-5">
                <p className="text-sm text-[var(--color-muted)]">
                  Oylik dars vaqti
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatDuration(
                    activityStats?.lessonDuration.month ??
                      0,
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--color-background)] p-5">
                <p className="text-sm text-[var(--color-muted)]">
                  Jami ko‘rilgan darslar
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {activityStats?.totalLessonsViewed ??
                    0}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--color-background)] p-5 sm:col-span-2 lg:col-span-2">
                <p className="text-sm text-[var(--color-muted)]">
                  Jami dars ko‘rish vaqti
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatDuration(
                    activityStats?.lessonDuration.total ??
                      0,
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            So‘nggi faoliyat
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Foydalanuvchining oxirgi faoliyatlari.
          </p>
        </div>

        {user.activities.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Faoliyat ma&apos;lumotlari mavjud emas.
          </div>
        ) : (
          <div className="divide-y">
            {user.activities
              .slice(0, 20)
              .map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-medium">
                      {getActivityLabel(
                        activity.type,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {formatDateTime(
                        activity.startedAt,
                      )}
                    </p>
                  </div>

                  {activity.type ===
                    "LESSON_VIEW" &&
                    activity.durationSeconds > 0 && (
                      <Badge variant="info">
                        {formatDuration(
                          activity.durationSeconds,
                        )}
                      </Badge>
                    )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* User Information */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Foydalanuvchi ma&apos;lumotlari
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--color-muted)]">
              To‘liq ism
            </p>

            <p className="mt-1 font-medium">
              {user.fullName}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Email
            </p>

            <p className="mt-1 font-medium">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Email tasdiqlangan
            </p>

            <Badge
              variant={
                user.emailVerified
                  ? "success"
                  : "warning"
              }
            >
              {user.emailVerified
                ? "Ha"
                : "Yo‘q"}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Ro‘yxatdan o‘tgan
            </p>

            <p className="mt-1 font-medium">
              {formatDate(user.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Oxirgi kirish
            </p>

            <p className="mt-1 font-medium">
              {user.lastLoginAt
                ? formatDateTime(
                    user.lastLoginAt,
                  )
                : "Hali kirmagan"}
            </p>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Yozilgan kurslar
          </h2>
        </div>

        {user.enrollments.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Foydalanuvchi hali kursga yozilmagan.
          </div>
        ) : (
          <div className="divide-y">
            {user.enrollments.map(
              (enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-medium">
                      {enrollment.course.title}
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      Yozilgan sana:{" "}
                      {formatDate(
                        enrollment.enrolledAt,
                      )}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Quiz Attempts */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Quiz natijalari
          </h2>
        </div>

        {user.quizAttempts.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Hozircha quiz topshirilmagan.
          </div>
        ) : (
          <div className="divide-y">
            {user.quizAttempts.map(
              (attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-medium">
                      Natija
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {attempt.score} /{" "}
                      {attempt.total} —{" "}
                      {attempt.percentage}%
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {formatDateTime(
                        attempt.createdAt,
                      )}
                    </p>
                  </div>

                  <Badge
                    variant={
                      attempt.passed
                        ? "success"
                        : "warning"
                    }
                  >
                    {attempt.passed
                      ? "O‘tgan"
                      : "Yiqilgan"}
                  </Badge>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Certificates */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Sertifikatlar
          </h2>
        </div>

        {user.certificates.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Sertifikat mavjud emas.
          </div>
        ) : (
          <div className="divide-y">
            {user.certificates.map(
              (certificate) => (
                <div
                  key={certificate.id}
                  className="p-5"
                >
                  <p className="font-medium">
                    {certificate.course.title}
                  </p>

                  <p className="mt-1 text-sm">
                    Sertifikat №{" "}
                    <strong>
                      {
                        certificate.certificateNo
                      }
                    </strong>
                  </p>

                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Berilgan sana:{" "}
                    {formatDate(
                      certificate.issuedAt,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Lesson Progress */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Dars progressi
          </h2>
        </div>

        {user.lessonProgress.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Hozircha progress mavjud emas.
          </div>
        ) : (
          <div className="divide-y">
            {user.lessonProgress.map(
              (progress) => (
                <div
                  key={progress.id}
                  className="flex items-center justify-between p-5"
                >
                  <div>
                    <p className="font-medium">
                      Lesson ID:{" "}
                      {progress.lessonId}
                    </p>

                    {progress.completedAt && (
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Tugatilgan:{" "}
                        {formatDateTime(
                          progress.completedAt,
                        )}
                      </p>
                    )}
                  </div>

                  <Badge
                    variant={
                      progress.completed
                        ? "success"
                        : "warning"
                    }
                  >
                    {progress.completed
                      ? "Tugatilgan"
                      : "Jarayonda"}
                  </Badge>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}