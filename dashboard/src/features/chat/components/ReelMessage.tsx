import {
  Clapperboard,
  Play,
} from "lucide-react";
import {
  useNavigate,
} from "react-router-dom";

import type {
  ChatMessage,
} from "../types/chat";

interface ReelMessageProps {
  message: ChatMessage;
  isMine: boolean;
}

export default function ReelMessage({
  message,
  isMine,
}: ReelMessageProps) {
  const navigate = useNavigate();

  const reel = message.reel;

  if (!reel) {
    return null;
  }

  const formattedTime = new Date(
    message.createdAt
  ).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleOpenReel = () => {
    navigate(`/reels/${reel.id}`);
  };

  return (
    <div
      className={[
        "flex w-full",
        isMine
          ? "justify-end"
          : "justify-start",
      ].join(" ")}
    >
      <div className="max-w-[85%] md:max-w-[420px]">
        {!isMine && (
          <p className="mb-2 px-1 text-xs font-semibold text-slate-500">
            {message.sender?.fullName ??  "Foydalanuvchi"}
          </p>
        )}

        <button
          type="button"
          onClick={handleOpenReel}
          className={[
            "group w-full overflow-hidden rounded-2xl text-left transition",
            "hover:-translate-y-0.5 hover:shadow-lg",
            isMine
              ? "bg-blue-600"
              : "bg-white shadow-sm ring-1 ring-slate-200",
          ].join(" ")}
        >
          <div className="relative aspect-video overflow-hidden bg-slate-900">
            {reel.thumbnailUrl ? (
              <img
                src={reel.thumbnailUrl}
                alt={reel.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Clapperboard
                  size={42}
                  className="text-white/70"
                />
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition group-hover:scale-110">
                <Play
                  size={20}
                  className="ml-1"
                  fill="currentColor"
                />
              </div>
            </div>

            <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Clapperboard size={14} />

              Reel
            </div>
          </div>

          <div className="p-4">
            <h3
              className={[
                "line-clamp-1 font-semibold",
                isMine
                  ? "text-white"
                  : "text-slate-900",
              ].join(" ")}
            >
              {reel.title}
            </h3>

            {reel.description && (
              <p
                className={[
                  "mt-1 line-clamp-2 text-sm",
                  isMine
                    ? "text-blue-100"
                    : "text-slate-500",
                ].join(" ")}
              >
                {reel.description}
              </p>
            )}

            <div
              className={[
                "mt-3 text-right text-[11px]",
                isMine
                  ? "text-blue-100"
                  : "text-slate-400",
              ].join(" ")}
            >
              {formattedTime}
            </div>
          </div>
        </button>

        {message.text && (
          <div
            className={[
              "mt-2 rounded-2xl px-4 py-3 text-sm",
              isMine
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200",
            ].join(" ")}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}