import { useCompleteLesson } from "@/features/progress/hooks/useCompleteLesson";

interface Props {
  lessonId: string;
  courseId: string;
  onSuccess?: () => void;
}

export default function CompleteLessonButton({
  lessonId,
  courseId,
  onSuccess,
}: Props) {
  const mutation = useCompleteLesson(courseId);

  const handleComplete = () => {
    mutation.mutate(lessonId, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleComplete}
      disabled={mutation.isPending}
      className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
    >
      {mutation.isPending
        ? "Saqlanmoqda..."
        : "Darsni tugatdim"}
    </button>
  );
}