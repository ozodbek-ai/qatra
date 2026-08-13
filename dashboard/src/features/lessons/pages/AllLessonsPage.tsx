import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
} from "@/components/ui";

import { useAllLessons } from "../hooks/useAllLessons";

export default function AllLessonsPage() {
  const navigate = useNavigate();

  const {
    data: lessons,
    isLoading,
    isError,
  } = useAllLessons();

  if (isLoading) {
    return (
      <div className="p-6">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Darslarni yuklab bo'lmadi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Darslar
        </h1>

        <p className="mt-1 text-[var(--color-muted)]">
          Barcha kurslardagi darslarni boshqarish.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="p-4 text-left">
                №
              </th>

              <th className="p-4 text-left">
                Dars
              </th>

              <th className="p-4 text-left">
                Kurs
              </th>

              <th className="p-4 text-left">
                Davomiyligi
              </th>

              <th className="p-4 text-left">
                Quiz
              </th>

              <th className="p-4 text-left">
                Holati
              </th>

              <th className="p-4 text-center">
                Amal
              </th>
            </tr>
          </thead>

          <tbody>
            {lessons?.map((lesson) => (
              <tr
                key={lesson.id}
                className="border-b border-[var(--color-border)] last:border-b-0"
              >
                <td className="p-4">
                  {lesson.order}
                </td>

                <td className="p-4 font-medium">
                  {lesson.title}
                </td>

                <td className="p-4">
                  {lesson.course.title}
                </td>

                <td className="p-4">
                  {lesson.duration} min
                </td>

                <td className="p-4">
                  {lesson.quiz ? (
                    <Badge variant="success">
                      Mavjud
                    </Badge>
                  ) : (
                    <span className="text-sm text-[var(--color-muted)]">
                      Yo'q
                    </span>
                  )}
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

                <td className="p-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/admin/courses/${lesson.courseId}/lessons`
                      )
                    }
                  >
                    Kursdagi darslar
                  </Button>
                </td>
              </tr>
            ))}

            {lessons?.length === 0 && (
              <tr>
                <td
                  colSpan={7}
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