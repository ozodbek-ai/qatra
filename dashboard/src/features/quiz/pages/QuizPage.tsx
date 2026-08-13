import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui";

import { useQuiz } from "../hooks/useQuiz";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";

import QuestionCard from "../components/QuestionCard";

import type { SubmitAnswer } from "../types/quiz";
import QuizResult from "../components/QuizResult";

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

  if (isLoading) {
    return (
      <div className="p-6">
        Yuklanmoqda...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6">
        Quiz topilmadi.
      </div>
    );
  }

  if (submitQuiz.data) {
  return (
    <div className="mx-auto max-w-3xl p-6">
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
  );
}

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

      // SINGLE — faqat bitta javob
      if (question.type === "SINGLE") {
        const filtered = prev.filter(
          (item) =>
            item.questionId !==
            questionId
        );

        return [
          ...filtered,
          {
            questionId,
            optionIds: [optionId],
          },
        ];
      }

      // MULTIPLE — bir nechta javob
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

      // Barcha tanlovlar olib tashlandi
      if (newOptionIds.length === 0) {
        return prev.filter(
          (item) =>
            item.questionId !==
            questionId
        );
      }

      const filtered = prev.filter(
        (item) =>
          item.questionId !==
          questionId
      );

      return [
        ...filtered,
        {
          questionId,
          optionIds: newOptionIds,
        },
      ];
    });
  };

  const isAllAnswered =
    quiz.questions.every(
      (question) => {
        const answer = answers.find(
          (item) =>
            item.questionId ===
            question.id
        );

        return Boolean(
          answer &&
            answer.optionIds.length > 0
        );
      }
    );

  const handleSubmit = () => {
    if (!isAllAnswered) {
      return;
    }

    submitQuiz.mutate(answers);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          {quiz.title || "Quiz"}
        </h1>

        {quiz.description && (
          <p className="mt-2 text-[var(--color-muted)]">
            {quiz.description}
          </p>
        )}
      </div>

      <div className="space-y-4">
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
      </div>

      <Button
        type="button"
        className="w-full"
        loading={
          submitQuiz.isPending
        }
        disabled={
          !isAllAnswered ||
          submitQuiz.isPending
        }
        onClick={handleSubmit}
      >
        Quizni yakunlash
      </Button>
    </div>
  );
}