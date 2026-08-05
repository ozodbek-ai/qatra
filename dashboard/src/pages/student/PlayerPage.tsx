import { useParams } from "react-router-dom";

import { usePlayer } from "@/features/player/hooks/usePlayer";

import ProgressBar from "@/features/player/components/ProgressBar";
import PlayerSidebar from "@/features/player/components/PlayerSidebar";
import VideoPlayer from "@/features/player/components/VideoPlayer";
import CompleteLessonButton from "@/features/player/components/CompleteLessonButton";

export default function PlayerPage() {
  const { courseId } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = usePlayer(courseId ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Player yuklanmadi.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-3xl font-bold">
          {data.course.title}
        </h1>

        <ProgressBar
          progress={data.progress}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <VideoPlayer
  title={
    data.nextLesson?.title ??
    "Kurs tugallangan"
  }
  videoUrl={data.nextLesson?.videoUrl}
/>
            {data.nextLesson && (
  <CompleteLessonButton
    lessonId={data.nextLesson.id}
    courseId={data.course.id}
  />
)}
          </div>

          <PlayerSidebar
            lessons={data.lessons}
          />
        </div>
      </div>
    </main>
  );
}