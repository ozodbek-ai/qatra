import { Link } from "react-router-dom";

import type { MyCourse } from "../types/course";

interface Props {
  course: MyCourse;
}

export default function CourseCard({
  course,
}: Props) {
  const {
    title,
    description,
    imageUrl,
    level,
    totalLessons,
    completedLessons,
    progress,
  } = course.course;

  const status =
    progress === 100
      ? "Yakunlangan"
      : progress > 0
        ? "Davom etmoqda"
        : "Boshlanmagan";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Course image */}
      <div className="aspect-video overflow-hidden bg-slate-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
            loading="lazy"
            onError={(event) => {
              const image =
                event.currentTarget;

              image.style.display = "none";

              const fallback =
                image.parentElement?.querySelector(
                  "[data-image-fallback]"
                ) as HTMLElement | null;

              if (fallback) {
                fallback.style.display =
                  "flex";
              }
            }}
          />
        ) : null}

        <div
          data-image-fallback
          className={`h-full w-full items-center justify-center bg-slate-100 ${
            imageUrl
              ? "hidden"
              : "flex"
          }`}
        >
          <div className="text-center">
            <div className="mb-2 text-3xl">
              📚
            </div>

            <span className="text-sm text-slate-400">
              Kurs rasmi mavjud emas
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status + level */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold",
              progress === 100
                ? "bg-green-100 text-green-700"
                : progress > 0
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {status}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {level}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        {/* Lessons */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Darslar
          </span>

          <span className="font-semibold text-slate-700">
            {completedLessons} / {totalLessons}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Kurs progressi
            </span>

            <span className="text-sm font-bold text-blue-600">
              {progress}%
            </span>
          </div>
        </div>

        {/* Action */}
        <Link
          to={`/player/${course.course.id}`}
          className="mt-6 block w-full rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          {progress === 100
            ? "Kursni ko'rish"
            : progress > 0
              ? "Davom ettirish"
              : "Kursni boshlash"}
        </Link>
      </div>
    </div>
  );
}