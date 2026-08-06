import { Skeleton } from "@/components/ui";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <Skeleton className="h-10 w-72" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-32 rounded-2xl"
          />
        ))}
      </div>

      <Skeleton className="h-44 rounded-2xl" />

      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}