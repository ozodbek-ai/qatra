import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { useAdminQuiz } from "../hooks/useAdminQuiz";
import QuestionForm from "../components/QuestionForm";

export default function AdminQuizPage() {
  const {
    courseId,
    quizId,
  } = useParams();

  const navigate = useNavigate();

  const [showQuestionForm, setShowQuestionForm] =
    useState(false);

  const {
    data: quiz,
    isLoading,
    isError,
  } = useAdminQuiz(quizId ?? "");

  if (isLoading) {
    return (
      <div className="p-6">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="p-6">
        Quiz topilmadi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {quiz.title || "Quiz"}
          </h1>

          <p className="text-[var(--color-muted)]">
            Quiz savollarini boshqarish.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/admin/courses/${courseId}/lessons`
              )
            }
          >
            Orqaga
          </Button>

          <Button
            onClick={() =>
              setShowQuestionForm(
                (prev) => !prev
              )
            }
          >
            {showQuestionForm
              ? "Formani yopish"
              : "+ Yangi savol"}
          </Button>
        </div>
      </div>

      {showQuestionForm && (
        <QuestionForm
          quizId={quiz.id}
          onSuccess={() =>
            setShowQuestionForm(false)
          }
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Quiz ma'lumotlari
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>
            <strong>Nomi:</strong>{" "}
            {quiz.title || "-"}
          </p>

          <p>
            <strong>O'tish foizi:</strong>{" "}
            {quiz.passPercentage}%
          </p>

          <p>
            <strong>Savollar soni:</strong>{" "}
            {quiz.questions.length}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {quiz.questions.map(
          (question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle>
                    {index + 1}.{" "}
                    {question.question}
                  </CardTitle>

                  <Badge variant="info">
                    {question.options.length} ta
                    variant
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {question.options.map(
                  (option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span>
                        {option.text}
                      </span>

                      {option.isCorrect && (
                        <Badge variant="success">
                          To'g'ri javob
                        </Badge>
                      )}
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          )
        )}

        {quiz.questions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-[var(--color-muted)]">
              Hozircha savollar mavjud emas.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}