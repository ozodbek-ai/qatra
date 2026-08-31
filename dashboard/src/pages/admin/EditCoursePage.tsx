import { useParams } from "react-router-dom";

import CourseForm from "@/features/courses/components/CourseForm";
import { useAdminCourse } from "@/features/courses/hooks/useAdminCourse";

export default function EditCoursePage() {
  const { id } = useParams();

  const {
    data: course,
    isLoading,
    isError,
  } = useAdminCourse(id ?? "");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <p className="text-[var(--color-muted)]">
          Kurs ma'lumotlari yuklanmoqda...
        </p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
          Kurs topilmadi yoki ma'lumotlarni
          yuklab bo'lmadi.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Kursni tahrirlash
        </h1>

        <p className="text-[var(--color-muted)]">
          Kurs ma'lumotlarini yangilang.
        </p>
      </div>

      <CourseForm
        initialData={course}
      />
    </div>
  );
}