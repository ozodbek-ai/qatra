import { useLocation } from "react-router-dom";

import CourseForm from "@/features/courses/components/CourseForm";

export default function EditCoursePage() {
  const location = useLocation();

  const course = location.state?.course;

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

      <CourseForm initialData={course} />
    </div>
  );
}