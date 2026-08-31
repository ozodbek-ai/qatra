import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui";

import { useQuiz } from "../hooks/useQuiz";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";

import QuestionCard from "../components/QuestionCard";
import QuizResult from "../components/QuizResult";

import type { SubmitAnswer } from "../types/quiz";

export default function QuizPage() {
  const { quizId } = useParams();

  const navigate =
    useNavigate();

  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuiz(
    quizId ?? ""
  );

  const submitQuiz =
    useSubmitQuiz(
      quizId ?? "",
      quiz?.lesson?.course.id
    );

  const [answers, setAnswers] =
    useState<SubmitAnswer[]>([]);

  /*
   * ==========================================
   * OLD PASSED QUIZ
   * ==========================================
   *
   * Agar foydalanuvchi bu quizni oldin
   * muvaffaqiyatli topshirgan bo'lsa,
   * quiz savollarini ko'rsatmaymiz.
   */

  useEffect(() => {
    if (!quiz?.attempt?.passed) {
      return;
    }

    toast.info(
      "Siz bu quizni allaqachon ishlab bo'lgansiz."
    );

    const courseId =
      quiz.lesson?.course.id;

    if (courseId) {
      navigate(
        `/player/${courseId}`,
        {
          replace: true,
        }
      );
    } else {
      navigate(
        "/my-courses",
        {
          replace: true,
        }
      );
    }
  }, [
    quiz?.attempt?.passed,
    quiz?.lesson?.course.id,
    navigate,
  ]);

  /*
   * ==========================================
   * SUBMITTED QUIZ RESULT
   * ==========================================
   *
   * Quiz yangi topshirilganidan keyin:
   *
   * passed = true
   *   -> qisqa vaqt natijani ko'rsatamiz
   *   -> keyin playerga qaytamiz
   *
   * passed = false
   *   -> natija sahifasida qolamiz
   *   -> qayta ishlash mumkin
   */

  useEffect(() => {
    if (!submitQuiz.data) {
      return;
    }

    if (!submitQuiz.data.passed) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        const courseId =
          quiz?.lesson?.course.id;

        if (courseId) {
          navigate(
            `/player/${courseId}`,
            {
              replace: true,
            }
          );
        } else {
          navigate(
            "/my-courses",
            {
              replace: true,
            }
          );
        }
      }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    submitQuiz.data,
    quiz?.lesson?.course.id,
    navigate,
  ]);

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (isLoading) {
    return (
      <main className="min-h-full bg-slate-100 text-slate-900">
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <p className="text-slate-600">
            Yuklanmoqda...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (isError || !quiz) {
    return (
      <main className="min-h-full bg-slate-100 text-slate-900">
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">

          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <p className="font-medium text-red-600">
              Quiz topilmadi yoki yuklashda xatolik yuz berdi.
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={() =>
                navigate(
                  "/my-courses"
                )
              }
            >
              Mening kurslarimga qaytish
            </Button>

          </div>

        </div>
      </main>
    );
  }

  /*
   * ==========================================
   * OLD PASSED QUIZ REDIRECT STATE
   * ==========================================
   */

  if (quiz.attempt?.passed) {
    return (
      <main className="min-h-full bg-slate-100 text-slate-900">
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✓
            </div>

            <p className="mt-4 font-medium text-slate-700">
              Bu quizni avval muvaffaqiyatli topshirgansiz.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Kursga qaytarilmoqdasiz...
            </p>

          </div>

        </div>
      </main>
    );
  }

  /*
   * ==========================================
   * QUIZ RESULT
   * ==========================================
   */

  if (submitQuiz.data) {
    const passed =
      submitQuiz.data.passed;

    return (
      <main className="min-h-full bg-slate-100 text-slate-900">

        <div className="mx-auto max-w-3xl p-6 lg:p-8">

          <QuizResult
            score={
              submitQuiz.data.score
            }
            total={
              submitQuiz.data.total
            }
            percentage={
              submitQuiz.data.percentage
            }
            passed={passed}
            courseId={
              quiz.lesson?.course.id
            }
            onRetry={() => {
              /*
               * Passed quizni qayta ishlash
               * mumkin emas.
               */
              if (passed) {
                return;
              }

              submitQuiz.reset();
              setAnswers([]);
            }}
          />

          {passed && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">

              <p className="font-semibold text-green-800">
                Quiz muvaffaqiyatli yakunlandi!
              </p>

              <p className="mt-1 text-sm text-green-700">
                Kursga qaytarilmoqdasiz...
              </p>

              <Button
                type="button"
                className="mt-4"
                onClick={() => {
                  const courseId =
                    quiz.lesson?.course.id;

                  if (courseId) {
                    navigate(
                      `/player/${courseId}`,
                      {
                        replace: true,
                      }
                    );
                  } else {
                    navigate(
                      "/my-courses",
                      {
                        replace: true,
                      }
                    );
                  }
                }}
              >
                Kursga qaytish
              </Button>

            </div>
          )}

          {!passed && (
            <div className="mt-6 flex justify-center">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    "/my-courses"
                  )
                }
              >
                Mening kurslarimga qaytish
              </Button>

            </div>
          )}

        </div>

      </main>
    );
  }

  /*
   * ==========================================
   * SELECT ANSWER
   * ==========================================
   */

  const handleSelect = (
    questionId: string,
    optionId: string
  ) => {
    const question =
      quiz.questions.find(
        (item) =>
          item.id === questionId
      );

    if (!question) {
      return;
    }

    setAnswers((prev) => {
      const existing =
        prev.find(
          (item) =>
            item.questionId ===
            questionId
        );

      /*
       * SINGLE
       */

      if (
        question.type === "SINGLE"
      ) {
        return [
          ...prev.filter(
            (item) =>
              item.questionId !==
              questionId
          ),
          {
            questionId,
            optionIds: [
              optionId,
            ],
          },
        ];
      }

      /*
       * MULTIPLE
       */

      const currentOptionIds =
        existing?.optionIds ?? [];

      const alreadySelected =
        currentOptionIds.includes(
          optionId
        );

      const newOptionIds =
        alreadySelected
          ? currentOptionIds.filter(
              (id) =>
                id !== optionId
            )
          : [
              ...currentOptionIds,
              optionId,
            ];

      /*
       * Barcha variantlar
       * olib tashlandi.
       */

      if (
        newOptionIds.length === 0
      ) {
        return prev.filter(
          (item) =>
            item.questionId !==
            questionId
        );
      }

      return [
        ...prev.filter(
          (item) =>
            item.questionId !==
            questionId
        ),
        {
          questionId,
          optionIds:
            newOptionIds,
        },
      ];
    });
  };

  /*
   * ==========================================
   * CHECK ANSWERS
   * ==========================================
   */

  const isAllAnswered =
    quiz.questions.every(
      (question) => {
        const answer =
          answers.find(
            (item) =>
              item.questionId ===
              question.id
          );

        return (
          answer !== undefined &&
          answer.optionIds.length >
            0
        );
      }
    );

  /*
   * ==========================================
   * SUBMIT
   * ==========================================
   */

  const handleSubmit = () => {
    if (
      !isAllAnswered ||
      submitQuiz.isPending
    ) {
      return;
    }

    submitQuiz.mutate(
      answers
    );
  };

  /*
   * ==========================================
   * PAGE
   * ==========================================
   */

  return (
    <main className="min-h-full bg-slate-100 text-slate-900">

      <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">

        {/* HEADER */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {quiz.title ||
                  "Quiz"}
              </h1>

              {quiz.description && (
                <p className="mt-2 text-slate-600">
                  {
                    quiz.description
                  }
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const courseId =
                  quiz.lesson?.course.id;

                if (courseId) {
                  navigate(
                    `/player/${courseId}`
                  );
                } else {
                  navigate(
                    "/my-courses"
                  );
                }
              }}
            >
              ← Orqaga
            </Button>

          </div>

          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {quiz.questions.length} ta savol
          </div>

        </section>

        {/* QUESTIONS */}

        <section className="space-y-5">

          {quiz.questions.map(
            (question) => {
              const selectedOptions =
                answers.find(
                  (answer) =>
                    answer.questionId ===
                    question.id
                )?.optionIds ?? [];

              return (
                <QuestionCard
                  key={
                    question.id
                  }
                  question={
                    question
                  }
                  selectedOptions={
                    selectedOptions
                  }
                  onSelect={
                    handleSelect
                  }
                />
              );
            }
          )}

        </section>

        {/* SUBMIT */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <span className="text-sm font-medium text-slate-600">
              Javob berilgan:
            </span>

            <span className="text-sm font-bold text-slate-900">
              {answers.length} /{" "}
              {
                quiz.questions
                  .length
              }
            </span>

          </div>

          <Button
            type="button"
            onClick={
              handleSubmit
            }
            loading={
              submitQuiz.isPending
            }
            disabled={
              !isAllAnswered ||
              submitQuiz.isPending
            }
            className={[
              "w-full",
              "min-h-12",
              "rounded-xl",
              "font-semibold",
              "text-base",
              "transition-colors",
              isAllAnswered
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-200 text-slate-500",
            ].join(" ")}
          >
            {submitQuiz.isPending
              ? "Tekshirilmoqda..."
              : isAllAnswered
                ? "Quizni yakunlash"
                : "Barcha savollarga javob bering"}
          </Button>

          {!isAllAnswered && (
            <p className="mt-3 text-center text-sm text-slate-500">
              Quizni yakunlash
              uchun barcha
              savollarga javob
              bering.
            </p>
          )}

        </section>

      </div>

    </main>
  );
}