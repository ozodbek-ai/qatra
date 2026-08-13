import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Badge } from "@/components/ui";
import { api } from "@/lib/axios";

interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
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
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] =
    useState<UserDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!id) {
      setError("User ID topilmadi.");
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);

        const response =
          await api.get<{
            success: boolean;
            data: UserDetails;
          }>(`/admin/users/${id}`);

        setUser(response.data.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Foydalanuvchi ma'lumotlarini yuklab bo'lmadi."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
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
          {error ||
            "Foydalanuvchi topilmadi."}
        </div>
      </div>
    );
  }

  const completedLessons =
    user.lessonProgress.filter(
      (item) => item.completed
    ).length;

  const averageQuizScore =
    user.quizAttempts.length === 0
      ? 0
      : Math.round(
          user.quizAttempts.reduce(
            (sum, attempt) =>
              sum + attempt.percentage,
            0
          ) /
            user.quizAttempts.length
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
            user.role === "ADMIN"
              ? "success"
              : "info"
          }
        >
          {user.role === "ADMIN"
            ? "Admin"
            : "Student"}
        </Badge>
      </div>

      {/* Statistics */}

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
            Tugatilgan darslar
          </p>

          <p className="mt-2 text-3xl font-bold">
            {completedLessons}
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
            O'rtacha quiz
          </p>

          <p className="mt-2 text-3xl font-bold">
            {averageQuizScore}%
          </p>
        </div>
      </div>

      {/* User information */}

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Foydalanuvchi ma'lumotlari
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--color-muted)]">
              To'liq ism
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
                : "Yo'q"}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Ro'yxatdan o'tgan
            </p>

            <p className="mt-1 font-medium">
              {new Date(
                user.createdAt
              ).toLocaleDateString("uz-UZ")}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Oxirgi kirish
            </p>

            <p className="mt-1 font-medium">
              {user.lastLoginAt
                ? new Date(
                    user.lastLoginAt
                  ).toLocaleString("uz-UZ")
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
            Foydalanuvchi hali kursga
            yozilmagan.
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
                      {new Date(
                        enrollment.enrolledAt
                      ).toLocaleDateString(
                        "uz-UZ"
                      )}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Quiz attempts */}

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
                      {new Date(
                        attempt.createdAt
                      ).toLocaleString(
                        "uz-UZ"
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
                      ? "O'tgan"
                      : "Yiqilgan"}
                  </Badge>
                </div>
              )
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
                    {new Date(
                      certificate.issuedAt
                    ).toLocaleDateString(
                      "uz-UZ"
                    )}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Lesson progress */}

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
                        {new Date(
                          progress.completedAt
                        ).toLocaleString(
                          "uz-UZ"
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
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}