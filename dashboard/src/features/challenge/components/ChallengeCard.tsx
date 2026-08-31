import {
  Check,
  Play,
  Swords,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type {
  Challenge,
} from "../types/challenge.types";

interface ChallengeCardProps {
  challenge: Challenge;

  currentUserId?: string;

  isAccepting?: boolean;
  isDeclining?: boolean;
  isDeleting?: boolean;

  onAccept: (
    challengeId: string
  ) => void;

  onDecline: (
    challengeId: string
  ) => void;

  onDelete: (
    challengeId: string
  ) => void;
}

export default function ChallengeCard({
  challenge,
  currentUserId,
  isAccepting = false,
  isDeclining = false,
  isDeleting = false,
  onAccept,
  onDecline,
  onDelete,
}: ChallengeCardProps) {
  const navigate = useNavigate();

  const isChallenger =
    challenge.challengerId === currentUserId;

  const isOpponent =
    challenge.opponentId === currentUserId;

  const otherUser =
    isChallenger
      ? challenge.opponent
      : challenge.challenger;

  const myUser =
    isChallenger
      ? challenge.challenger
      : challenge.opponent;

  const myScore =
    isChallenger
      ? challenge.challengerScore
      : challenge.opponentScore;

  const opponentScore =
    isChallenger
      ? challenge.opponentScore
      : challenge.challengerScore;

  const myCompletedAt =
    isChallenger
      ? challenge.challengerCompletedAt
      : challenge.opponentCompletedAt;

  const opponentCompletedAt =
    isChallenger
      ? challenge.opponentCompletedAt
      : challenge.challengerCompletedAt;

  const isPending =
    challenge.status === "PENDING";

  const isAccepted =
    challenge.status === "ACCEPTED";

  const isCompleted =
    challenge.status === "COMPLETED";

  const isDeclined =
    challenge.status === "DECLINED";

  const statusLabel = {
    PENDING: "Kutilmoqda",
    ACCEPTED: "Faol",
    DECLINED: "Rad etilgan",
    COMPLETED: "Yakunlangan",
  }[challenge.status];

  const statusClass = {
    PENDING:
      "bg-yellow-400 text-yellow-950",

    ACCEPTED:
      "bg-green-600 text-white",

    DECLINED:
      "bg-slate-300 text-slate-700",

    COMPLETED:
      "bg-blue-600 text-white",
  }[challenge.status];

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "Tugatmagan";
    }

    return new Date(
      date
    ).toLocaleString("uz-UZ", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getInitials = (
    name?: string
  ) => {
    if (!name) {
      return "?";
    }

    return name
      .split(" ")
      .map(
        (part) => part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getWinnerMessage = () => {
    if (!challenge.winnerId) {
      return "Challenge durang bilan yakunlandi";
    }

    if (
      challenge.winnerId ===
      currentUserId
    ) {
      return "Siz g'olib bo'ldingiz!";
    }

    return `${
      challenge.winner?.fullName ??
      otherUser.fullName
    } g'olib bo'ldi`;
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* ================= COURSE IMAGE ================= */}

      <div className="relative h-36 overflow-hidden bg-slate-100">
        {challenge.course.imageUrl ? (
          <img
            src={challenge.course.imageUrl}
            alt={challenge.course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Swords className="h-12 w-12 text-slate-400" />
          </div>
        )}

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Status */}

        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-5">
        {/* Course */}

        <h3 className="line-clamp-1 text-lg font-semibold text-[var(--color-text)]">
          {challenge.course.title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Kurs bo'yicha challenge
        </p>

        {/* ================= PLAYERS ================= */}

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* ME */}

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600 ring-2 ring-blue-200">
              {myUser.avatarUrl ? (
                <img
                  src={myUser.avatarUrl}
                  alt={myUser.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(myUser.fullName)
              )}
            </div>

            <p className="mt-2 truncate text-sm font-semibold text-slate-800">
              Siz
            </p>

            <p className="text-2xl font-bold text-blue-600">
              {myScore}%
            </p>
          </div>

          {/* VS */}

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
            <span className="text-sm font-bold text-slate-500">
              VS
            </span>
          </div>

          {/* OPPONENT */}

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-bold text-slate-600 ring-2 ring-slate-200">
              {otherUser.avatarUrl ? (
                <img
                  src={otherUser.avatarUrl}
                  alt={otherUser.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(otherUser.fullName)
              )}
            </div>

            <p className="mt-2 truncate text-sm font-semibold text-slate-800">
              {otherUser.fullName}
            </p>

            <p className="text-2xl font-bold text-slate-700">
              {opponentScore}%
            </p>
          </div>
        </div>

        {/* ================= MY PROGRESS ================= */}

        {(isAccepted || isCompleted) && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Sizning progressingiz
              </span>

              <span className="font-semibold text-blue-600">
                {myScore}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    Math.max(myScore, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* ================= COMPLETION INFO ================= */}

        {isCompleted && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Challenge natijasi
            </p>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">
                  Siz
                </span>

                <span className="text-right font-medium text-slate-700">
                  {formatDate(
                    myCompletedAt
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="truncate text-slate-500">
                  {otherUser.fullName}
                </span>

                <span className="text-right font-medium text-slate-700">
                  {formatDate(
                    opponentCompletedAt
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= WINNER ================= */}

        {isCompleted && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-yellow-50 p-4 text-center text-sm font-semibold text-yellow-800">
            <Trophy
              size={20}
              className="shrink-0"
            />

            <span>
              {getWinnerMessage()}
            </span>
          </div>
        )}

        {/* ================= ACCEPTED ================= */}

        {isAccepted && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/player/${challenge.courseId}`
              )
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Play size={18} />

            Kursni davom ettirish
          </button>
        )}

        {/* ================= PENDING - OPPONENT ================= */}

        {isPending && isOpponent && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={
                isAccepting ||
                isDeclining
              }
              onClick={() =>
                onAccept(challenge.id)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={18} />

              Qabul qilish
            </button>

            <button
              type="button"
              disabled={
                isAccepting ||
                isDeclining
              }
              onClick={() =>
                onDecline(challenge.id)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />

              Rad etish
            </button>
          </div>
        )}

        {/* ================= PENDING - CHALLENGER ================= */}

        {isPending && isChallenger && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={() =>
              onDelete(challenge.id)
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={18} />

            {isDeleting
              ? "Bekor qilinmoqda..."
              : "Challenge-ni bekor qilish"}
          </button>
        )}

        {/* ================= DECLINED ================= */}

        {isDeclined && (
          <div className="mt-5 rounded-xl bg-slate-100 p-3 text-center text-sm text-slate-600">
            Challenge rad etilgan.
          </div>
        )}
      </div>
    </article>
  );
}