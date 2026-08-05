import { useCourses } from "../hooks/useCourses";
import CourseCard from "./CourseCard";

export default function CoursesSection() {
  const { data, isLoading, isError } = useCourses();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-white">
            Kurslar yuklanmoqda...
          </p>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-red-400">
            Kurslarni yuklab bo'lmadi.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-white">
          Mavjud kurslar
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>
      </div>
    </section>
  );
}