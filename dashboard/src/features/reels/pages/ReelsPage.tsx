import {
  Search,
  Send,
  User,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";

import ReelCard from "../components/ReelCard";
import ReelComments from "../components/ReelComments";

import type { Reel } from "../types/reel";

import { useReels } from "../hooks/useReels";

/*
 * Chat hooks
 */
import { useChatUsers } from "@/features/chat/hooks/useChatUsers";
import { useCreateConversation } from "@/features/chat/hooks/useCreateConversation";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";

export default function ReelsPage() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useReels();

  const [
    selectedReelId,
    setSelectedReelId,
  ] = useState<string | null>(
    null
  );

  /*
   * Share modal
   */

  const [
    shareReel,
    setShareReel,
  ] = useState<Reel | null>(
    null
  );

  const [
    userSearch,
    setUserSearch,
  ] = useState("");

  /*
   * Chat users
   */

  const chatUsers =
    useChatUsers(userSearch);

  /*
   * Create conversation
   */

  const createConversation =
    useCreateConversation();

  /*
   * Send reel
   */

  const sendMessage =
    useSendMessage();

  const handleShareToChat = (
    reel: Reel
  ) => {
    setShareReel(reel);

    setUserSearch("");
  };

  const handleCloseShareModal = () => {
    if (
      createConversation.isPending ||
      sendMessage.isPending
    ) {
      return;
    }

    setShareReel(null);

    setUserSearch("");
  };

  /*
   * Reel yuborish
   */

  const handleSendReel = (
    userId: string
  ) => {
    if (!shareReel) {
      return;
    }

    createConversation.mutate(
      userId,
      {
        onSuccess: (
          conversation
        ) => {
          sendMessage.mutate(
            {
              conversationId:
                conversation.id,

              reelId:
                shareReel.id,
            },
            {
              onSuccess: () => {
                toast.success(
                  "Reel muvaffaqiyatli yuborildi."
                );

                setShareReel(null);

                navigate(
                  `/chat?conversationId=${conversation.id}`
                );
              },

              onError: () => {
                toast.error(
                  "Reelni yuborishda xatolik yuz berdi."
                );
              },
            }
          );
        },

        onError: () => {
          toast.error(
            "Suhbat yaratishda xatolik yuz berdi."
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-black text-white">
        Reels yuklanmoqda...
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Reels yuklanmadi"
        description="Videolarni yuklashda xatolik yuz berdi."
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="Hozircha Reels yo'q"
        description="Yangi videolar tez orada joylanadi."
      />
    );
  }

  return (
    <>
      <main className="relative h-[calc(100vh-64px)] overflow-hidden bg-black">
        <div className="h-full snap-y snap-mandatory overflow-y-auto">
          {data.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              onComments={() =>
                setSelectedReelId(
                  reel.id
                )
              }
              onShareToChat={
                handleShareToChat
              }
            />
          ))}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 text-sm font-medium text-white/70 md:block">
          Yuqoriga / pastga suring
        </div>

        {selectedReelId && (
          <ReelComments
            reelId={
              selectedReelId
            }
            open={
              Boolean(
                selectedReelId
              )
            }
            onClose={() =>
              setSelectedReelId(null)
            }
          />
        )}
      </main>

      {/* =====================
          SEND REEL MODAL
      ===================== */}

      {shareReel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Reelni yuborish
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Qatra foydalanuvchisini tanlang
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseShareModal
                }
                disabled={
                  createConversation.isPending ||
                  sendMessage.isPending
                }
                className="rounded-xl p-2 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Selected reel */}

            <div className="border-b border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-200">
                  {shareReel.thumbnailUrl ? (
                    <img
                      src={
                        shareReel.thumbnailUrl
                      }
                      alt={
                        shareReel.title
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Send
                      size={20}
                      className="text-blue-600"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">
                    {shareReel.title}
                  </p>

                  <p className="truncate text-sm text-slate-500">
                    Reel yuborishga tayyor
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}

            <div className="border-b border-slate-200 p-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3">
                <Search
                  size={19}
                  className="text-slate-400"
                />

                <input
                  value={userSearch}
                  onChange={(event) =>
                    setUserSearch(
                      event.target.value
                    )
                  }
                  placeholder="Foydalanuvchini qidiring..."
                  className="h-12 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Users */}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {chatUsers.isLoading ? (
                <div className="space-y-4 p-5">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex animate-pulse items-center gap-3"
                      >
                        <div className="h-11 w-11 rounded-full bg-slate-200" />

                        <div className="space-y-2">
                          <div className="h-4 w-32 rounded bg-slate-200" />

                          <div className="h-3 w-48 rounded bg-slate-100" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : chatUsers.isError ? (
                <div className="p-8 text-center text-sm text-red-500">
                  Foydalanuvchilarni yuklashda
                  xatolik yuz berdi.
                </div>
              ) : (
                <div className="p-2">
                  {chatUsers.data?.map(
                    (user) => {
                      const initials =
                        user.fullName
                          .split(" ")
                          .map(
                            (part) =>
                              part[0]
                          )
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();

                      const isPending =
                        createConversation.isPending ||
                        sendMessage.isPending;

                      return (
                        <button
                          key={user.id}
                          type="button"
                          disabled={isPending}
                          onClick={() =>
                            handleSendReel(
                              user.id
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {/* Avatar */}

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">
                            {user.avatarUrl ? (
                              <img
                                src={
                                  user.avatarUrl
                                }
                                alt={
                                  user.fullName
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>

                          {/* User info */}

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-900">
                              {user.fullName}
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>

                          <Send
                            size={18}
                            className="text-blue-600"
                          />
                        </button>
                      );
                    }
                  )}

                  {chatUsers.data?.length ===
                    0 && (
                    <div className="flex flex-col items-center gap-3 p-10 text-center text-slate-500">
                      <User
                        size={32}
                        className="text-slate-300"
                      />

                      <p className="text-sm">
                        Foydalanuvchi topilmadi.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}