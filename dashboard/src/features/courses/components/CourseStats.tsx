import type { Course } from "../types/course";

interface Props {
  course: Course;
}

export default function CourseStats({
  course,
}: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <div className="rounded-lg bg-white p-5 shadow">
        <p className="text-sm text-slate-500">
          Darslar
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {course._count.lessons}
        </h3>
      </div>

      <div className="rounded-lg bg-white p-5 shadow">
        <p className="text-sm text-slate-500">
          O'quvchilar
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {course._count.enrollments}
        </h3>
      </div>

      <div className="rounded-lg bg-white p-5 shadow">
        <p className="text-sm text-slate-500">
          Sharhlar
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {course._count.reviews}
        </h3>
      </div>

      <div className="rounded-lg bg-white p-5 shadow">
        <p className="text-sm text-slate-500">
          Reyting
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {course.averageRating}
        </h3>
      </div>
    </section>
  );
}