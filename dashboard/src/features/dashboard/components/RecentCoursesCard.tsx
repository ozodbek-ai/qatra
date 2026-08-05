interface Course {
  id: string;
  title: string;
  totalLessons: number;
}

interface Props {
  courses: Course[];
}

export default function RecentCoursesCard({
  courses,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold text-slate-900">
        Mening kurslarim
      </h2>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border p-4"
          >
            <h3 className="font-semibold text-slate-900">
              {course.title}
            </h3>

            <p className="text-slate-500">
              {course.totalLessons} ta dars
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}