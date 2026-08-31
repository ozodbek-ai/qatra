import { useNavigate } from "react-router-dom";

interface Props {
  data: {
    courseId: string;
    courseTitle: string;
    lessonId: string;
    lessonTitle: string;
  } | null;
}

export default function ContinueLearningCard({
  data,
}: Props) {
  const navigate = useNavigate();

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          O'qishni davom ettiring
        </h2>

        <p className="mt-2 text-slate-500">
          Hozircha davom ettiriladigan kurs mavjud emas.
        </p>

        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Kurslarni ko'rish
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            O'qishni davom ettiring
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {data.courseTitle}
          </h2>

          <p className="mt-1 text-slate-500">
            Keyingi dars:{" "}
            <span className="font-medium text-slate-700">
              {data.lessonTitle}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/player/${data.courseId}`)
          }
          className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Davom ettirish
        </button>
      </div>
    </div>
  );
}