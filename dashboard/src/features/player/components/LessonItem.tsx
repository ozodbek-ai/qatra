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

  return (
    <div
      className={[
        "rounded-xl border p-4 transition",
        selected
          ? "border-blue-500 bg-blue-50"
          : "hover:bg-slate-50",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onSelect(lesson)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">
              {lesson.order}. {lesson.title}
            </p>

            <p className="text-sm text-slate-500">
              {lesson.duration} daqiqa
            </p>
          </div>

          <div>
            {lesson.completed ? "✅" : "▶"}
          </div>
        </div>
      </button>

      {lesson.quiz ? (
  <button
    type="button"
    onClick={() =>
      navigate(`/quiz/${lesson.quiz!.id}`)
    }
    className="mt-3 w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
  >
    📝 Quizni boshlash
  </button>
) : null}
    </div>
  );
}