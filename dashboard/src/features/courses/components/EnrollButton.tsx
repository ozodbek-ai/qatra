import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";

import { useEnroll } from "@/features/enrollment/hooks/useEnroll";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface EnrollButtonProps {
  courseId: string;
  price: number;
  isEnrolled: boolean;
}

export default function EnrollButton({
  courseId,
  price,
  isEnrolled,
}: EnrollButtonProps) {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const enrollMutation = useEnroll();

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    enrollMutation.mutate(courseId);
  };

  const handleStartCourse = () => {
    navigate(`/player/${courseId}`);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">

      {/* Price */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          Kurs narxi
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {Number(price) === 0
            ? "Bepul"
            : `$${price}`}
        </p>
      </div>

      {/* Action */}
      {isEnrolled ? (
        <Button
          type="button"
          onClick={handleStartCourse}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Kursni boshlash
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleEnroll}
          loading={enrollMutation.isPending}
          disabled={enrollMutation.isPending}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {user
            ? "Kursga yozilish"
            : "Kirish va yozilish"}
        </Button>
      )}
    </div>
  );
}