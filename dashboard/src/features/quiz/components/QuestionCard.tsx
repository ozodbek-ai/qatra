import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import OptionButton from "./OptionButton";

import type {
  QuizQuestion,
} from "../types/quiz";

interface Props {
  question: QuizQuestion;

  selectedOptions: string[];

  onSelect: (
    questionId: string,
    optionId: string
  ) => void;
}

export default function QuestionCard({
  question,
  selectedOptions,
  onSelect,
}: Props) {
  const isMultiple =
    question.type === "MULTIPLE";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {question.question}
        </CardTitle>

        <p className="text-sm text-[var(--color-muted)]">
          {isMultiple
            ? "Bir nechta javobni tanlang."
            : "Bitta javobni tanlang."}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {question.options.map(
          (option) => (
            <OptionButton
              key={option.id}
              text={option.text}
              selected={selectedOptions.includes(
                option.id
              )}
              onClick={() =>
                onSelect(
                  question.id,
                  option.id
                )
              }
              multiple={isMultiple}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}