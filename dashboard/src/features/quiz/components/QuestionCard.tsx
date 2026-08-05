import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import OptionButton from "./OptionButton";
import type { QuizQuestion } from "../types/quiz";

interface Props {
  question: QuizQuestion;
  selectedOption?: string;
  onSelect: (
    questionId: string,
    optionId: string
  ) => void;
}

export default function QuestionCard({
  question,
  selectedOption,
  onSelect,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {question.order}. {question.text}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            text={option.text}
            selected={
              selectedOption === option.id
            }
            onClick={() =>
              onSelect(
                question.id,
                option.id
              )
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}