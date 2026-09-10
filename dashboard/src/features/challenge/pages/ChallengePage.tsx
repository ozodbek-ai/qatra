import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  Plus,
  RefreshCw,
  Swords,
  Trophy,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";

import { getChatUsers } from "@/features/chat/api/getChatUsers";
import { getMyCourses } from "@/features/my-courses/api/getMyCourses";
import { useAuthStore } from "@/features/auth/store/auth.store";

import { getMyChallenges } from "../api/getMyChallenges";
import { createChallenge } from "../api/createChallenge";
import { acceptChallenge } from "../api/acceptChallenge";
import { declineChallenge } from "../api/declineChallenge";
import { deleteChallenge } from "../api/deleteChallenge";
import { getChallengeProgress } from "../api/getChallengeProgress";

import ChallengeCard from "../components/ChallengeCard";

import type { Challenge } from "../types/challenge.types";

type ChatUser = {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string | null;
};

type CourseOption = {
  id: string;
  title: string;
  imageUrl?: string | null;
};

type MyCourseItem = {
  id?: string;
  title?: string;
  imageUrl?: string | null;
  course?: CourseOption;
};

type ChallengeTab =
  | "ALL"
  | "PENDING"
  | "ACCEPTED"
  | "COMPLETED";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as ApiError
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return fallback;
}

function getCourseFromItem(
  item: MyCourseItem,
): CourseOption | null {
  if (
    item.course?.id &&
    item.course.title
  ) {
    return item.course;
  }

  if (
    item.id &&
    item.title
  ) {
    return {
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
    };
  }

  return null;
}

export default function ChallengePage() {
  const { user } = useAuthStore();

  const [challenges, setChallenges] =
    useState<Challenge[]>([]);

  const [users, setUsers] =
    useState<ChatUser[]>([]);

  const [emailSearch, setEmailSearch] =
    useState("");

  const [searchingUsers, setSearchingUsers] =
    useState(false);

  const searchTimeoutRef =
    useRef<number | null>(null);

  const [courses, setCourses] =
    useState<MyCourseItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [
    showCreateForm,
    setShowCreateForm,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState<string | null>(null);

  const [opponentId, setOpponentId] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<ChallengeTab>("ALL");

  const [
    selectedOpponent,
    setSelectedOpponent,
  ] = useState<ChatUser | null>(null);

  const loadData = useCallback(
    async () => {
      try {
        setLoading(true);

        const [
          challengesResponse,
          coursesData,
        ] = await Promise.all([
          getMyChallenges(),
          getMyCourses(),
        ]);

        setChallenges(
          challengesResponse.data ?? [],
        );

        setCourses(
          coursesData as MyCourseItem[],
        );
      } catch (error) {
        console.error(
          "Challenge data loading error:",
          error,
        );

        toast.error(
          "Ma'lumotlarni yuklashda xatolik yuz berdi.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const refreshChallenges =
    useCallback(async () => {
      try {
        const response =
          await getMyChallenges();

        setChallenges(
          response.data ?? [],
        );
      } catch (error) {
        console.error(
          "Challenge refresh error:",
          error,
        );
      }
    }, []);

  const handleUserSearch =
    useCallback(
      (value: string) => {
        setEmailSearch(value);
        setOpponentId("");
        setSelectedOpponent(null);

        if (
          searchTimeoutRef.current !== null
        ) {
          window.clearTimeout(
            searchTimeoutRef.current,
          );
        }

        const searchValue =
          value.trim();

        if (searchValue.length < 3) {
          setUsers([]);
          setSearchingUsers(false);
          return;
        }

        setSearchingUsers(true);

        searchTimeoutRef.current =
          window.setTimeout(
            async () => {
              try {
                const usersData =
                  await getChatUsers(
                    searchValue,
                  );

                const filteredUsers =
                  usersData.filter(
                    (chatUser) =>
                      chatUser.id !== user?.id,
                  );

                setUsers(filteredUsers);
              } catch (error) {
                console.error(
                  "User search error:",
                  error,
                );

                setUsers([]);
              } finally {
                setSearchingUsers(false);
              }
            },
            500,
          );
      },
      [user?.id],
    );

  /*
   * Initial data loading.
   *
   * queueMicrotask orqali chaqirish React 19
   * set-state-in-effect lint qoidasidagi
   * synchronous state update holatini oldini oladi.
   */
  useEffect(() => {
    queueMicrotask(() => {
      void loadData();
    });
  }, [loadData]);

  /*
   * Search timeout cleanup.
   */
  useEffect(() => {
    return () => {
      if (
        searchTimeoutRef.current !== null
      ) {
        window.clearTimeout(
          searchTimeoutRef.current,
        );
      }
    };
  }, []);

  /*
   * Challenge refresh va tab visibility.
   */
  useEffect(() => {
    const refreshIfVisible = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        void refreshChallenges();
      }
    };

    const interval =
      window.setInterval(
        refreshIfVisible,
        10000,
      );

    document.addEventListener(
      "visibilitychange",
      refreshIfVisible,
    );

    return () => {
      window.clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        refreshIfVisible,
      );
    };
  }, [refreshChallenges]);

  async function handleManualRefresh() {
    try {
      setRefreshing(true);

      await refreshChallenges();

      toast.success(
        "Challenge'lar yangilandi.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  async function handleCreateChallenge(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!opponentId) {
      toast.error(
        "Raqibni tanlang.",
      );

      return;
    }

    if (!courseId) {
      toast.error(
        "Kursni tanlang.",
      );

      return;
    }

    try {
      setCreating(true);

      await createChallenge({
        opponentId,
        courseId,
      });

      toast.success(
        "Challenge muvaffaqiyatli yuborildi!",
      );

      setOpponentId("");
      setCourseId("");
      setEmailSearch("");
      setUsers([]);
      setSelectedOpponent(null);
      setShowCreateForm(false);

      await refreshChallenges();
    } catch (error) {
      console.error(
        "Create challenge error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Challenge yaratishda xatolik yuz berdi.",
        ),
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleAccept(
    challengeId: string,
  ) {
    try {
      setActionLoading(challengeId);

      await acceptChallenge(
        challengeId,
      );

      toast.success(
        "Challenge qabul qilindi!",
      );

      await refreshChallenges();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Challenge-ni qabul qilishda xatolik yuz berdi.",
        ),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDecline(
    challengeId: string,
  ) {
    try {
      setActionLoading(challengeId);

      await declineChallenge(
        challengeId,
      );

      toast.success(
        "Challenge rad etildi.",
      );

      await refreshChallenges();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Challenge-ni rad etishda xatolik yuz berdi.",
        ),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(
    challengeId: string,
  ) {
    const confirmed =
      window.confirm(
        "Challenge-ni bekor qilmoqchimisiz?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(challengeId);

      await deleteChallenge(
        challengeId,
      );

      toast.success(
        "Challenge bekor qilindi.",
      );

      await refreshChallenges();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Challenge-ni o'chirishda xatolik yuz berdi.",
        ),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRefreshProgress(
    challengeId: string,
  ) {
    try {
      setActionLoading(challengeId);

      await getChallengeProgress(
        challengeId,
      );

      await refreshChallenges();

      toast.success(
        "Challenge progress yangilandi.",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Progressni yangilashda xatolik yuz berdi.",
        ),
      );
    } finally {
      setActionLoading(null);
    }
  }

  const filteredChallenges =
    useMemo(() => {
      if (activeTab === "ALL") {
        return challenges;
      }

      return challenges.filter(
        (challenge) =>
          challenge.status === activeTab,
      );
    }, [
      challenges,
      activeTab,
    ]);

  const pendingCount =
    challenges.filter(
      (challenge) =>
        challenge.status === "PENDING",
    ).length;

  const activeCount =
    challenges.filter(
      (challenge) =>
        challenge.status === "ACCEPTED",
    ).length;

  const completedCount =
    challenges.filter(
      (challenge) =>
        challenge.status === "COMPLETED",
    ).length;

  const tabs: {
    id: ChallengeTab;
    label: string;
    count: number;
    icon: typeof Trophy;
  }[] = [
    {
      id: "ALL",
      label: "Barchasi",
      count: challenges.length,
      icon: Users,
    },
    {
      id: "PENDING",
      label: "Kutilmoqda",
      count: pendingCount,
      icon: Clock,
    },
    {
      id: "ACCEPTED",
      label: "Faol",
      count: activeCount,
      icon: Swords,
    },
    {
      id: "COMPLETED",
      label: "Yakunlangan",
      count: completedCount,
      icon: CheckCircle2,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Challenge'lar yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Trophy size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Challenge
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Do'stlaringiz bilan kurslarni
                birinchi bo'lib tugatish uchun
                musobaqalashing.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              void handleManualRefresh()
            }
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Yangilash
          </button>

          <button
            type="button"
            onClick={() =>
              setShowCreateForm(
                (value) => !value,
              )
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />

            Yangi challenge
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form
          onSubmit={
            handleCreateChallenge
          }
          className="mt-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Swords size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Yangi challenge yaratish
              </h2>

              <p className="text-sm text-slate-500">
                Raqib va kursni tanlang.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Raqib
              </label>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Raqib email manzili
                </label>

                <input
                  type="email"
                  value={emailSearch}
                  onChange={(event) =>
                    handleUserSearch(
                      event.target.value,
                    )
                  }
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Foydalanuvchini email manzili
                  orqali qidiring.
                </p>

                {searchingUsers && (
                  <p className="mt-3 text-sm text-slate-500">
                    Qidirilmoqda...
                  </p>
                )}

                {!searchingUsers &&
                  emailSearch.trim().length >=
                    3 &&
                  users.length === 0 && (
                    <p className="mt-3 text-sm text-slate-500">
                      Bunday foydalanuvchi topilmadi.
                    </p>
                  )}

                {users.length > 0 && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {users.map(
                      (chatUser) => {
                        const isSelected =
                          opponentId ===
                          chatUser.id;

                        return (
                          <button
                            key={
                              chatUser.id
                            }
                            type="button"
                            onClick={() => {
                              setOpponentId(
                                chatUser.id,
                              );

                              setSelectedOpponent(
                                chatUser,
                              );

                              setEmailSearch(
                                chatUser.email ??
                                  "",
                              );

                              setUsers([]);
                            }}
                            className={[
                              "flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 transition",
                              isSelected
                                ? "bg-blue-50"
                                : "hover:bg-slate-50",
                            ].join(" ")}
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">
                              {chatUser.avatarUrl ? (
                                <img
                                  src={
                                    chatUser.avatarUrl
                                  }
                                  alt={
                                    chatUser.fullName
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                chatUser.fullName
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900">
                                {
                                  chatUser.fullName
                                }
                              </p>

                              <p className="truncate text-sm text-slate-500">
                                {
                                  chatUser.email
                                }
                              </p>
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>
                )}

                {selectedOpponent && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-semibold text-emerald-700">
                        {selectedOpponent.avatarUrl ? (
                          <img
                            src={
                              selectedOpponent.avatarUrl
                            }
                            alt={
                              selectedOpponent.fullName
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          selectedOpponent.fullName
                            .charAt(
                              0,
                            )
                            .toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {
                            selectedOpponent.fullName
                          }
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {
                            selectedOpponent.email
                          }
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOpponent(
                          null,
                        );
                        setOpponentId("");
                        setEmailSearch("");
                        setUsers([]);
                      }}
                      className="ml-3 shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Bekor qilish
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Kurs
              </label>

              <select
                value={courseId}
                onChange={(event) =>
                  setCourseId(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Kursni tanlang
                </option>

                {courses
                  .map(getCourseFromItem)
                  .filter(
                    (
                      course,
                    ): course is CourseOption =>
                      course !== null,
                  )
                  .map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={creating}
              onClick={() => {
                setShowCreateForm(false);
                setOpponentId("");
                setSelectedOpponent(null);
                setCourseId("");
                setEmailSearch("");
                setUsers([]);
              }}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Bekor qilish
            </button>

            <button
              type="submit"
              disabled={creating}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Swords size={18} />

              {creating
                ? "Yuborilmoqda..."
                : "Challenge yuborish"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Jami challenge
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {challenges.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">
            Kutilmoqda
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-900">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm text-blue-700">
            Faol challenge
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-900">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">
            Yakunlangan
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-900">
            {completedCount}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const isActive =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={[
                  "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                <Icon size={17} />

                {tab.label}

                <span
                  className={[
                    "flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredChallenges.length ===
      0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Swords size={30} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-800">
            Challenge topilmadi
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Hozircha ushbu bo'limda
            challenge mavjud emas.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowCreateForm(true)
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />

            Birinchi challenge yaratish
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredChallenges.map(
            (challenge) => (
              <div
                key={challenge.id}
                className="relative"
              >
                <ChallengeCard
                  challenge={challenge}
                  currentUserId={user?.id}
                  isAccepting={
                    actionLoading ===
                    challenge.id
                  }
                  isDeclining={
                    actionLoading ===
                    challenge.id
                  }
                  isDeleting={
                    actionLoading ===
                    challenge.id
                  }
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onDelete={handleDelete}
                />

                {challenge.status ===
                  "ACCEPTED" && (
                  <button
                    type="button"
                    disabled={
                      actionLoading ===
                      challenge.id
                    }
                    onClick={() =>
                      void handleRefreshProgress(
                        challenge.id,
                      )
                    }
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-blue-600 disabled:opacity-50"
                    title="Progressni yangilash"
                  >
                    <RefreshCw
                      size={16}
                      className={
                        actionLoading ===
                        challenge.id
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}