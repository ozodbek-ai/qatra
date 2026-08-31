import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";

interface Props {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  onRetry?: () => void;
  courseId?: string;
}

export default function QuizResult({
  score,
  total,
  percentage,
  passed,
  onRetry,
  courseId,
}: Props) {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (courseId) {
      navigate(`/player/${courseId}`);
      return;
    }

    navigate("/my-courses");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Quiz natijasi
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        <div className="rounded-xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-500">
            Natijangiz
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {percentage}%
          </p>

          <p className="mt-1 text-slate-600">
            {score} / {total} ta to‘g‘ri javob
          </p>
        </div>

        <div
          className={`rounded-xl px-4 py-3 text-center font-semibold ${
            passed
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {passed
            ? "🎉 Quiz muvaffaqiyatli topshirildi!"
            : "Quizdan o'ta olmadingiz."}
        </div>

        {!passed && (
          <Button
            type="button"
            className="w-full"
            onClick={onRetry}
          >
            Qayta topshirish
          </Button>
        )}

        {passed && (
          <Button
            type="button"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleContinue}
          >
            Keyingi darsga o'tish →
          </Button>
        )}

        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={() =>
            navigate("/my-courses")
          }
        >
          Mening kurslarim
        </Button>

      </CardContent>
    </Card>
  );
}