import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui";

import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";

import CoursesToolbar from "@/features/courses/components/CoursesToolbar";
import CourseActions from "@/features/courses/components/CourseActions";

export default function CoursesPage() {
  const {
    data: courses,
    isLoading,
    isError,
  } = useAdminCourses();

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredCourses =
    courses?.filter((course) =>
      course.title
        .toLowerCase()
        .includes(search.toLowerCase())
    ) ?? [];

  if (isLoading) {
    return (
      <div className="p-8">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Kurslarni yuklab bo'lmadi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Kurslar
        </h1>

        <p className="text-[var(--color-muted)]">
          Barcha kurslarni boshqarish.
        </p>
      </div>

      <CoursesToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() =>
          navigate("/admin/courses/new")
        }
      />

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="p-4 text-left">
                Nomi
              </th>

              <th className="p-4 text-left">
                Kategoriya
              </th>

              <th className="p-4 text-left">
                Narxi
              </th>

              <th className="p-4 text-left">
                Holati
              </th>

              <th className="p-4 text-center">
                Amallar
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-[var(--color-muted)]"
                >
                  Kurslar topilmadi.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-background)]"
                >
                  <td className="p-4 font-medium">
                    {course.title}
                  </td>

                  <td className="p-4">
                    {course.category ?? "-"}
                  </td>

                  <td className="p-4">
                    ${course.price}
                  </td>

                  <td className="p-4">
                    <Badge
                      variant={
                        course.isPublished
                          ? "success"
                          : "warning"
                      }
                    >
                      {course.isPublished
                        ? "Published"
                        : "Draft"}
                    </Badge>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center">
                      <CourseActions
                        onLessons={() =>
                          navigate(
                            `/admin/courses/${course.id}/lessons`
                          )
                        }
                        onEdit={() =>
                          navigate(
                            `/admin/courses/${course.id}/edit`,
                            {
                              state: {
                                course,
                              },
                            }
                          )
                        }
                        onDelete={() =>
                          console.log(
                            "Delete:",
                            course.id
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}