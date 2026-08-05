import type { PlayerLesson } from "../types/player";

import LessonItem from "./LessonItem";

interface Props {
  lessons: PlayerLesson[];
}

export default function PlayerSidebar({
  lessons,
}: Props) {
  return (
    <aside className="space-y-3 rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold">
        Darslar
      </h2>

      {lessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
        />
      ))}
    </aside>
  );
}