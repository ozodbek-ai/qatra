import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { isAxiosError } from "axios";

import { Badge, Button, Input } from "@/components/ui";
import { api } from "@/lib/axios";

interface ProgressItem {
  id: string;
  completed: boolean;
  completedAt: string | null;
  lastViewedAt: string;

  student: {
    id: string;
    fullName: string;
    email: string;
  };

  lesson: {
    id: string;
    title: string;
  };

  course: {
    id: string;
    title: string;
  };
}

interface ProgressResponse {
  success: boolean;
  data: {
    items: ProgressItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function ProgressPage() {
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProgress = useCallback(
    async (
      currentPage: number,
      currentSearch: string,
    ) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<ProgressResponse>(
            "/progress/admin",
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

        setItems(data.items);
        setTotal(data.pagination.total);
        setTotalPages(
          data.pagination.totalPages,
        );
      } catch (err: unknown) {
        const message = isAxiosError<{
          message?: string;
        }>(err)
          ? err.response?.data?.message ??
            "Progress ma'lumotlarini yuklab bo'lmadi."
          : "Progress ma'lumotlarini yuklab bo'lmadi.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    queueMicrotask(() => {
      void loadProgress(1, "");
    });
  }, [loadProgress]);

  const handleSearch = () => {
    setPage(1);
    void loadProgress(1, search);
  };

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    setPage(nextPage);
    void loadProgress(nextPage, search);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Progress
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Studentlarning darslar bo&apos;yicha
          progressini kuzatish.
        </p>
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
          placeholder="Student, kurs yoki dars bo'yicha qidirish..."
          className="max-w-md"
        />

        <Button onClick={handleSearch}>
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
          Jami progress yozuvlari:{" "}
          <strong>{total}</strong>
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="p-4 text-left">
                Student
              </th>

              <th className="p-4 text-left">
                Kurs
              </th>

              <th className="p-4 text-left">
                Dars
              </th>

              <th className="p-4 text-center">
                Holati
              </th>

              <th className="p-4 text-left">
                Tugatilgan sana
              </th>

              <th className="p-4 text-left">
                Oxirgi faoliyat
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
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-[var(--color-muted)]"
                >
                  Progress ma&apos;lumotlari
                  topilmadi.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="p-4">
                    <p className="font-medium">
                      {item.student.fullName}
                    </p>

                    <p className="text-sm text-[var(--color-muted)]">
                      {item.student.email}
                    </p>
                  </td>

                  <td className="p-4 font-medium">
                    {item.course.title}
                  </td>

                  <td className="p-4">
                    {item.lesson.title}
                  </td>

                  <td className="p-4 text-center">
                    <Badge
                      variant={
                        item.completed
                          ? "success"
                          : "warning"
                      }
                    >
                      {item.completed
                        ? "Tugatilgan"
                        : "Jarayonda"}
                    </Badge>
                  </td>

                  <td className="p-4">
                    {item.completedAt
                      ? new Date(
                          item.completedAt,
                        ).toLocaleDateString(
                          "uz-UZ",
                        )
                      : "-"}
                  </td>

                  <td className="p-4">
                    {new Date(
                      item.lastViewedAt,
                    ).toLocaleString("uz-UZ")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && items.length > 0 && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-[var(--color-muted)]">
            Sahifa {page} / {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() =>
                handlePageChange(page - 1)
              }
            >
              ← Oldingi
            </Button>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() =>
                handlePageChange(page + 1)
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