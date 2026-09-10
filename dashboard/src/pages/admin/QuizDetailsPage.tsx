import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge, Button, Input } from "@/components/ui";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  type: "SINGLE" | "MULTIPLE";
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  passPercentage: number;

  lesson: {
    id: string;
    title: string;

    course: {
      id: string;
      title: string;
    };
  };

  questions: Question[];
}

interface QuizResponse {
  success: boolean;
  data: Quiz;
}

interface CreateQuestionForm {
  question: string;
  type: "SINGLE" | "MULTIPLE";
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export default function QuizDetailsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showQuestionForm, setShowQuestionForm] =
    useState(false);

  const [savingQuestion, setSavingQuestion] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  const [questionText, setQuestionText] =
    useState("");

  const [questionType, setQuestionType] =
    useState<"SINGLE" | "MULTIPLE">(
      "SINGLE"
    );

  const [options, setOptions] = useState<
    {
      text: string;
      isCorrect: boolean;
    }[]
  >([
    {
      text: "",
      isCorrect: false,
    },
    {
      text: "",
      isCorrect: false,
    },
  ]);

const loadQuiz = useCallback(
  async () => {
    if (!quizId) {
      setError("Quiz ID topilmadi.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<QuizResponse>(
          `/quizzes/${quizId}`
        );

      setQuiz(response.data.data);
    } catch (err: unknown) {
      const message =
        isAxiosError<{
          message?: string;
        }>(err)
          ? err.response?.data?.message ??
            "Quizni yuklab bo'lmadi"
          : "Quizni yuklab bo'lmadi";

      setError(message);
    } finally {
      setLoading(false);
    }
  },
  [quizId]
);

useEffect(() => {
  queueMicrotask(() => {
    void loadQuiz();
  });
}, [loadQuiz]);


  const resetQuestionForm = () => {
    setQuestionText("");
    setQuestionType("SINGLE");

    setOptions([
      {
        text: "",
        isCorrect: false,
      },
      {
        text: "",
        isCorrect: false,
      },
    ]);

    setFormError("");
  };

  const openQuestionForm = () => {
    resetQuestionForm();
    setShowQuestionForm(true);
  };

  const closeQuestionForm = () => {
    if (savingQuestion) {
      return;
    }

    setShowQuestionForm(false);
    resetQuestionForm();
  };

  const updateOptionText = (
    index: number,
    text: string
  ) => {
    setOptions((prev) =>
      prev.map((option, i) =>
        i === index
          ? {
              ...option,
              text,
            }
          : option
      )
    );
  };

  const selectCorrectOption = (
    index: number
  ) => {
    setOptions((prev) =>
      prev.map((option, i) => ({
        ...option,
        isCorrect:
          questionType === "SINGLE"
            ? i === index
            : i === index
              ? !option.isCorrect
              : option.isCorrect,
      }))
    );
  };

  const addOption = () => {
    if (options.length >= 6) {
      return;
    }

    setOptions((prev) => [
      ...prev,
      {
        text: "",
        isCorrect: false,
      },
    ]);
  };

  const removeOption = (
    index: number
  ) => {
    if (options.length <= 2) {
      return;
    }

    setOptions((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleTypeChange = (
    type: "SINGLE" | "MULTIPLE"
  ) => {
    setQuestionType(type);

    if (type === "SINGLE") {
      setOptions((prev) =>
        prev.map((option, index) => ({
          ...option,
          isCorrect:
            index ===
            prev.findIndex(
              (item) => item.isCorrect
            ),
        }))
      );
    }
  };

  const handleCreateQuestion =
    async () => {
      if (!quizId) {
        return;
      }

      setFormError("");

      const trimmedQuestion =
        questionText.trim();

      if (trimmedQuestion.length < 3) {
        setFormError(
          "Savol kamida 3 ta belgidan iborat bo'lishi kerak."
        );
        return;
      }

      const preparedOptions =
        options.map((option) => ({
          text: option.text.trim(),
          isCorrect: option.isCorrect,
        }));

      if (
        preparedOptions.some(
          (option) =>
            option.text.length < 1
        )
      ) {
        setFormError(
          "Barcha variantlarni to'ldiring."
        );
        return;
      }

      const correctCount =
        preparedOptions.filter(
          (option) =>
            option.isCorrect
        ).length;

      if (
        questionType === "SINGLE" &&
        correctCount !== 1
      ) {
        setFormError(
          "Bitta javobli savolda aynan bitta to'g'ri javob tanlang."
        );
        return;
      }

      if (
        questionType === "MULTIPLE" &&
        correctCount < 2
      ) {
        setFormError(
          "Ko'p javobli savolda kamida ikkita to'g'ri javob tanlang."
        );
        return;
      }

      try {
        setSavingQuestion(true);

        const payload: CreateQuestionForm = {
          question:
            trimmedQuestion,
          type: questionType,
          options: preparedOptions,
        };

        await api.post(
          "/questions",
          {
            quizId,
            ...payload,
          }
        );

        await loadQuiz();

        closeQuestionForm();
      } catch (err: unknown) {
  const message = isAxiosError<{ message?: string }>(err)
    ? err.response?.data?.message ??
      "Savol yaratishda xatolik yuz berdi."
    : "Savol yaratishda xatolik yuz berdi.";

  setError(message);
} finally {
        setSavingQuestion(false);
      }
    };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Yuklanmoqda...
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-8">
        <Button
          variant="outline"
          onClick={() =>
            navigate("/admin/quizzes")
          }
        >
          ← Quizlar
        </Button>

        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
          {error || "Quiz topilmadi."}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Button
              variant="outline"
              onClick={() =>
                navigate("/admin/quizzes")
              }
            >
              ← Quizlar
            </Button>

            <h1 className="mt-5 text-3xl font-bold">
              {quiz.title}
            </h1>

            {quiz.description && (
              <p className="mt-2 text-[var(--color-muted)]">
                {quiz.description}
              </p>
            )}
          </div>

          <Badge variant="success">
            O'tish: {quiz.passPercentage}%
          </Badge>
        </div>

        {/* Quiz info */}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <p className="text-sm text-[var(--color-muted)]">
              Kurs
            </p>

            <p className="mt-2 font-semibold">
              {quiz.lesson.course.title}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <p className="text-sm text-[var(--color-muted)]">
              Dars
            </p>

            <p className="mt-2 font-semibold">
              {quiz.lesson.title}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <p className="text-sm text-[var(--color-muted)]">
              Savollar
            </p>

            <p className="mt-2 text-2xl font-bold">
              {quiz.questions.length}
            </p>
          </div>
        </div>

        {/* Questions header */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Savollar
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Quiz tarkibidagi savollar
            </p>
          </div>

          <Button
            onClick={openQuestionForm}
          >
            + Savol qo'shish
          </Button>
        </div>

        {/* Question form */}

        {showQuestionForm && (
          <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                Yangi savol
              </h3>

              <Button
                variant="outline"
                onClick={
                  closeQuestionForm
                }
                disabled={savingQuestion}
              >
                Bekor qilish
              </Button>
            </div>

            {formError && (
              <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
                {formError}
              </div>
            )}

            <div className="space-y-6">

              {/* Question */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Savol
                </label>

                <Input
                  value={questionText}
                  onChange={(e) =>
                    setQuestionText(
                      e.target.value
                    )
                  }
                  placeholder="Masalan: JavaScriptda const nima uchun ishlatiladi?"
                />
              </div>

              {/* Type */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Savol turi
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleTypeChange(
                        "SINGLE"
                      )
                    }
                    className={`rounded-lg border px-4 py-2 ${
                      questionType ===
                      "SINGLE"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    Bitta javob
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleTypeChange(
                        "MULTIPLE"
                      )
                    }
                    className={`rounded-lg border px-4 py-2 ${
                      questionType ===
                      "MULTIPLE"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    Ko'p javob
                  </button>
                </div>

                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {questionType ===
                  "SINGLE"
                    ? "Faqat bitta to'g'ri javob bo'ladi."
                    : "Kamida ikkita to'g'ri javob bo'ladi."}
                </p>
              </div>

              {/* Options */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Variantlar
                  </label>

                  <span className="text-sm text-[var(--color-muted)]">
                    {options.length}/6
                  </span>
                </div>

                <div className="space-y-3">
                  {options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 rounded-lg border p-3 ${
                          option.isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-[var(--color-border)]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            selectCorrectOption(
                              index
                            )
                          }
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                            option.isCorrect
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-[var(--color-border)]"
                          }`}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </button>

                        <Input
                          value={
                            option.text
                          }
                          onChange={(e) =>
                            updateOptionText(
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Variant ${String.fromCharCode(
                            65 + index
                          )}`}
                        />

                        {option.isCorrect && (
                          <Badge variant="success">
                            To'g'ri
                          </Badge>
                        )}

                        {options.length >
                          2 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeOption(
                                index
                              )
                            }
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            O'chirish
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>

                {options.length <
                  6 && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={addOption}
                  >
                    + Variant qo'shish
                  </Button>
                )}
              </div>

              {/* Submit */}

              <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
                <Button
                  variant="outline"
                  onClick={
                    closeQuestionForm
                  }
                  disabled={
                    savingQuestion
                  }
                >
                  Bekor qilish
                </Button>

                <Button
                  loading={
                    savingQuestion
                  }
                  onClick={
                    handleCreateQuestion
                  }
                >
                  Savolni saqlash
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Questions */}

        {quiz.questions.length ===
        0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-10 text-center">
            <p className="text-[var(--color-muted)]">
              Bu quizda hali savollar
              yo'q.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {quiz.questions.map(
              (question, index) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
                >
                  <div className="border-b border-[var(--color-border)] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-muted)]">
                          Savol {index + 1}
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                          {question.question}
                        </h3>
                      </div>

                      <Badge variant="info">
                        {question.type ===
                        "SINGLE"
                          ? "Bitta javob"
                          : "Ko'p javob"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 p-6">
                    {question.options.map(
                      (
                        option,
                        optionIndex
                      ) => (
                        <div
  key={option.id}
  className={`flex items-center justify-between rounded-lg border p-4 ${
    option.isCorrect
      ? "border-green-500 bg-green-50 text-slate-900"
      : "border-[var(--color-border)] text-[var(--color-foreground)]"
  }`}
>
  <div className="flex items-center gap-3">
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium ${
        option.isCorrect
          ? "border-green-600 bg-green-600 text-white"
          : "border-[var(--color-border)] text-[var(--color-foreground)]"
      }`}
    >
      {String.fromCharCode(
        65 + optionIndex
      )}
    </div>

    <span
      className={
        option.isCorrect
          ? "font-medium text-slate-900"
          : "text-[var(--color-foreground)]"
      }
    >
      {option.text}
    </span>
  </div>

  {option.isCorrect && (
    <Badge variant="success">
      To'g'ri javob
    </Badge>
  )}
</div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}