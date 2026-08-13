import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Badge,
} from "@/components/ui";

import { useLessons } from "../hooks/useLessons";
import { useDeleteLesson } from "../hooks/useDeleteLesson";
import { usePublishLesson } from "../hooks/usePublishLesson";

export default function LessonsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const deleteLesson = useDeleteLesson();
  const publishLessonMutation = usePublishLesson();

  const {
    data: lessons,
    isLoading,
  } = useLessons(courseId!);

  if (isLoading) {
    return (
      <div className="p-6">
        Yuklanmoqda...
      </div>
    );
  }

  const handleDelete = (lessonId: string) => {
    const confirmed = window.confirm(
      "Bu darsni o'chirishni tasdiqlaysizmi?"
    );

    if (!confirmed) return;

    deleteLesson.mutate(lessonId);
  };

  const handleCreateQuiz = (lessonId: string) => {
    if (!courseId) return;

    navigate(
      `/admin/courses/${courseId}/lessons/${lessonId}/quiz/new`
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Darslar
          </h1>

          <p className="text-[var(--color-muted)]">
            Kurs darslarini boshqarish.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate(
              `/admin/courses/${courseId}/lessons/new`
            )
          }
        >
          + Yangi dars
        </Button>
      </div>

      {/* Lessons table */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">
                №
              </th>

              <th className="p-4 text-left">
                Nomi
              </th>

              <th className="p-4 text-left">
                Davomiyligi
              </th>

              <th className="p-4 text-left">
                Preview
              </th>

              <th className="p-4 text-left">
                Holati
              </th>

              <th className="p-4 text-left">
                Amal
              </th>
            </tr>
          </thead>

          <tbody>
            {lessons?.map((lesson) => (
              <tr
                key={lesson.id}
                className="border-b last:border-b-0"
              >
                <td className="p-4">
                  {lesson.order}
                </td>

                <td className="p-4 font-medium">
                  {lesson.title}
                </td>

                <td className="p-4">
                  {lesson.duration} min
                </td>

                <td className="p-4">
                  <Badge
                    variant={
                      lesson.isPreview
                        ? "success"
                        : "info"
                    }
                  >
                    {lesson.isPreview
                      ? "Ha"
                      : "Yo'q"}
                  </Badge>
                </td>

                <td className="p-4">
                  <Badge
                    variant={
                      lesson.isPublished
                        ? "success"
                        : "warning"
                    }
                  >
                    {lesson.isPublished
                      ? "Published"
                      : "Draft"}
                  </Badge>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Tahrirlash */}
                    <Button
                      variant="ghost"
                      onClick={() =>
                        navigate(
                          `/admin/courses/${courseId}/lessons/${lesson.id}/edit`,
                          {
                            state: {
                              lesson,
                            },
                          }
                        )
                      }
                    >
                      Tahrirlash
                    </Button>

                    {/* Quiz yaratish */}
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleCreateQuiz(
                          lesson.id
                        )
                      }
                    >
                      Quiz yaratish
                    </Button>

                    {/* Publish / Draft */}
                    <Button
                      variant={
  lesson.isPublished
    ? "danger"
    : "primary"
}
                      onClick={() =>
                        publishLessonMutation.mutate(
                          {
                            id: lesson.id,
                            isPublished:
                              !lesson.isPublished,
                          }
                        )
                      }
                      disabled={
                        publishLessonMutation.isPending
                      }
                    >
                      {lesson.isPublished
                        ? "Draft"
                        : "Publish"}
                    </Button>

                    {/* O'chirish */}
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        handleDelete(
                          lesson.id
                        )
                      }
                      disabled={
                        deleteLesson.isPending
                      }
                    >
                      O'chirish
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {lessons?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-[var(--color-muted)]"
                >
                  Hozircha darslar mavjud emas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}