import { useCompleteLesson } from "@/features/progress/hooks/useCompleteLesson";

interface Props {
  lessonId: string;
  courseId: string;
}

export default function CompleteLessonButton({
  lessonId,
  courseId,
}: Props) {
  const mutation =
    useCompleteLesson(courseId);

  return (
    <button
      onClick={() =>
        mutation.mutate(lessonId)
      }
      disabled={mutation.isPending}
      className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
    >
      {mutation.isPending
        ? "Saqlanmoqda..."
        : "Darsni tugatdim"}
    </button>
  );
}