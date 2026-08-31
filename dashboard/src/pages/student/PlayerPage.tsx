import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { usePlayer } from "@/features/player/hooks/usePlayer";
import { useMarkLessonViewed } from "@/features/player/hooks/useMarkLessonViewed";

import type { PlayerLesson } from "@/features/player/types/player";
import { useUpdateLessonViewDuration } from "@/features/player/hooks/useUpdateLessonViewDuration";
import ProgressBar from "@/features/player/components/ProgressBar";
import PlayerSidebar from "@/features/player/components/PlayerSidebar";
import VideoPlayer from "@/features/player/components/VideoPlayer";
import CompleteLessonButton from "@/features/player/components/CompleteLessonButton";
import { useCompleteLesson } from "@/features/player/hooks/useCompleteLesson";


export default function PlayerPage() {
  const { courseId } = useParams();

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const requestedLessonId =
    searchParams.get("lesson");

  const {
    data,
    isLoading,
    isError,
  } = usePlayer(courseId ?? "");

const markLessonViewed =
  useMarkLessonViewed();

const completeLesson =
  useCompleteLesson(courseId);

const [
  selectedLesson,
  setSelectedLesson,
] = useState<PlayerLesson | null>(null);

const [
  lessonActivityId,
  setLessonActivityId,
] = useState<string | null>(null);

const updateLessonViewDuration =
  useUpdateLessonViewDuration();

const handleDurationUpdate =
  useCallback(
    (
      activityId: string,
      durationSeconds: number
    ) => {
      updateLessonViewDuration.mutate({
        activityId,
        durationSeconds,
      });
    },
    [updateLessonViewDuration]
  );

  /*
   * ==========================================
   * INITIAL LESSON
   * ==========================================
   *
   * Tartib:
   *
   * 1. URL'dagi ?lesson=...
   * 2. Backend nextLesson
   * 3. Birinchi tugallanmagan dars
   * 4. Birinchi dars
   */

useEffect(() => {
  if (!data) {
    return;
  }

  setSelectedLesson((current) => {
    /*
     * 1. URL orqali aniq dars so'ralgan bo'lsa,
     *    shu darsni ochamiz.
     *
     *    Masalan:
     *    /player/courseId?lesson=lessonId
     */
    if (requestedLessonId) {
      const requestedLesson =
        data.lessons.find(
          (lesson) =>
            lesson.id === requestedLessonId
        );

      if (requestedLesson) {
        return requestedLesson;
      }
    }

    /*
     * 2. Hozirgi dars mavjud bo'lsa,
     *    yangi ma'lumotdan uning yangilangan
     *    holatini olamiz.
     */
    if (current) {
      const updatedLesson =
        data.lessons.find(
          (lesson) =>
            lesson.id === current.id
        );

      /*
       * Hozirgi dars hali tugallanmagan bo'lsa,
       * shu darsda qolamiz.
       */
      if (
        updatedLesson &&
        !updatedLesson.completed
      ) {
        return updatedLesson;
      }

      /*
       * MUHIM:
       *
       * Agar oldingi dars hozir completed
       * bo'lib qolgan bo'lsa, demak:
       *
       * - student Complete bosgan
       * yoki
       * - quizni muvaffaqiyatli topshirgan.
       *
       * Shuning uchun keyingi darsni ochamiz.
       */
      if (
        updatedLesson?.completed &&
        data.nextLesson
      ) {
        return data.nextLesson;
      }
    }

    /*
     * 3. Backend bergan nextLesson.
     *
     * Bu quizdan keyin eng muhim qism.
     */
    if (data.nextLesson) {
      return data.nextLesson;
    }

    /*
     * 4. Backend nextLesson bermagan bo'lsa,
     *    birinchi tugallanmagan darsni olamiz.
     */
    const firstIncomplete =
      data.lessons.find(
        (lesson) =>
          !lesson.completed
      );

    if (firstIncomplete) {
      return firstIncomplete;
    }

    /*
     * 5. Barcha darslar tugagan bo'lsa.
     */
    return data.lessons[0] ?? null;
  });
}, [
  data,
  requestedLessonId,
]);

  /*
   * ==========================================
   * MARK LESSON AS VIEWED
   * ==========================================
   */

useEffect(() => {
  if (!selectedLesson) {
    setLessonActivityId(null);
    return;
  }

  setLessonActivityId(null);

  markLessonViewed.mutate(
    selectedLesson.id,
    {
      onSuccess: (result) => {
        setLessonActivityId(
          result.activityId
        );
      },
    }
  );
}, [selectedLesson?.id]);

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-slate-600">
          Kurs yuklanmoqda...
        </p>
      </main>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (isError || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-600">
            Player yuklanmadi.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/my-courses")
            }
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Mening kurslarimga qaytish
          </button>
        </div>
      </main>
    );
  }

  /*
 * ==========================================
 * COURSE COMPLETED
 * ==========================================
 *
 * Backend CourseCompletion mavjudligini
 * tekshiradi.
 *
 * CourseCompletion faqat:
 * - barcha lessonlar completed
 * - barcha quizlar passed
 *
 * bo'lgandan keyin yaratiladi.
 */

const isCourseCompleted =
  data.isCompleted;

  /*
   * ==========================================
   * CURRENT LESSON
   * ==========================================
   */

  const currentLesson =
    selectedLesson
      ? data.lessons.find(
          (lesson) =>
            lesson.id ===
            selectedLesson.id
        ) ?? selectedLesson
      : null;

  /*
   * ==========================================
   * CURRENT LESSON INDEX
   * ==========================================
   */

  const currentIndex =
    currentLesson
      ? data.lessons.findIndex(
          (lesson) =>
            lesson.id ===
            currentLesson.id
        )
      : -1;

  /*
   * ==========================================
   * NEXT LESSON
   * ==========================================
   *
   * Avval joriy darsdan keyingi
   * tugallanmagan darsni qidiramiz.
   *
   * Agar topilmasa backend bergan
   * nextLesson ishlatiladi.
   */

  const nextLesson =
    currentIndex >= 0
      ? data.lessons
          .slice(currentIndex + 1)
          .find(
            (lesson) =>
              !lesson.completed
          ) ??
        data.nextLesson ??
        null
      : data.nextLesson ?? null;

  /*
   * ==========================================
   * SELECT LESSON
   * ==========================================
   */

  const handleSelectLesson = (
    lesson: PlayerLesson
  ) => {
    setSelectedLesson(lesson);

    if (courseId) {
      navigate(
        `/player/${courseId}?lesson=${lesson.id}`,
        {
          replace: true,
        }
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  

  /*
   * ==========================================
   * NEXT LESSON
   * ==========================================
   */

  const handleNextLesson = () => {
    if (!nextLesson) {
      return;
    }

    handleSelectLesson(nextLesson);
  };

  /*
   * ==========================================
   * COURSE COMPLETED PAGE
   * ==========================================
   */

if (isCourseCompleted) {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            🎉
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Kursni muvaffaqiyatli tugatdingiz!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
  Tabriklaymiz! Siz kursdagi barcha
  darslarni va quizlarni muvaffaqiyatli
  yakunladingiz.
</p>

          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <ProgressBar progress={100} />
          </div>

          {data.completedAt && (
  <p className="mt-4 text-sm text-slate-500">
    Kurs yakunlangan sana:{" "}
    <span className="font-medium text-slate-700">
      {new Date(
        data.completedAt
      ).toLocaleDateString("uz-UZ")}
    </span>
  </p>
)}

          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="text-3xl">
              🏆
            </div>

            <h2 className="mt-2 text-xl font-bold text-blue-900">
              Sertifikatingiz tayyor!
            </h2>

            <p className="mt-1 text-sm text-blue-700">
              Kursni muvaffaqiyatli yakunlaganingiz
              uchun sertifikatingiz yaratildi.
            </p>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() =>
                navigate("/certificates")
              }
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              🏆 Sertifikatni ko‘rish
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/my-courses")
              }
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Mening kurslarim
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}

  /*
   * ==========================================
   * PLAYER PAGE
   * ==========================================
   */

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-6 text-slate-900 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}

        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/my-courses"
              )
            }
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Mening kurslarim
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            {data.course.title}
          </h1>

          <p className="mt-1 text-slate-600">
            Kurs darslarini davom ettiring.
          </p>
        </div>

        {/* Progress */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <ProgressBar
            progress={data.progress}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main content */}

          <div className="space-y-6 lg:col-span-2">

            {currentLesson ? (
              <>

                {/* Video */}

                <div className="overflow-hidden rounded-xl bg-black shadow">
                  <VideoPlayer
  title={currentLesson.title}
  videoUrl={currentLesson.videoUrl}
  activityId={lessonActivityId}
  onDurationUpdate={
    handleDurationUpdate
  }
  onEnded={() => {
    /*
     * Quizli dars video tugashi bilan
     * avtomatik completed qilinmaydi.
     *
     * Avval quiz topshirilishi kerak.
     */
    if (currentLesson.quiz) {
      return;
    }

    /*
     * Allaqachon completed bo'lgan
     * darsga qayta request yubormaymiz.
     */
    if (currentLesson.completed) {
      return;
    }

    completeLesson.mutate(
      currentLesson.id,
      {
        onSuccess: () => {
          /*
           * Player ma'lumotlarini yangilash
           * uchun keyingi darsga o'tamiz.
           */
          if (nextLesson) {
            handleSelectLesson(
              nextLesson
            );
          }
        },
      }
    );
  }}
/>
                </div>

                {/* Lesson information */}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        {currentLesson.order}-dars
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {
                          currentLesson.title
                        }
                      </h2>
                    </div>

                    {currentLesson.completed && (
                      <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        ✓ Yakunlangan
                      </span>
                    )}

                  </div>

                  {currentLesson.description && (
                    <p className="mt-4 leading-7 text-slate-600">
                      {
                        currentLesson.description
                      }
                    </p>
                  )}
                </div>

                {/* Quiz */}

                {currentLesson.quiz &&
                  !currentLesson.completed && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

                      <h2 className="text-xl font-bold text-slate-900">
                        📝 Ushbu dars uchun quiz mavjud
                      </h2>

                      <p className="mt-2 text-slate-600">
                        Darsni yakunlash uchun
                        avval quizni muvaffaqiyatli
                        topshirishingiz kerak.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/quiz/${currentLesson.quiz!.id}`
                          )
                        }
                        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Quizni boshlash
                      </button>

                    </div>
                  )}

                {/* Complete lesson */}

                {!currentLesson.completed &&
                  !currentLesson.quiz && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                      <CompleteLessonButton
                        lessonId={
                          currentLesson.id
                        }
                        courseId={
                          data.course.id
                        }
                        onSuccess={() => {
                          /*
                           * Lesson muvaffaqiyatli
                           * tugatilgandan keyin
                           * keyingi tugallanmagan
                           * darsga o'tamiz.
                           */
                          if (nextLesson) {
                            handleSelectLesson(
                              nextLesson
                            );
                          }
                        }}
                      />

                    </div>
                  )}

                {/* Completed lesson */}

                {currentLesson.completed && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                    <p className="font-semibold text-green-800">
                      ✓ Bu dars yakunlangan
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      Keyingi darsga o'tishingiz mumkin.
                    </p>
                  </div>
                )}

                {/* Next lesson */}

                {currentLesson.completed &&
                  nextLesson && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>
                          <p className="text-sm text-slate-500">
                            Keyingi dars
                          </p>

                          <h3 className="mt-1 text-lg font-bold text-slate-900">
                            {nextLesson.order}.{" "}
                            {
                              nextLesson.title
                            }
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={
                            handleNextLesson
                          }
                          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                          Keyingi dars →
                        </button>

                      </div>

                    </div>
                  )}

              </>
            ) : (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold">
                  Dars mavjud emas
                </h2>

                <p className="mt-2 text-slate-600">
                  Ushbu kursda hozircha
                  darslar mavjud emas.
                </p>
              </div>
            )}

          </div>

          {/* Sidebar */}

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <PlayerSidebar
                lessons={data.lessons}
                selectedLessonId={
                  currentLesson?.id
                }
                onSelectLesson={
                  handleSelectLesson
                }
              />
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}