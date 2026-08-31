export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-3">
        <div className="h-9 w-72 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>

      <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />

      <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}