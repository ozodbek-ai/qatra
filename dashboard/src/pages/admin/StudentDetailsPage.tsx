import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Badge } from "@/components/ui";
import { api } from "@/lib/axios";

interface StudentDetails {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;

  enrollments: {
    id: string;
    enrolledAt: string;
    course: {
      id: string;
      title: string;
      slug: string;
      imageUrl?: string | null;
      isPublished: boolean;
    };
  }[];

  lessonProgress: {
    id: string;
    lessonId: string;
    completed: boolean;
    completedAt?: string | null;
    lastViewedAt: string;
    lesson: {
      id: string;
      title: string;
      courseId: string;
    };
  }[];

  quizAttempts: {
    id: string;
    quizId: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    createdAt: string;
    quiz: {
      id: string;
      title: string | null;
    };
  }[];
}

export default function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] =
    useState<StudentDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) {
        setError("Student ID topilmadi.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<{
            success: boolean;
            data: StudentDetails;
          }>(`/admin/students/${id}`);

        setStudent(response.data.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Student ma'lumotlarini yuklab bo'lmadi."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        Yuklanmoqda...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-8">
        <Button
          variant="outline"
          onClick={() =>
            navigate("/admin/students")
          }
        >
          ← Studentlar
        </Button>

        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
          {error ||
            "Student topilmadi."}
        </div>
      </div>
    );
  }

  const completedLessons =
    student.lessonProgress.filter(
      (item) => item.completed
    ).length;

  const averageQuizScore =
    student.quizAttempts.length === 0
      ? 0
      : Math.round(
          student.quizAttempts.reduce(
            (sum, item) =>
              sum + item.percentage,
            0
          ) /
            student.quizAttempts.length
        );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() =>
              navigate("/admin/students")
            }
          >
            ← Studentlar
          </Button>

          <h1 className="mt-5 text-3xl font-bold">
            {student.fullName}
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            {student.email}
          </p>
        </div>

        <Badge
          variant={
            student.isActive
              ? "success"
              : "warning"
          }
        >
          {student.isActive
            ? "Aktiv"
            : "Nofaol"}
        </Badge>
      </div>

      {/* Basic statistics */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Kurslar
          </p>

          <p className="mt-2 text-3xl font-bold">
            {student.enrollments.length}
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
            {student.quizAttempts.length}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            O'rtacha quiz natijasi
          </p>

          <p className="mt-2 text-3xl font-bold">
            {averageQuizScore}%
          </p>
        </div>
      </div>

      {/* Student information */}

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Student ma'lumotlari
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--color-muted)]">
              To'liq ism
            </p>

            <p className="mt-1 font-medium">
              {student.fullName}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Email
            </p>

            <p className="mt-1 font-medium">
              {student.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Ro'yxatdan o'tgan
            </p>

            <p className="mt-1 font-medium">
              {new Date(
                student.createdAt
              ).toLocaleDateString("uz-UZ")}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Oxirgi kirish
            </p>

            <p className="mt-1 font-medium">
              {student.lastLoginAt
                ? new Date(
                    student.lastLoginAt
                  ).toLocaleString("uz-UZ")
                : "Hali kirmagan"}
            </p>
          </div>
        </div>
      </div>

      {/* Enrolled courses */}

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Yozilgan kurslar
          </h2>
        </div>

        {student.enrollments.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Student hali hech qaysi kursga
            yozilmagan.
          </div>
        ) : (
          <div className="divide-y">
            {student.enrollments.map(
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

                  <Badge
                    variant={
                      enrollment.course
                        .isPublished
                        ? "success"
                        : "warning"
                    }
                  >
                    {enrollment.course
                      .isPublished
                      ? "Published"
                      : "Draft"}
                  </Badge>
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

        {student.quizAttempts.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Hozircha quiz topshirilmagan.
          </div>
        ) : (
          <div className="divide-y">
            {student.quizAttempts.map(
              (attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-medium">
                      {attempt.quiz.title ||
                        "Quiz"}
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {attempt.score} /{" "}
                      {attempt.total} (
                      {attempt.percentage}%)
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
                        : "danger"
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

      {/* Lesson progress */}

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Dars progressi
          </h2>
        </div>

        {student.lessonProgress.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Hozircha progress mavjud emas.
          </div>
        ) : (
          <div className="divide-y">
            {student.lessonProgress.map(
              (progress) => (
                <div
                  key={progress.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-medium">
                      {progress.lesson.title}
                    </p>

                    {progress.completedAt && (
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
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