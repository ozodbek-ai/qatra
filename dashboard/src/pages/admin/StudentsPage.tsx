import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  Award,
  CircleOff,
} from "lucide-react";

import { Button, Input } from "@/components/ui";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";

interface Student {
  id: string;
  fullName: string;
  email: string;
  joinedAt: string;
  isActive: boolean;
  lastLoginAt: string | null;

  enrolledCourses: number;
  completedCourses: number;
  completedLessons: number;
  quizAttempts: number;
  certificates: number;
  reviews: number;
}

interface StudentsResponse {
  success: boolean;

  data: {
    items: Student[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function StudentsPage() {
  const navigate = useNavigate();

  const [students, setStudents] =
    useState<Student[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const loadStudents = useCallback(
    async (
      currentPage: number,
      currentSearch: string
    ) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<StudentsResponse>(
            "/admin/students",
            {
              params: {
                page: currentPage,
                limit: 10,

                ...(currentSearch.trim()
                  ? {
                      search:
                        currentSearch.trim(),
                    }
                  : {}),
              },
            }
          );

        const data =
          response.data.data;

        setStudents(data.items);

        setTotalPages(
          data.pagination.totalPages
        );

        setPage(
          data.pagination.page
        );
      } catch (err: unknown) {
        const message =
          isAxiosError<{
            message?: string;
          }>(err)
            ? err.response?.data?.message ??
              "Studentlarni yuklab bo'lmadi."
            : "Studentlarni yuklab bo'lmadi.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    queueMicrotask(() => {
      void loadStudents(1, "");
    });
  }, [loadStudents]);

  const handleSearch = () => {
    void loadStudents(
      1,
      search
    );
  };

  const handlePageChange = (
    nextPage: number
  ) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    void loadStudents(
      nextPage,
      search
    );
  };

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "Hali kirmagan";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "uz-UZ"
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Studentlar
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            Platformadagi studentlarni
            boshqarish va ularning
            o‘quv faoliyatini kuzatish.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
          <Users className="h-6 w-6" />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Ism yoki email bo'yicha qidirish..."
          className="max-w-md"
        />

        <Button
          type="button"
          onClick={handleSearch}
        >
          Qidirish
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="p-4 text-left">
                Student
              </th>

              <th className="p-4 text-left">
                Holat
              </th>

              <th className="p-4 text-center">
                Kurslar
              </th>

              <th className="p-4 text-center">
                Tugallangan
              </th>

              <th className="p-4 text-center">
                Darslar
              </th>

              <th className="p-4 text-center">
                Quizlar
              </th>

              <th className="p-4 text-center">
                Sertifikat
              </th>

              <th className="p-4 text-left">
                Qo‘shilgan sana
              </th>

              <th className="p-4 text-center">
                Amal
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-10 text-center"
                >
                  Yuklanmoqda...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-10 text-center text-[var(--color-muted)]"
                >
                  Studentlar topilmadi.
                </td>
              </tr>
            ) : (
              students.map(
                (student) => (
                  <tr
                    key={student.id}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-slate-50/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
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
                    </td>

                    <td className="p-4">
                      {student.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Aktiv
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          <CircleOff className="h-3.5 w-3.5" />
                          Bloklangan
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span className="font-semibold">
                        {student.enrolledCourses}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="font-semibold text-green-600">
                        {student.completedCourses}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {student.completedLessons}
                    </td>

                    <td className="p-4 text-center">
                      {student.quizAttempts}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Award className="h-4 w-4 text-yellow-600" />

                        <span>
                          {student.certificates}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p>
                          {formatDate(
                            student.joinedAt
                          )}
                        </p>

                        {student.lastLoginAt && (
                          <p className="mt-1 text-xs text-[var(--color-muted)]">
                            Oxirgi kirish:{" "}
                            {formatDate(
                              student.lastLoginAt
                            )}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/students/${student.id}`
                          )
                        }
                      >
                        Ko‘rish
                      </Button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {!loading &&
        students.length > 0 && (
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-muted)]">
              Sahifa {page} /{" "}
              {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1}
                onClick={() =>
                  handlePageChange(
                    page - 1
                  )
                }
              >
                ← Oldingi
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  handlePageChange(
                    page + 1
                  )
                }
              >
                Keyingi →
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}