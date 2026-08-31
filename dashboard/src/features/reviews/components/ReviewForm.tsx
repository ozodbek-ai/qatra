import { useState } from "react";

import { Button } from "@/components/ui";

import { useCreateReview } from "../hooks/useCreateReview";

interface Props {
  courseId: string;
}

export default function ReviewForm({
  courseId,
}: Props) {
  const mutation = useCreateReview();

  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (rating === 0) {
      return;
    }

    mutation.mutate(
      {
        courseId,
        rating,
        comment:
          comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">
        Kursni baholang
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Kurs haqidagi fikringizni bildiring.
      </p>

      {/* Rating */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Baho
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setRating(star)
                }
                className={`text-3xl transition ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-slate-300"
                } hover:scale-110`}
                aria-label={`${star} yulduz`}
              >
                ★
              </button>
            )
          )}
        </div>

        {rating === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            1 dan 5 gacha baho tanlang.
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mt-5">
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Izoh
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) =>
            setComment(
              event.target.value
            )
          }
          maxLength={1000}
          rows={5}
          placeholder="Kurs haqidagi fikringizni yozing..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {comment.length}/1000
        </p>
      </div>

      <Button
        type="submit"
        className="mt-5 w-full bg-blue-600 text-white hover:bg-blue-700"
        loading={mutation.isPending}
        disabled={
          rating === 0 ||
          mutation.isPending
        }
      >
        {mutation.isPending
          ? "Yuborilmoqda..."
          : "Bahoni yuborish"}
      </Button>
    </form>
  );
}