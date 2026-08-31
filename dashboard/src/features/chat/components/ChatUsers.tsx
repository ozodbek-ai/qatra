import { Search, User } from "lucide-react";
import { useState } from "react";

import type { ChatUser } from "../types/chat";

interface ChatUsersProps {
  users: ChatUser[];
  isLoading?: boolean;
  isCreatingConversation?: boolean;

  onSearch: (search: string) => void;

  onSelectUser: (
    user: ChatUser
  ) => void;
}

export default function ChatUsers({
  users,
  isLoading = false,
  isCreatingConversation = false,
  onSearch,
  onSelectUser,
}: ChatUsersProps) {
  const [search, setSearch] =
    useState("");

  const handleSearch = (
    value: string
  ) => {
    setSearch(value);

    onSearch(value);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Search */}

      <div className="border-b border-slate-200 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) =>
              handleSearch(
                event.target.value
              )
            }
            placeholder="Foydalanuvchini qidiring..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Users */}

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-3"
                >
                  <div className="h-12 w-12 rounded-full bg-slate-200" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-slate-200" />

                    <div className="h-3 w-48 rounded bg-slate-100" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {!isLoading &&
          users.length === 0 && (
            <div className="p-8 text-center">
              <User
                size={36}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-600">
                Foydalanuvchilar topilmadi
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Boshqa ism yoki email orqali
                qidirib ko'ring.
              </p>
            </div>
          )}

        {!isLoading &&
          users.map((user) => {
            const initials =
              user.fullName
                .split(" ")
                .map(
                  (part) => part[0]
                )
                .join("")
                .slice(0, 2)
                .toUpperCase();

            return (
              <button
                key={user.id}
                type="button"
                disabled={
                  isCreatingConversation
                }
                onClick={() =>
                  onSelectUser(user)
                }
                className="flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* Avatar */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* User information */}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {user.fullName}
                  </p>

                  <p className="truncate text-sm text-slate-500">
                    {user.email}
                  </p>

                  <p className="mt-1 text-xs text-blue-600">
                    {user.role === "SUPER_ADMIN"
                      ? "Bosh admin"
                      : user.role === "ADMIN"
                        ? "Admin"
                        : "Foydalanuvchi"}
                  </p>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}