import LessonForm from "../components/LessonForm";

export default function CreateLessonPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Yangi dars
        </h1>

        <p className="text-[var(--color-muted)]">
          Dars ma'lumotlarini kiriting.
        </p>
      </div>

      <LessonForm />
    </div>
  );
}