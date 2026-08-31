import { useNavigate } from "react-router-dom";

import type { PlayerLesson } from "../types/player";

interface Props {
  lesson: PlayerLesson;
  selected?: boolean;
  onSelect: (lesson: PlayerLesson) => void;
}

export default function LessonItem({
  lesson,
  selected = false,
  onSelect,
}: Props) {
  const navigate = useNavigate();

  const handleQuiz = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (!lesson.quiz) {
      return;
    }

    navigate(
      `/quiz/${lesson.quiz.id}`
    );
  };

  return (
    <div
      className={[
        "rounded-xl border-2 p-4 transition-all duration-200",
        selected
          ? "border-blue-600 bg-blue-50 shadow-sm"
          : lesson.completed
            ? "border-green-200 bg-green-50/50"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() =>
          onSelect(lesson)
        }
        className="w-full text-left"
      >
        <div className="flex items-center gap-3">

          {/* Lesson icon */}
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              selected
                ? "bg-blue-600 text-white"
                : lesson.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {lesson.completed
              ? "✓"
              : lesson.order}
          </div>

          {/* Lesson information */}
          <div className="min-w-0 flex-1">
            <p
              className={[
                "truncate font-semibold",
                selected
                  ? "text-blue-900"
                  : "text-slate-900",
              ].join(" ")}
            >
              {lesson.order}.{" "}
              {lesson.title}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {lesson.duration} daqiqa
            </p>
          </div>

          {/* Status */}
          <div className="shrink-0">
            {lesson.completed ? (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                Tugallangan
              </span>
            ) : selected ? (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Hozir
              </span>
            ) : (
              <span className="text-slate-400">
                ▶
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Quiz */}
      {lesson.quiz && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          {lesson.completed ? (
            <div className="flex items-center justify-between rounded-lg bg-green-100 px-3 py-2">
              <span className="text-sm font-medium text-green-700">
                📝 Quiz topshirilgan
              </span>

              <button
                type="button"
                onClick={handleQuiz}
                className="text-sm font-semibold text-green-700 underline hover:text-green-800"
              >
                Ko‘rish
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuiz}
              className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
            >
              📝 Quizni boshlash
            </button>
          )}
        </div>
      )}
    </div>
  );
}