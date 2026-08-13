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
}

export default function QuizResult({
  score,
  total,
  percentage,
  passed,
  onRetry,
}: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Quiz natijasi
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>
          Ball:{" "}
          <strong>
            {score}
          </strong>{" "}
          / {total}
        </p>

        <p>
          Foiz:{" "}
          <strong>
            {percentage}%
          </strong>
        </p>

        <div
          className={`inline-flex rounded-full px-4 py-2 text-white ${
            passed
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {passed
            ? "Muvaffaqiyatli"
            : "Yiqildingiz"}
        </div>

        {!passed && (
          <Button
            className="w-full"
            onClick={onRetry}
          >
            Qayta topshirish
          </Button>
        )}

        <Button
          className="w-full"
          variant="outline"
          onClick={() =>
            navigate("/my-courses")
          }
        >
          Kurslarga qaytish
        </Button>
      </CardContent>
    </Card>
  );
}