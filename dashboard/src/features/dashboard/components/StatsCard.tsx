interface StatsCardProps {
  title: string;
  value: number | string;
}

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="text-slate-500">
        {title}
      </h3>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}