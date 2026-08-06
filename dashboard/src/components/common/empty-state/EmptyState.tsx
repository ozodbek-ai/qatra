import { BookOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
      <BookOpen className="mb-4 h-14 w-14 text-slate-500" />

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-slate-400">
        {description}
      </p>
    </div>
  );
}