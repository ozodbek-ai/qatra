import {
  ArrowLeft,
  Film,
  Send,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useQueryClient,
} from "@tanstack/react-query";

import type {
  ChatMessage,
  ChatUser,
} from "../types/chat";

import { markAsRead } from "../api/markAsRead";

import MessageBubble from "./MessageBubble";
import ReelMessage from "./ReelMessage";

import { useReels } from "@/features/reels/hooks/useReels";

interface ChatWindowProps {
  conversationId: string;

  selectedUser: ChatUser;

  messages: ChatMessage[];

  currentUserId?: string;

  isLoading: boolean;

  isSending: boolean;

  onSendMessage: (
    text: string
  ) => void;

  onSendReel?: (
    reelId: string
  ) => void;

  onBack: () => void;
}

export default function ChatWindow({
  conversationId,
  selectedUser,
  messages,
  currentUserId,
  isLoading = false,
  isSending = false,
  onSendMessage,
  onSendReel,
  onBack,
}: ChatWindowProps) {
  const [message, setMessage] =
    useState("");

  const [
    showReels,
    setShowReels,
  ] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const queryClient =
    useQueryClient();

  const {
    data: reels,
    isLoading: isReelsLoading,
    isError: isReelsError,
  } = useReels();

  /*
   * Conversation ochilganda
   * xabarlarni o'qilgan deb belgilaymiz.
   */
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const markConversationAsRead =
      async () => {
        try {
          await markAsRead(conversationId);

          await queryClient.invalidateQueries({
            queryKey: ["chat-conversations"],
          });
        } catch (error) {
          console.error(
            "Suhbatni o'qilgan deb belgilashda xatolik:",
            error
          );
        }
      };

    markConversationAsRead();
  }, [
    conversationId,
    queryClient,
  ]);

  /*
   * Yangi xabar kelganda pastga tushish.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const text = message.trim();

    if (!text || isSending) {
      return;
    }

    onSendMessage(text);

    setMessage("");
  };

  const handleSendReel = (
    reelId: string
  ) => {
    if (isSending) {
      return;
    }

    if (!onSendReel) {
      return;
    }

    onSendReel(reelId);

    setShowReels(false);
  };

  const initials =
    selectedUser.fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      <div className="flex h-full flex-1 flex-col">

        {/* CHAT HEADER */}

        <header className="flex h-20 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
            aria-label="Orqaga qaytish"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">
            {selectedUser.avatarUrl ? (
              <img
                src={selectedUser.avatarUrl}
                alt={selectedUser.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-semibold text-slate-900">
              {selectedUser.fullName}
            </h2>

            <p className="truncate text-sm text-slate-500">
              {selectedUser.email}
            </p>
          </div>
        </header>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-16 w-48 rounded-2xl bg-slate-200" />

                    <div className="h-3 w-16 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-4xl">
                  👋
                </div>

                <p className="mt-4 text-lg font-medium text-slate-600">
                  Suhbat boshlandi
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Birinchi xabar yoki Reel yuboring.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((chatMessage) => {
                const isMine =
                  chatMessage.senderId ===
                  currentUserId;

                if (chatMessage.reel) {
                  return (
                    <ReelMessage
                      key={chatMessage.id}
                      message={chatMessage}
                      isMine={isMine}
                    />
                  );
                }

                return (
                  <MessageBubble
                    key={chatMessage.id}
                    message={chatMessage}
                    isMine={isMine}
                  />
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* MESSAGE INPUT */}

        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setShowReels(true)
              }
              disabled={
                isSending ||
                !onSendReel
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              title="Reel yuborish"
              aria-label="Reel yuborish"
            >
              <Film size={20} />
            </button>

            <input
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Xabar yozing..."
              disabled={isSending}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

            <button
              type="submit"
              disabled={
                !message.trim() ||
                isSending
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              title="Xabar yuborish"
              aria-label="Xabar yuborish"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* REEL SELECT MODAL */}

      {showReels && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Reel yuborish
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Suhbatga yubormoqchi bo'lgan
                  Reelni tanlang.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowReels(false)
                }
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Yopish"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {isReelsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : isReelsError ? (
                <div className="py-12 text-center">
                  <p className="font-medium text-red-500">
                    Reels yuklanmadi.
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Keyinroq qayta urinib ko'ring.
                  </p>
                </div>
              ) : !reels?.length ? (
                <div className="py-12 text-center text-slate-500">
                  Hozircha yuborish uchun Reel mavjud emas.
                </div>
              ) : (
                <div className="space-y-3">
                  {reels.map((reel) => (
                    <button
                      key={reel.id}
                      type="button"
                      disabled={
                        isSending ||
                        !onSendReel
                      }
                      onClick={() =>
                        handleSendReel(reel.id)
                      }
                      className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-black">
                        {reel.thumbnailUrl ? (
                          <img
                            src={reel.thumbnailUrl}
                            alt={reel.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Film
                              size={22}
                              className="text-white"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-slate-900">
                          {reel.title}
                        </h3>

                        {reel.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {reel.description}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 text-sm font-medium text-blue-600">
                        Yuborish
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}