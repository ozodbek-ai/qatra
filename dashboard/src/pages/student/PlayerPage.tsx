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

        <div>
          <h1 className="text-3xl font-bold">
            {data.course.title}
          </h1>

          <p className="mt-1 text-slate-500">
            Kurs darslarini davom ettiring.
          </p>
        </div>

        <ProgressBar
          progress={data.progress}
        />

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="space-y-6 lg:col-span-2">

            {selectedLesson ? (
              <>
                <VideoPlayer
                  title={selectedLesson.title}
                  videoUrl={
                    selectedLesson.videoUrl
                  }
                />

                {selectedLesson.quiz ? (
                  <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="text-xl font-bold">
                      📝 Ushbu dars uchun quiz mavjud
                    </h2>

                    <p className="mt-2 text-slate-500">
                      Darsni yakunlash uchun avval
                      quizni muvaffaqiyatli topshiring.
                    </p>

                    <a
                      href={`/quiz/${selectedLesson.quiz.id}`}
                      className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                      Quizni boshlash
                    </a>
                  </div>
                ) : (
                  !selectedLesson.completed && (
                    <CompleteLessonButton
                      lessonId={
                        selectedLesson.id
                      }
                      courseId={data.course.id}
                    />
                  )
                )}

                {selectedLesson.completed && (
                  <div className="rounded-xl bg-green-50 p-4 text-green-700">
                    ✅ Bu dars yakunlangan.
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-xl font-bold">
                  Kurs yakunlangan 🎉
                </h2>

                <p className="mt-2 text-slate-500">
                  Barcha darslarni muvaffaqiyatli
                  yakunladingiz.
                </p>
              </div>
            )}

          </div>

          <PlayerSidebar
            lessons={data.lessons}
            selectedLessonId={
              selectedLesson?.id
            }
            onSelectLesson={
              setSelectedLesson
            }
          />

        </div>
      </div>
    </main>
  );
}