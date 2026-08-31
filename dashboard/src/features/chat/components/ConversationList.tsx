import type { Conversation } from "../types/chat";

interface ConversationListProps {
  conversations: Conversation[];

  currentUserId?: string;

  selectedConversationId: string | null;

  isLoading: boolean;

  onSelectConversation: (
    conversationId: string
  ) => void;

  onNewConversation: () => void;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  isLoading,
  onSelectConversation,
  onNewConversation,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4].map((item) => (
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
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-slate-500">
          Hali suhbatlar mavjud emas.
        </p>

        <button
          type="button"
          onClick={onNewConversation}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Yangi suhbat boshlash
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {conversations.map((conversation) => {
        const otherUser =
          conversation.otherUser;

        const lastMessage =
          conversation.lastMessage;

        const isSelected =
          conversation.id ===
          selectedConversationId;

        const initials =
          otherUser?.fullName
            ?.split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "?";

        const hasUnreadMessages =
          conversation.unreadCount > 0;

        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() =>
              onSelectConversation(
                conversation.id
              )
            }
            className={[
              "flex w-full items-center gap-3 p-4 text-left transition",
              isSelected
                ? "bg-blue-50"
                : "hover:bg-slate-50",
            ].join(" ")}
          >
            {/* Avatar */}

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">
              {otherUser?.avatarUrl ? (
                <img
                  src={otherUser.avatarUrl}
                  alt={otherUser.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* Conversation information */}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={[
                    "truncate",
                    hasUnreadMessages
                      ? "font-bold text-slate-950"
                      : "font-semibold text-slate-900",
                  ].join(" ")}
                >
                  {otherUser?.fullName ??
                    "Noma'lum foydalanuvchi"}
                </p>

                <div className="flex shrink-0 items-center gap-2">
                  {lastMessage && (
                    <span
                      className={[
                        "text-xs",
                        hasUnreadMessages
                          ? "font-semibold text-blue-600"
                          : "text-slate-400",
                      ].join(" ")}
                    >
                      {new Date(
                        lastMessage.createdAt
                      ).toLocaleTimeString(
                        "uz-UZ",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  )}

                  {hasUnreadMessages && (
                    <span className="flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                      {conversation.unreadCount > 99
                        ? "99+"
                        : conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              <p
                className={[
                  "mt-1 truncate text-sm",
                  hasUnreadMessages
                    ? "font-medium text-slate-800"
                    : "text-slate-500",
                ].join(" ")}
              >
                {lastMessage?.reel
                  ? `🎬 ${lastMessage.reel.title}`
                  : lastMessage?.text ??
                    "Hali xabar yo'q"}
              </p>
            </div>
          </button>
        );
      })}

      {/* Yangi suhbat */}

      <div className="p-4">
        <button
          type="button"
          onClick={onNewConversation}
          className="w-full rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          + Yangi suhbat
        </button>
      </div>
    </div>
  );
}