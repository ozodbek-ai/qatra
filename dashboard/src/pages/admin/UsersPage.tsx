import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, Badge } from "@/components/ui";
import { api } from "@/lib/axios";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  isActive: boolean;
  emailVerified: boolean;
  enrolledCourses: number;
  certificates: number;
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadUsers = async (
  currentPage = page,
  currentRole = role,
  currentSearch = search
) => {
  try {
    setLoading(true);
    setError("");

    const response =
      await api.get<UsersResponse>(
        "/admin/users",
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

            ...(currentRole
              ? {
                  role: currentRole,
                }
              : {}),
          },
        }
      );

    const data =
      response.data.data;

    setUsers(data.users);
    setTotal(data.total);
    setTotalPages(
      data.totalPages
    );
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
        "Foydalanuvchilarni yuklab bo'lmadi."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadUsers(1);
  }, []);

  const handleSearch = () => {
  setPage(1);
  loadUsers(1, role, search);
};

  const handleRoleChange = (
  value: string
) => {
  setRole(value);
  setPage(1);

  loadUsers(1, value, search);
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
    loadUsers(nextPage);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Foydalanuvchilar
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Platformadagi barcha
          foydalanuvchilarni ko'rish.
        </p>
      </div>

      {/* Filters */}

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
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

        <select
          value={role}
          onChange={(e) =>
            handleRoleChange(
              e.target.value
            )
          }
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2"
        >
          <option value="">
            Barcha rollar
          </option>

          <option value="STUDENT">
            Student
          </option>

          <option value="ADMIN">
            Admin
          </option>
        </select>

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

      {/* Total */}

      {!loading && (
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Jami foydalanuvchilar:{" "}
          <strong>{total}</strong>
        </p>
      )}

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="p-4 text-left">
                Foydalanuvchi
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-center">
                Role
              </th>

              <th className="p-4 text-center">
                Kurslar
              </th>

              <th className="p-4 text-center">
                Sertifikatlar
              </th>

              <th className="p-4 text-left">
                Ro'yxatdan o'tgan
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
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-10 text-center text-[var(--color-muted)]"
                >
                  Foydalanuvchilar
                  topilmadi.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border font-semibold">
                        {user.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="font-medium">
                        {user.fullName}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-[var(--color-muted)]">
                    {user.email}
                  </td>

                  <td className="p-4 text-center">
                    <Badge
                      variant={
                        user.role ===
                        "ADMIN"
                          ? "success"
                          : "info"
                      }
                    >
                      {user.role ===
                      "ADMIN"
                        ? "Admin"
                        : "Student"}
                    </Badge>
                  </td>

                  <td className="p-4 text-center">
                    {user.enrolledCourses}
                  </td>

                  <td className="p-4 text-center">
                    {user.certificates}
                  </td>

                  <td className="p-4">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      "uz-UZ"
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/admin/users/${user.id}`
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
        users.length > 0 && (
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