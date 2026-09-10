import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { isAxiosError } from "axios";

import { Button, Input } from "@/components/ui";
import { api } from "@/lib/axios";

interface Enrollment {
  id: string;
  enrolledAt: string;

  student: {
    id: string;
    fullName: string;
    email: string;
  };

  course: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
  };
}

interface EnrollmentsResponse {
  success: boolean;

  data: {
    items: Enrollment[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] =
    useState<Enrollment[]>([]);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

const loadEnrollments = useCallback(
  async (
    currentPage: number,
    currentSearch: string,
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<EnrollmentsResponse>(
          "/enrollments/admin",
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
          },
        );

      const data = response.data.data;

      setEnrollments(data.items);
      setTotal(data.pagination.total);
      setTotalPages(
        data.pagination.totalPages,
      );
    } catch (err: unknown) {
      const message = isAxiosError<{
        message?: string;
      }>(err)
        ? err.response?.data?.message ??
          "Enrollmentlarni yuklab bo'lmadi."
        : "Enrollmentlarni yuklab bo'lmadi.";

      setError(message);
    } finally {
      setLoading(false);
    }
  },
  [],
);

useEffect(() => {
  queueMicrotask(() => {
    void loadEnrollments(1, "");
  });
}, [loadEnrollments]);

const handleSearch = () => {
  setPage(1);
  void loadEnrollments(1, search);
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
void loadEnrollments(nextPage, search);

    loadEnrollments(
      nextPage,
      search
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Enrollmentlar
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Studentlarning kurslarga
          yozilishlarini boshqarish.
        </p>
      </div>

      {/* Search */}

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
          placeholder="Student yoki kurs bo'yicha qidirish..."
          className="max-w-md"
        />

        <Button
          onClick={handleSearch}
        >
          Qidirish
        </Button>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && (
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Jami enrollmentlar:{" "}
          <strong>{total}</strong>
        </p>
      )}

      {/* Table */}

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

              <th className="p-4 text-left">
                Kurs
              </th>

              <th className="p-4 text-left">
                Yozilgan sana
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center"
                >
                  Yuklanmoqda...
                </td>
              </tr>
            ) : enrollments.length ===
              0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-[var(--color-muted)]"
                >
                  Enrollmentlar topilmadi.
                </td>
              </tr>
            ) : (
              enrollments.map(
                (enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <td className="p-4">
                      <p className="font-medium">
                        {
                          enrollment
                            .student
                            .fullName
                        }
                      </p>
                    </td>

                    <td className="p-4 text-[var(--color-muted)]">
                      {
                        enrollment
                          .student
                          .email
                      }
                    </td>

                    <td className="p-4 font-medium">
                      {
                        enrollment.course
                          .title
                      }
                    </td>

                    <td className="p-4">
                      {new Date(
                        enrollment.enrolledAt
                      ).toLocaleDateString(
                        "uz-UZ"
                      )}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      {!loading &&
        enrollments.length > 0 && (
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