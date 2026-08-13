import CourseForm from "@/features/courses/components/CourseForm";

export default function CreateCoursePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Yangi kurs yaratish
        </h1>

        <p className="text-[var(--color-muted)]">
          Kurs ma'lumotlarini kiriting.
        </p>
      </div>

      <CourseForm />
    </div>
  );
}