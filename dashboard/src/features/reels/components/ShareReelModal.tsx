import {
  MessageCircle,
  Search,
  Send,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Reel } from "../types/reel";

import { useChatUsers } from "@/features/chat/hooks/useChatUsers";
import { useCreateConversation } from "@/features/chat/hooks/useCreateConversation";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";

interface ShareReelModalProps {
  reel: Reel;
  open: boolean;
  onClose: () => void;
}

export default function ShareReelModal({
  reel,
  open,
  onClose,
}: ShareReelModalProps) {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const users = useChatUsers(search);

  const createConversation =
    useCreateConversation();

  const sendMessage =
    useSendMessage();

  if (!open) {
    return null;
  }

  const isPending =
    createConversation.isPending ||
    sendMessage.isPending;

  const handleSendToUser = (
    userId: string
  ) => {
    if (isPending) {
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
              reelId: reel.id,
            },
            {
              onSuccess: () => {
                onClose();

                navigate(
                  `/chat?conversationId=${conversation.id}`
                );
              },
            }
          );
        },
      }
    );
  };

  const copyToClipboard = async (
    text: string
  ) => {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        text
      );

      return;
    }

    const textarea =
      document.createElement(
        "textarea"
      );

    textarea.value = text;

    textarea.style.position =
      "fixed";

    textarea.style.left =
      "-999999px";

    document.body.appendChild(
      textarea
    );

    textarea.focus();

    textarea.select();

    document.execCommand(
      "copy"
    );

    textarea.remove();
  };

  const handleExternalShare =
    async () => {
      const url =
        `${window.location.origin}/reels/${reel.id}`;

      try {
        if (
          typeof navigator.share ===
          "function"
        ) {
          await navigator.share({
            title: reel.title,
            text:
              reel.description ??
              reel.title,
            url,
          });

          return;
        }

        await copyToClipboard(url);
      } catch {
        try {
          await copyToClipboard(url);
        } catch {
          // clipboard ishlamasa
        }
      }
    };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Reelni ulashish
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Qatra ichida yoki tashqarida
              ulashing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
        </div>

        {/* EXTERNAL SHARE */}

        <div className="border-b border-slate-200 p-4">
          <button
            type="button"
            onClick={() =>
              void handleExternalShare()
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-slate-100 p-4 text-left transition hover:bg-slate-200"
          >
            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <Share2 size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Tashqarida ulashish
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Reel havolasini boshqa
                ilovalarga yuboring.
              </p>
            </div>
          </button>
        </div>

        {/* USERS */}

        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Foydalanuvchini qidiring..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* USER LIST */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {users.isLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                  />
                )
              )}
            </div>
          ) : !users.data?.length ? (
            <div className="p-10 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-3 font-medium text-slate-600">
                Foydalanuvchi topilmadi
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.data.map(
                (user) => {
                  const initials =
                    user.fullName
                      .split(" ")
                      .filter(Boolean)
                      .map(
                        (part) =>
                          part[0]
                      )
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                  return (
                    <button
                      key={user.id}
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        handleSendToUser(
                          user.id
                        )
                      }
                      className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">
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

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {user.fullName}
                        </p>

                        <p className="truncate text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>

                      <div className="rounded-xl bg-blue-600 p-2 text-white">
                        <Send size={17} />
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}