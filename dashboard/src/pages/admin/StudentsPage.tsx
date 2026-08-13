import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { api } from "@/lib/axios";

interface Student {
  id: string;
  fullName: string;
  email: string;
  joinedAt: string;
  enrolledCourses: number;
  quizAttempts: number;
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

  const loadStudents = async (
    currentPage = page,
    currentSearch = search
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

      setStudents(
        response.data.data.items
      );

      setTotalPages(
        response.data.data.pagination
          .totalPages
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Studentlarni yuklab bo'lmadi."
      );
    } finally {
      setLoading(false);
    }
  };

  // Sahifa ochilganda
  useEffect(() => {
  loadStudents(1, "");
}, []);

  const handleSearch = () => {
    setPage(1);
    loadStudents(1, search);
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

    setPage(nextPage);

    loadStudents(
      nextPage,
      search
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
            boshqarish.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
          <Users className="h-6 w-6" />
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <Input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
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

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="p-4 text-left">
                Student
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-center">
                Kurslar
              </th>

              <th className="p-4 text-center">
                Quizlar
              </th>

              <th className="p-4 text-left">
                Qo'shilgan sana
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
                  colSpan={6}
                  className="p-10 text-center"
                >
                  Yuklanmoqda...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
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
                    className="border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border font-semibold">
                          {student.fullName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="font-medium">
                          {student.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-[var(--color-muted)]">
                      {student.email}
                    </td>

                    <td className="p-4 text-center">
                      {student.enrolledCourses}
                    </td>

                    <td className="p-4 text-center">
                      {student.quizAttempts}
                    </td>

                    <td className="p-4">
                      {new Date(
                        student.joinedAt
                      ).toLocaleDateString(
                        "uz-UZ"
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/admin/students/${student.id}`
                          )
                        }
                      >
                        Ko'rish
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
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-[var(--color-muted)]">
              Sahifa {page} /{" "}
              {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
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