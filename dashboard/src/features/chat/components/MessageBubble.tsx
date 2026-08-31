import type { ChatMessage } from "../types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export default function MessageBubble({
  message,
  isMine,
}: MessageBubbleProps) {
  const formattedTime = new Date(
    message.createdAt
  ).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={[
        "flex w-full",
        isMine
          ? "justify-end"
          : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-3 md:max-w-[65%]",
          isMine
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md bg-white text-slate-800 shadow-sm ring-1 ring-slate-200",
        ].join(" ")}
      >
        {!isMine && (
          <p className="mb-1 text-xs font-semibold text-blue-600">
            {message.sender.fullName}
          </p>
        )}

        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.text}
          </p>
        )}

        <div
          className={[
            "mt-2 text-right text-[11px]",
            isMine
              ? "text-blue-100"
              : "text-slate-400",
          ].join(" ")}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
}