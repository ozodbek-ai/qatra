import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Trophy,
} from "lucide-react";

import { Button, Badge } from "@/components/ui";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";

interface StudentDetails {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  lastLoginAt?: string | null;

  statistics: {
    enrolledCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    progress: number;
    quizAttempts: number;
    passedQuizAttempts: number;
    averageQuizScore: number;
    certificates: number;
    reviews: number;
  };

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

      course: {
        id: string;
        title: string;
      };
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

      lesson: {
        id: string;
        title: string;

        course: {
          id: string;
          title: string;
        };
      };
    };
  }[];

  completions: {
    id: string;
    completedAt: string;

    course: {
      id: string;
      title: string;
      slug: string;
      imageUrl?: string | null;
    };

    certificate?: {
      id: string;
      certificateNo: string;
      issuedAt: string;
    } | null;
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

  reviews: {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;

    course: {
      id: string;
      title: string;
    };
  }[];
}

interface StudentResponse {
  success: boolean;
  data: StudentDetails;
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
          await api.get<StudentResponse>(
            `/admin/students/${id}`
          );

        setStudent(
          response.data.data
        );
      } catch (err: unknown) {
  const message = isAxiosError<{ message?: string }>(err)
    ? err.response?.data?.message ??
      "Student ma'lumotlarini yuklab bo'lmadi."
    : "Student ma'lumotlarini yuklab bo'lmadi.";

  setError(message);
} finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  const formatDate = (
    value: string | null | undefined
  ) => {
    if (!value) {
      return "Ma'lumot mavjud emas";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "uz-UZ"
    );
  };

  const formatDateTime = (
    value: string | null | undefined
  ) => {
    if (!value) {
      return "Ma'lumot mavjud emas";
    }

    return new Date(
      value
    ).toLocaleString(
      "uz-UZ"
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-xl bg-slate-200"
              />
            ))}
          </div>

          <div className="h-64 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-8">
        <Button
          type="button"
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

  const {
    statistics,
  } = student;

  return (
    <div className="space-y-8 p-6 md:p-8">

      {/* Header */}

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(
                "/admin/students"
              )
            }
          >
            ← Studentlar
          </Button>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-slate-100 text-xl font-bold">
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

            <div>
              <h1 className="text-3xl font-bold">
                {student.fullName}
              </h1>

              <p className="mt-1 text-[var(--color-muted)]">
                {student.email}
              </p>
            </div>
          </div>
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

      {/* Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Yozilgan kurslar
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.enrolledCourses}
              </p>
            </div>

            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Tugatilgan kurslar
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.completedCourses}
              </p>
            </div>

            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Tugatilgan darslar
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.completedLessons}
              </p>
            </div>

            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Umumiy progress
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.progress}%
              </p>
            </div>

            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
        </div>

      </div>

      {/* Second statistics */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Quiz urinishlari
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistics.quizAttempts}
          </p>

          <p className="mt-1 text-sm text-green-600">
            {statistics.passedQuizAttempts} ta o'tilgan
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            O'rtacha quiz natijasi
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistics.averageQuizScore}%
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Sertifikatlar
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistics.certificates}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Reviewlar
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistics.reviews}
          </p>
        </div>

      </div>

      {/* Student information */}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">

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
              {formatDate(
                student.createdAt
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Oxirgi kirish
            </p>

            <p className="mt-1 font-medium">
              {formatDateTime(
                student.lastLoginAt
              )}
            </p>
          </div>

        </div>
      </div>

      {/* Overall progress */}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Umumiy o'qish progressi
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Tugatilgan darslar ulushi
            </p>
          </div>

          <span className="text-2xl font-bold">
            {statistics.progress}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  statistics.progress
                )
              )}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {statistics.completedLessons} /{" "}
          {statistics.totalLessons} dars
          tugatilgan
        </p>
      </div>

      {/* Enrollments */}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">

        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Yozilgan kurslar
          </h2>
        </div>

        {student.enrollments.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Student hali hech qaysi
            kursga yozilmagan.
          </div>
        ) : (
          <div className="divide-y">

            {student.enrollments.map(
              (enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">

                    {enrollment.course.imageUrl ? (
                      <img
                        src={
                          enrollment
                            .course
                            .imageUrl
                        }
                        alt={
                          enrollment
                            .course
                            .title
                        }
                        className="h-14 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100">
                        <BookOpen className="h-5 w-5 text-slate-400" />
                      </div>
                    )}

                    <div>
                      <p className="font-medium">
                        {
                          enrollment
                            .course
                            .title
                        }
                      </p>

                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Yozilgan sana:{" "}
                        {formatDate(
                          enrollment.enrolledAt
                        )}
                      </p>
                    </div>

                  </div>

                  <Badge
                    variant={
                      enrollment
                        .course
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

      {/* Completed courses */}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">

        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold">
            Tugatilgan kurslar
          </h2>
        </div>

        {student.completions.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Hali tugatilgan kurslar
            mavjud emas.
          </div>
        ) : (
          <div className="divide-y">

            {student.completions.map(
              (completion) => (
                <div
                  key={completion.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {
                        completion
                          .course
                          .title
                      }
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      Tugatilgan sana:{" "}
                      {formatDate(
                        completion.completedAt
                      )}
                    </p>
                  </div>

                  {completion.certificate && (
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />

                      <div>
                        <p className="text-sm font-medium">
                          Sertifikat
                        </p>

                        <p className="text-xs text-[var(--color-muted)]">
                          {
                            completion
                              .certificate
                              .certificateNo
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* Quiz attempts */}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">

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
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {attempt.quiz.title ||
                        "Quiz"}
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      Kurs:{" "}
                      {
                        attempt.quiz
                          .lesson
                          .course
                          .title
                      }
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {attempt.score} /{" "}
                      {attempt.total} (
                      {
                        attempt.percentage
                      }%)
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {formatDateTime(
                        attempt.createdAt
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

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">

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
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {
                        progress
                          .lesson
                          .title
                      }
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      Kurs:{" "}
                      {
                        progress
                          .lesson
                          .course
                          .title
                      }
                    </p>

                    {progress.completedAt && (
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        Tugatilgan:{" "}
                        {formatDateTime(
                          progress.completedAt
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

      {/* Certificates */}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">

        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Award className="h-5 w-5 text-yellow-600" />
            Sertifikatlar
          </h2>
        </div>

        {student.certificates.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Studentda hali sertifikat
            mavjud emas.
          </div>
        ) : (
          <div className="divide-y">

            {student.certificates.map(
              (certificate) => (
                <div
                  key={certificate.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {
                        certificate
                          .course
                          .title
                      }
                    </p>

                    <p className="mt-1 break-all text-sm text-[var(--color-muted)]">
                      №{" "}
                      {
                        certificate
                          .certificateNo
                      }
                    </p>
                  </div>

                  <p className="text-sm text-[var(--color-muted)]">
                    {formatDate(
                      certificate.issuedAt
                    )}
                  </p>
                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* Reviews */}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">

        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5" />
            Student reviewlari
          </h2>
        </div>

        {student.reviews.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            Student hali review
            qoldirmagan.
          </div>
        ) : (
          <div className="divide-y">

            {student.reviews.map(
              (review) => (
                <div
                  key={review.id}
                  className="p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <p className="font-medium">
                        {
                          review
                            .course
                            .title
                        }
                      </p>

                      <div className="mt-1 flex items-center gap-1">
                        {Array.from({
                          length: 5,
                        }).map(
                          (_, index) => (
                            <span
                              key={index}
                              className={
                                index <
                                review.rating
                                  ? "text-yellow-500"
                                  : "text-slate-300"
                              }
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-muted)]">
                      {formatDate(
                        review.createdAt
                      )}
                    </p>

                  </div>

                  {review.comment && (
                    <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                      {review.comment}
                    </p>
                  )}
                </div>
              )
            )}

          </div>
        )}
      </div>

    </div>
  );
}