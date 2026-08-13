import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, Badge } from "@/components/ui";
import { api } from "@/lib/axios";

interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  passPercentage: number;

  lesson: {
    id: string;
    title: string;
  };

  course: {
    id: string;
    title: string;
  };

  questionsCount: number;
  attemptsCount: number;
  createdAt: string;
}

interface QuizzesResponse {
  success: boolean;

  data: {
    items: Quiz[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function QuizzesPage() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] =
    useState<Quiz[]>([]);

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

  const loadQuizzes = async (
    currentPage = page,
    currentSearch = search
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<QuizzesResponse>(
          "/quizzes/admin",
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

      setQuizzes(data.items);
      setTotal(
        data.pagination.total
      );

      setTotalPages(
        data.pagination.totalPages
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Quizlarni yuklab bo'lmadi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes(1, "");
  }, []);

  const handleSearch = () => {
    setPage(1);

    loadQuizzes(
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

    setPage(nextPage);

    loadQuizzes(
      nextPage,
      search
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Quizlar
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            Kurslardagi quizlarni
            boshqarish.
          </p>
        </div>
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
          placeholder="Quiz, dars yoki kurs bo'yicha qidirish..."
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

      {!loading && (
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Jami quizlar:{" "}
          <strong>{total}</strong>
        </p>
      )}

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="p-4 text-left">
                Quiz
              </th>

              <th className="p-4 text-left">
                Kurs
              </th>

              <th className="p-4 text-left">
                Dars
              </th>

              <th className="p-4 text-center">
                Savollar
              </th>

              <th className="p-4 text-center">
                O'tish foizi
              </th>

              <th className="p-4 text-center">
                Urinishlar
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
                  colSpan={7}
                  className="p-10 text-center"
                >
                  Yuklanmoqda...
                </td>
              </tr>
            ) : quizzes.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-10 text-center text-[var(--color-muted)]"
                >
                  Quizlar topilmadi.
                </td>
              </tr>
            ) : (
              quizzes.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="p-4">
                    <p className="font-medium">
                      {quiz.title}
                    </p>

                    {quiz.description && (
                      <p className="mt-1 max-w-xs truncate text-sm text-[var(--color-muted)]">
                        {
                          quiz.description
                        }
                      </p>
                    )}
                  </td>

                  <td className="p-4">
                    {quiz.course.title}
                  </td>

                  <td className="p-4">
                    {quiz.lesson.title}
                  </td>

                  <td className="p-4 text-center">
                    {quiz.questionsCount}
                  </td>

                  <td className="p-4 text-center">
                    <Badge variant="success">
                      {quiz.passPercentage}%
                    </Badge>
                  </td>

                  <td className="p-4 text-center">
                    {quiz.attemptsCount}
                  </td>

                  <td className="p-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/admin/quizzes/${quiz.id}`
                        )
                      }
                    >
                      Ko'rish
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      {!loading &&
        quizzes.length > 0 && (
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