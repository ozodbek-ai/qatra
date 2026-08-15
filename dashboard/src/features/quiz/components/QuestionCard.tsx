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
    <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">
          {question.question}
        </CardTitle>

        <p className="text-sm text-slate-500">
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