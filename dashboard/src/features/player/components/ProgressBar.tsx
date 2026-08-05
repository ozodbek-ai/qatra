interface Props {
  progress: number;
}

export default function ProgressBar({
  progress,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">
          Progress
        </span>

        <span>{progress}%</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}