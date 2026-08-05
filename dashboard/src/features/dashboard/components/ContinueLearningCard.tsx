interface Props {
  data: {
    courseTitle: string;
    lessonTitle: string;
  } | null;
}

export default function ContinueLearningCard({
  data,
}: Props) {
  if (!data) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Continue Learning
      </h2>

      <p className="font-semibold text-slate-900">
        {data.courseTitle}
      </p>

      <p className="text-slate-500">
        {data.lessonTitle}
      </p>
    </div>
  );
}