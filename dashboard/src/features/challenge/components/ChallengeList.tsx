import { Swords } from "lucide-react";

import type {
  Challenge,
} from "../types/challenge.types";

import ChallengeCard from "./ChallengeCard";

interface ChallengeListProps {
  challenges: Challenge[];

  currentUserId?: string;

  isLoading?: boolean;

  onAccept: (
    challengeId: string
  ) => void;

  onDecline: (
    challengeId: string
  ) => void;

  onDelete: (
    challengeId: string
  ) => void;

  acceptingId?: string;
  decliningId?: string;
  deletingId?: string;
}

export default function ChallengeList({
  challenges,
  currentUserId,
  isLoading,
  onAccept,
  onDecline,
  onDelete,
  acceptingId,
  decliningId,
  deletingId,
}: ChallengeListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Swords className="h-8 w-8 text-blue-600" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          Hali challenge yo'q
        </h2>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Boshqa foydalanuvchi bilan kurs
          bo'yicha raqobat boshlang.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {challenges.map(
        (challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            currentUserId={currentUserId}
            isAccepting={
              acceptingId === challenge.id
            }
            isDeclining={
              decliningId === challenge.id
            }
            isDeleting={
              deletingId === challenge.id
            }
            onAccept={onAccept}
            onDecline={onDecline}
            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
}