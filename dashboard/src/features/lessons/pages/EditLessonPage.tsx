import { useLocation } from "react-router-dom";

import LessonForm from "../components/LessonForm";

export default function EditLessonPage() {
  const location = useLocation();

  const lesson = location.state?.lesson;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Darsni tahrirlash
        </h1>

        <p className="text-[var(--color-muted)]">
          Dars ma'lumotlarini yangilang.
        </p>
      </div>

      <LessonForm initialData={lesson} />
    </div>
  );
}