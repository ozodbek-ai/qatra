import {
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  MessageCircle,
  UserPlus,
  X,
} from "lucide-react";

import ConversationList from "../components/ConversationList";
import ChatUsers from "../components/ChatUsers";
import ChatWindow from "../components/ChatWindow";

import {
  useChatUsers,
} from "../hooks/useChatUsers";

import {
  useConversations,
} from "../hooks/useConversations";

import {
  useCreateConversation,
} from "../hooks/useCreateConversation";

import {
  useMessages,
} from "../hooks/useMessages";

import {
  useSendMessage,
} from "../hooks/useSendMessage";

import {
  useAuthStore,
} from "@/features/auth/store/auth.store";

import type {
  ChatUser,
} from "../types/chat";

import {
  useChatSocket,
} from "../hooks/useChatSocket";


export default function ChatPage() {
  const currentUser = useAuthStore(
    (state) => state.user
  );

  useChatSocket();

  /*
   * =====================
   * URL STATE
   * =====================
   */

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const selectedConversationId =
    searchParams.get(
      "conversationId"
    );

  /*
   * =====================
   * LOCAL STATE
   * =====================
   */

  const [
    showUsers,
    setShowUsers,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  /*
   * =====================
   * QUERIES
   * =====================
   */

  const conversations =
    useConversations();

  const users =
    useChatUsers(search);

  const messages =
    useMessages(
      selectedConversationId
    );

  /*
   * =====================
   * MUTATIONS
   * =====================
   */

  const createConversation =
    useCreateConversation();

  const sendMessage =
    useSendMessage();

  /*
   * =====================
   * SELECTED CONVERSATION
   * =====================
   */

  const selectedConversation =
    useMemo(() => {
      if (
        !selectedConversationId ||
        !conversations.data
      ) {
        return null;
      }

      return (
        conversations.data.find(
          (conversation) =>
            conversation.id ===
            selectedConversationId
        ) ?? null
      );
    }, [
      conversations.data,
      selectedConversationId,
    ]);

  /*
   * =====================
   * OTHER USER
   * =====================
   */

  const selectedUser =
  useMemo(() => {
    if (!selectedConversation) {
      return null;
    }

    return selectedConversation.otherUser;
  }, [selectedConversation]);

  /*
   * =====================
   * SELECT CONVERSATION
   * =====================
   */

  const handleSelectConversation = (
    conversationId: string
  ) => {
    setSearchParams({
      conversationId,
    });
  };

  /*
   * =====================
   * CREATE CONVERSATION
   * =====================
   *
   * ChatUsers component
   * ChatUser object yuboradi.
   */

  const handleCreateConversation = (
    user: ChatUser
  ) => {
    if (createConversation.isPending) {
      return;
    }

    createConversation.mutate(
      user.id,
      {
        onSuccess: (
          conversation
        ) => {
          setSearchParams({
            conversationId:
              conversation.id,
          });

          setShowUsers(false);

          setSearch("");
        },
      }
    );
  };

  /*
   * =====================
   * SEND TEXT MESSAGE
   * =====================
   */

  const handleSendMessage = (
    text: string
  ) => {
    if (
      !selectedConversationId ||
      !text.trim() ||
      sendMessage.isPending
    ) {
      return;
    }

    sendMessage.mutate({
      conversationId:
        selectedConversationId,

      text:
        text.trim(),
    });
  };

  /*
   * =====================
   * SEND REEL
   * =====================
   */

  const handleSendReel = (
    reelId: string
  ) => {
    if (
      !selectedConversationId ||
      sendMessage.isPending
    ) {
      return;
    }

    sendMessage.mutate({
      conversationId:
        selectedConversationId,

      reelId,
    });
  };

  /*
   * =====================
   * MOBILE BACK
   * =====================
   */

  const handleBack = () => {
    setSearchParams({});
  };

  /*
   * =====================
   * MODAL
   * =====================
   */

  const handleOpenUsers = () => {
    setShowUsers(true);
  };

  const handleCloseUsers = () => {
    if (createConversation.isPending) {
      return;
    }

    setShowUsers(false);

    setSearch("");
  };

  /*
   * =====================
   * RENDER
   * =====================
   */

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="flex h-full">

        {/* =====================
            CONVERSATION LIST
        ===================== */}

        <aside
          className={[
            "w-full max-w-sm shrink-0",
            "border-r border-[var(--color-border)]",
            "lg:flex",

            selectedConversationId
              ? "hidden lg:flex"
              : "flex",
          ].join(" ")}
        >
          <ConversationList
            conversations={
              conversations.data ?? []
            }
            currentUserId={
              currentUser?.id
            }
            selectedConversationId={
              selectedConversationId
            }
            isLoading={
              conversations.isLoading
            }
            onSelectConversation={
              handleSelectConversation
            }
            onNewConversation={
              handleOpenUsers
            }
          />
        </aside>

        {/* =====================
            CHAT WINDOW
        ===================== */}

        <section
          className={[
            "min-w-0 flex-1",

            selectedConversationId
              ? "flex"
              : "hidden lg:flex",
          ].join(" ")}
        >

          {/* =====================
              NO CONVERSATION
          ===================== */}

          {!selectedConversationId && (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <MessageCircle className="h-10 w-10 text-blue-600" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Suhbatni tanlang
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Mavjud suhbatni tanlang yoki
                yangi foydalanuvchi bilan
                suhbat boshlang.
              </p>

              <button
                type="button"
                onClick={
                  handleOpenUsers
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <UserPlus size={18} />

                Yangi suhbat
              </button>

            </div>
          )}

          {/* =====================
              LOADING
          ===================== */}

          {selectedConversationId &&
            conversations.isLoading && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-slate-500">
                  Suhbat yuklanmoqda...
                </p>
              </div>
            )}

          {/* =====================
              CONVERSATION NOT FOUND
          ===================== */}

          {selectedConversationId &&
            !conversations.isLoading &&
            !selectedConversation && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

                <MessageCircle className="h-12 w-12 text-slate-300" />

                <h2 className="mt-4 text-lg font-semibold text-slate-800">
                  Suhbat topilmadi
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Bu suhbat mavjud emas yoki
                  unga kirish huquqingiz yo'q.
                </p>

                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Suhbatlar ro'yxatiga qaytish
                </button>

              </div>
            )}

          {/* =====================
              CHAT
          ===================== */}

          {selectedConversation &&
  selectedUser && (
    <ChatWindow
      conversationId={
        selectedConversation.id
      }

      selectedUser={
        selectedUser
      }

      messages={
        messages.data ?? []
      }

      currentUserId={
        currentUser?.id
      }

      isLoading={
        messages.isLoading
      }

      isSending={
        sendMessage.isPending
      }

      onSendMessage={
        handleSendMessage
      }

      onSendReel={
        handleSendReel
      }

      onBack={
        handleBack
      }
    />
  )}

        </section>

      </div>

      {/* =====================
          USER SEARCH MODAL
      ===================== */}

      {showUsers && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={
            handleCloseUsers
          }
        >
          <div
            className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <h2 className="font-bold text-slate-900">
                  Yangi suhbat
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Foydalanuvchini qidiring va
                  suhbat boshlang.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseUsers
                }
                disabled={
                  createConversation.isPending
                }
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                aria-label="Modalni yopish"
              >
                <X size={20} />
              </button>

            </div>

            {/* USERS */}

<div className="min-h-0 flex-1 overflow-y-auto">
  <ChatUsers
    users={users.data ?? []}

    isLoading={
      users.isLoading
    }

    isCreatingConversation={
      createConversation.isPending
    }

    onSearch={
      setSearch
    }

    onSelectUser={
      handleCreateConversation
    }
  />
</div>

          </div>
        </div>
      )}
    </div>
  );
}