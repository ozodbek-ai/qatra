import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui";

import { useQuiz } from "../hooks/useQuiz";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";

import QuestionCard from "../components/QuestionCard";
import QuizResult from "../components/QuizResult";

import type { SubmitAnswer } from "../types/quiz";

export default function QuizPage() {
  const { quizId } = useParams();

  const {
    data: quiz,
    isLoading,
  } = useQuiz(quizId ?? "");

  const submitQuiz =
    useSubmitQuiz(quizId ?? "");

  const [answers, setAnswers] =
    useState<SubmitAnswer[]>([]);

  /* =========================
     LOADING
  ========================= */

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

  /* =========================
     QUIZ NOT FOUND
  ========================= */

  if (!quiz) {
    return (
      <main className="min-h-full bg-slate-100 text-slate-900">
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <p className="text-red-600">
            Quiz topilmadi.
          </p>
        </div>
      </main>
    );
  }

  /* =========================
     QUIZ RESULT
  ========================= */

  if (submitQuiz.data) {
    return (
      <main className="min-h-full bg-slate-100 text-slate-900">
        <div className="mx-auto max-w-3xl p-6 lg:p-8">
          <QuizResult
            score={submitQuiz.data.score}
            total={submitQuiz.data.total}
            percentage={
              submitQuiz.data.percentage
            }
            passed={
              submitQuiz.data.passed
            }
            onRetry={() => {
              submitQuiz.reset();
              setAnswers([]);
            }}
          />
        </div>
      </main>
    );
  }

  /* =========================
     SELECT ANSWER
  ========================= */

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
      const existing = prev.find(
        (item) =>
          item.questionId ===
          questionId
      );

      /* SINGLE */
      if (question.type === "SINGLE") {
        return [
          ...prev.filter(
            (item) =>
              item.questionId !==
              questionId
          ),
          {
            questionId,
            optionIds: [optionId],
          },
        ];
      }

      /* MULTIPLE */

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

      /* Barcha variantlar olib tashlandi */
      if (newOptionIds.length === 0) {
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
          optionIds: newOptionIds,
        },
      ];
    });
  };

  /* =========================
     CHECK ANSWERS
  ========================= */

  const isAllAnswered =
    quiz.questions.every(
      (question) => {
        const answer = answers.find(
          (item) =>
            item.questionId ===
            question.id
        );

        return (
          answer !== undefined &&
          answer.optionIds.length > 0
        );
      }
    );

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = () => {
    if (
      !isAllAnswered ||
      submitQuiz.isPending
    ) {
      return;
    }

    submitQuiz.mutate(answers);
  };

  /* =========================
     PAGE
  ========================= */

  return (
    <main className="min-h-full bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">

        {/* ================= HEADER ================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            {quiz.title || "Quiz"}
          </h1>

          {quiz.description && (
            <p className="mt-2 text-slate-600">
              {quiz.description}
            </p>
          )}

          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {quiz.questions.length} ta savol
          </div>
        </section>

        {/* ================= QUESTIONS ================= */}

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
                  key={question.id}
                  question={question}
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

        {/* ================= SUBMIT ================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Javob berilgan:
            </span>

            <span className="text-sm font-bold text-slate-900">
              {answers.length} /{" "}
              {quiz.questions.length}
            </span>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
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
              Quizni yakunlash uchun barcha
              savollarga javob bering.
            </p>
          )}

        </section>

      </div>
    </main>
  );
}