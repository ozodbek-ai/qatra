import { Link } from "react-router-dom";

import type { Course } from "../types/course";

interface Props {
  course: Course;
}

export default function CourseCard({
  course,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-slate-900">
        {course.title}
      </h2>

      <p className="mt-3 text-slate-600">
        {course.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {course.level}
        </span>

        <Link
          to={`/courses/${course.slug}`}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Batafsil
        </Link>
      </div>
    </div>
  );
}