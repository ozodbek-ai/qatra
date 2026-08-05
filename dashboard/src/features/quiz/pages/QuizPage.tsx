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
      return <div>Yuklanmoqda...</div>;
    }
    
    if (!quiz) {
      return <div>Quiz topilmadi.</div>;
    }
    if (submitQuiz.data) {
  return (
    <QuizResult
      score={submitQuiz.data.score}
      total={submitQuiz.data.total}
      percentage={submitQuiz.data.percentage}
      passed={submitQuiz.data.passed}
    />
  );
}


  const handleSelect = (
    questionId: string,
    optionId: string
  ) => {
    setAnswers((prev) => {
      const filtered = prev.filter(
        (item) =>
          item.questionId !== questionId
      );

      return [
        ...filtered,
        {
          questionId,
          optionId,
        },
      ];
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-10">
      <h1 className="text-3xl font-bold">
        {quiz.title}
      </h1>

      {quiz.questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          selectedOption={
            answers.find(
              (a) =>
                a.questionId === question.id
            )?.optionId
          }
          onSelect={handleSelect}
        />
      ))}

      <Button
  loading={submitQuiz.isPending}
  disabled={
    answers.length !==
    quiz.questions.length
  }
  onClick={() =>
    submitQuiz.mutate(answers)
  }
>
  Quizni yakunlash
</Button>
    </div>
  );
}