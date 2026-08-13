import { Badge } from "@/components/ui";

import { useAdminReviews } from "../hooks/useAdminReviews";

function renderStars(rating: number) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= rating
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

export default function AdminReviewsPage() {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useAdminReviews();

  if (isLoading) {
    return (
      <div className="p-6">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Sharhlarni yuklab bo'lmadi.
      </div>
    );
  }

  return (
    <main className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Sharhlar
        </h1>

        <p className="mt-1 text-[var(--color-muted)]">
          Studentlar tomonidan qoldirilgan
          kurs baholari va fikrlar.
        </p>
      </div>

      {reviews?.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-10 text-center">
          <h2 className="text-xl font-semibold">
            Hozircha sharhlar mavjud emas
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            Studentlar kurslarni tugatib,
            sharh qoldirgandan keyin ular shu
            yerda ko'rinadi.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {reviews?.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h2 className="font-semibold">
                    {review.user.fullName}
                  </h2>

                  <p className="text-sm text-[var(--color-muted)]">
                    {review.user.email}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  {renderStars(review.rating)}

                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <Badge variant="info">
                  {review.course.title}
                </Badge>
              </div>

              {review.comment && (
                <p className="mt-4 rounded-lg bg-[var(--color-background)] p-4 text-sm leading-6">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}