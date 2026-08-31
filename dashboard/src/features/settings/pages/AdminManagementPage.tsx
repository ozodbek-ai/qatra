import {
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

import { useAdminUsers } from "../hooks/useAdminUsers";
import { useUpdateUserRole } from "../hooks/useUpdateUserRole";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function AdminManagementPage() {
  const [page, setPage] = useState(1);

  const currentUser = useAuthStore(
    (state) => state.user
  );

  const {
    data,
    isLoading,
    isError,
  } = useAdminUsers(page, 20);

  const updateRole =
    useUpdateUserRole();

  const handleRoleChange = (
    userId: string,
    role: "ADMIN" | "STUDENT",
    fullName: string
  ) => {
    /*
     * SUPER_ADMIN o'zini oddiy userga
     * aylantirib yubormasligi kerak.
     */
    if (
      currentUser?.id === userId &&
      role === "STUDENT"
    ) {
      toast.error(
        "O'zingizni adminlikdan chiqara olmaysiz."
      );

      return;
    }

    const actionText =
      role === "ADMIN"
        ? `${fullName} foydalanuvchisini admin qilmoqchimisiz?`
        : `${fullName} foydalanuvchisini adminlikdan chiqarmoqchimisiz?`;

    const confirmed =
      window.confirm(actionText);

    if (!confirmed) {
      return;
    }

    updateRole.mutate({
      userId,
      role,
    });
  };

  if (isLoading) {
    return (
      <main className="p-6 md:p-8">
        <p className="text-slate-500">
          Foydalanuvchilar yuklanmoqda...
        </p>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="p-6 md:p-8">
        <div className="rounded-2xl bg-red-50 p-6 text-red-600">
          Foydalanuvchilarni yuklab bo'lmadi.
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-6 md:p-8">

      {/* Header */}

      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
          <ShieldCheck size={24} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Adminlarni boshqarish
          </h1>

          <p className="mt-1 text-slate-500">
            Foydalanuvchilarga administrator
            huquqlarini berish yoki olib tashlash.
          </p>
        </div>
      </div>

      {/* Table */}

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Foydalanuvchilar
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jami {data.total} ta foydalanuvchi
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-500">

                <th className="px-6 py-4">
                  Foydalanuvchi
                </th>

                <th className="px-6 py-4">
                  Rol
                </th>

                <th className="px-6 py-4">
                  Kurslar
                </th>

                <th className="px-6 py-4">
                  Sertifikatlar
                </th>

                <th className="px-6 py-4">
                  Qo'shilgan sana
                </th>

                <th className="px-6 py-4 text-right">
                  Amal
                </th>

              </tr>
            </thead>

            <tbody>

              {data.users.map((user) => {

                const isCurrentUser =
                  currentUser?.id === user.id;

                const isUpdating =
                  updateRole.isPending &&
                  updateRole.variables?.userId ===
                    user.id;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    {/* User */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                            {user.fullName
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>

                          <p className="font-medium text-slate-900">
                            {user.fullName}

                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-slate-400">
                                (Siz)
                              </span>
                            )}
                          </p>

                          <p className="text-sm text-slate-500">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Role */}

                    <td className="px-6 py-5">

                      {user.role === "SUPER_ADMIN" ? (

                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          <ShieldCheck size={14} />
                          Bosh admin
                        </span>

                      ) : user.role === "ADMIN" ? (

                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          <UserCog size={14} />
                          Admin
                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          Foydalanuvchi
                        </span>

                      )}

                    </td>

                    {/* Courses */}

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {user.enrolledCourses}
                    </td>

                    {/* Certificates */}

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {user.certificates}
                    </td>

                    {/* Created */}

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString(
                        "uz-UZ"
                      )}
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5 text-right">

                      {user.role ===
                      "SUPER_ADMIN" ? (

                        <span className="text-xs font-medium text-purple-500">
                          Himoyalangan
                        </span>

                      ) : user.role ===
                      "ADMIN" ? (

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            isCurrentUser
                          }
                          onClick={() =>
                            handleRoleChange(
                              user.id,
                              "STUDENT",
                              user.fullName
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <UserX size={16} />

                          {isUpdating
                            ? "Yangilanmoqda..."
                            : "Adminlikdan olish"}
                        </button>

                      ) : (

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleRoleChange(
                              user.id,
                              "ADMIN",
                              user.fullName
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <UserCheck size={16} />

                          {isUpdating
                            ? "Yangilanmoqda..."
                            : "Admin qilish"}
                        </button>

                      )}

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {data.users.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            Foydalanuvchilar topilmadi.
          </div>
        )}

      </section>

      {/* Pagination */}

      {data.totalPages > 1 && (

        <div className="flex items-center justify-center gap-3">

          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage(
                (current) => current - 1
              )
            }
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Oldingi
          </button>

          <span className="text-sm text-slate-500">
            {page} / {data.totalPages}
          </span>

          <button
            type="button"
            disabled={
              page === data.totalPages
            }
            onClick={() =>
              setPage(
                (current) => current + 1
              )
            }
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Keyingi
          </button>

        </div>

      )}

    </main>
  );
}