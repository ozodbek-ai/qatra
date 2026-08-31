import type { Review } from "../types/course";

interface Props {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

function renderStars(rating: number) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(rating)
              ? "text-yellow-400"
              : "text-slate-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CourseReviews({
  reviews,
  averageRating,
  totalReviews,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Studentlar fikri
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ushbu kurs haqida studentlar
            qoldirgan fikrlar.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-5 py-4 text-center">
          <div className="text-3xl font-bold text-slate-900">
            {averageRating.toFixed(1)}
          </div>

          <div className="mt-1">
            {renderStars(averageRating)}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {totalReviews} ta baho
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <p className="text-slate-500">
            Hozircha hech qanday sharh
            qoldirilmagan.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start gap-4">
                {review.user.avatarUrl ? (
                  <img
                    src={review.user.avatarUrl}
                    alt={review.user.fullName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">
                    {review.user.fullName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {review.user.fullName}
                    </h3>

                    {renderStars(
                      review.rating
                    )}
                  </div>

                  {review.comment && (
                    <p className="mt-3 leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}