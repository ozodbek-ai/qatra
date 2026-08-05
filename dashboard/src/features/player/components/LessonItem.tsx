import type { PlayerLesson } from "../types/player";

interface Props {
  lesson: PlayerLesson;
}

export default function LessonItem({
  lesson,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <h3 className="font-semibold">
          {lesson.order}. {lesson.title}
        </h3>

        <p className="text-sm text-slate-500">
          {lesson.duration} daqiqa
        </p>
      </div>

      <div>
        {lesson.completed ? "✅" : "▶"}
      </div>
    </div>
  );
}