import { useEnroll } from "@/features/enrollment/hooks/useEnroll";

interface Props {
  courseId: string;
  price: number;
}

export default function EnrollButton({
  courseId,
  price,
}: Props) {
  const enrollMutation =
    useEnroll();

  return (
    <button
      onClick={() =>
        enrollMutation.mutate(courseId)
      }
      disabled={enrollMutation.isPending}
      className="w-full rounded-xl bg-slate-900 py-4 text-lg font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
    >
      {enrollMutation.isPending
        ? "Yozilmoqda..."
        : price === 0
        ? "Kursga yozilish"
        : `${price} so'm`}
    </button>
  );
}