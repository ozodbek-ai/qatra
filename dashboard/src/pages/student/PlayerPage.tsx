import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { usePlayer } from "@/features/player/hooks/usePlayer";
import type { PlayerLesson } from "@/features/player/types/player";

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

  const [selectedLesson, setSelectedLesson] =
    useState<PlayerLesson | null>(null);

  useEffect(() => {
    if (!data) return;

    setSelectedLesson(
      data.nextLesson ?? data.lessons[0] ?? null
    );
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-slate-600">
          Yuklanmoqda...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-red-600">
        Player yuklanmadi.
      </div>
    );
  }

  return (
    <main className="min-h-full bg-slate-100 text-slate-900 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Course title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {data.course.title}
          </h1>

          <p className="mt-1 text-slate-600">
            Kurs darslarini davom ettiring.
          </p>
        </div>

        {/* Progress */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <ProgressBar
            progress={data.progress}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">

            {selectedLesson ? (
              <>
                {/* Video */}
                <div className="overflow-hidden rounded-xl bg-black shadow">
                  <VideoPlayer
                    title={selectedLesson.title}
                    videoUrl={
                      selectedLesson.videoUrl
                    }
                  />
                </div>

                {/* Lesson title */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedLesson.order}.{" "}
                    {selectedLesson.title}
                  </h2>

                  {selectedLesson.description && (
                    <p className="mt-3 leading-7 text-slate-600">
                      {selectedLesson.description}
                    </p>
                  )}
                </div>

                {/* Quiz */}
                {selectedLesson.quiz ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                      📝 Ushbu dars uchun quiz mavjud
                    </h2>

                    <p className="mt-2 text-slate-600">
                      Darsni yakunlash uchun avval
                      quizni muvaffaqiyatli topshiring.
                    </p>

                    <a
                      href={`/quiz/${selectedLesson.quiz.id}`}
                      className="mt-5 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                      Quizni boshlash
                    </a>
                  </div>
                ) : (
                  !selectedLesson.completed && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <CompleteLessonButton
                        lessonId={
                          selectedLesson.id
                        }
                        courseId={data.course.id}
                      />
                    </div>
                  )
                )}

                {/* Completed */}
                {selectedLesson.completed && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-700">
                    <p className="font-medium">
                      ✅ Bu dars yakunlangan.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Kurs yakunlangan 🎉
                </h2>

                <p className="mt-2 text-slate-600">
                  Barcha darslarni muvaffaqiyatli
                  yakunladingiz.
                </p>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <PlayerSidebar
              lessons={data.lessons}
              selectedLessonId={
                selectedLesson?.id
              }
              onSelectLesson={
                setSelectedLesson
              }
            />
          </aside>

        </div>
      </div>
    </main>
  );
}