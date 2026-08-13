import { useState } from "react";

import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { useCreateQuestion } from "../hooks/useCreateQuestion";

interface Props {
  quizId: string;
  onSuccess?: () => void;
}

type QuestionType = "SINGLE" | "MULTIPLE";

interface OptionForm {
  text: string;
  isCorrect: boolean;
}

export default function QuestionForm({
  quizId,
  onSuccess,
}: Props) {
  const createQuestion =
    useCreateQuestion();

  const [question, setQuestion] =
    useState("");

  const [type, setType] =
    useState<QuestionType>("SINGLE");

  const [options, setOptions] =
    useState<OptionForm[]>([
      {
        text: "",
        isCorrect: true,
      },
      {
        text: "",
        isCorrect: false,
      },
    ]);

  const handleOptionChange = (
    index: number,
    value: string
  ) => {
    setOptions((prev) =>
      prev.map((option, i) =>
        i === index
          ? {
              ...option,
              text: value,
            }
          : option
      )
    );
  };

  const handleCorrectChange = (
    index: number
  ) => {
    if (type === "SINGLE") {
      setOptions((prev) =>
        prev.map((option, i) => ({
          ...option,
          isCorrect: i === index,
        }))
      );

      return;
    }

    setOptions((prev) =>
      prev.map((option, i) =>
        i === index
          ? {
              ...option,
              isCorrect:
                !option.isCorrect,
            }
          : option
      )
    );
  };

  const handleTypeChange = (
    newType: QuestionType
  ) => {
    setType(newType);

    if (newType === "SINGLE") {
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

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const trimmedQuestion =
      question.trim();

    if (trimmedQuestion.length < 3) {
      return;
    }

    const trimmedOptions =
      options.map((option) => ({
        ...option,
        text: option.text.trim(),
      }));

    if (
      trimmedOptions.some(
        (option) =>
          option.text.length === 0
      )
    ) {
      return;
    }

    const correctCount =
      trimmedOptions.filter(
        (option) =>
          option.isCorrect
      ).length;

    if (type === "SINGLE") {
      if (correctCount !== 1) {
        return;
      }
    }

    if (type === "MULTIPLE") {
      if (correctCount < 2) {
        return;
      }
    }

    createQuestion.mutate(
      {
        quizId,
        question:
          trimmedQuestion,
        type,
        options:
          trimmedOptions,
      },
      {
        onSuccess: () => {
          setQuestion("");
          setType("SINGLE");

          setOptions([
            {
              text: "",
              isCorrect: true,
            },
            {
              text: "",
              isCorrect: false,
            },
          ]);

          onSuccess?.();
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Yangi savol
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Input
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
            placeholder="Savolni kiriting"
          />

          {/* Savol turi */}
          <div className="space-y-3">
            <h3 className="font-medium">
              Savol turi
            </h3>

            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="questionType"
                  checked={
                    type === "SINGLE"
                  }
                  onChange={() =>
                    handleTypeChange(
                      "SINGLE"
                    )
                  }
                />

                <span>
                  Bitta javob
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="questionType"
                  checked={
                    type === "MULTIPLE"
                  }
                  onChange={() =>
                    handleTypeChange(
                      "MULTIPLE"
                    )
                  }
                />

                <span>
                  Bir nechta javob
                </span>
              </label>
            </div>

            <p className="text-sm text-[var(--color-muted)]">
              {type === "SINGLE"
                ? "Student faqat bitta javob tanlaydi."
                : "Student bir nechta javob tanlashi mumkin."}
            </p>
          </div>

          {/* Variantlar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                Javob variantlari
              </h3>

              <span className="text-sm text-[var(--color-muted)]">
                {options.length}/6
              </span>
            </div>

            {options.map(
              (option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <input
                    type={
                      type === "SINGLE"
                        ? "radio"
                        : "checkbox"
                    }
                    name={
                      type === "SINGLE"
                        ? "correctOption"
                        : `correctOption-${index}`
                    }
                    checked={
                      option.isCorrect
                    }
                    onChange={() =>
                      handleCorrectChange(
                        index
                      )
                    }
                  />

                  <Input
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`Variant ${
                      index + 1
                    }`}
                  />

                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      removeOption(
                        index
                      )
                    }
                    disabled={
                      options.length <= 2
                    }
                  >
                    ×
                  </Button>
                </div>
              )
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              disabled={
                options.length >= 6
              }
            >
              + Variant qo'shish
            </Button>

            <Button
              type="submit"
              loading={
                createQuestion.isPending
              }
            >
              Savolni saqlash
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}