import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoading({
  numOfSkeletons = 2,
}: {
  numOfSkeletons?: number;
}) {
  return (
    <div className="flex items-center p-4 space-x-4">
      <div className="space-y-4">
        {Array.from({ length: numOfSkeletons }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full min-w-[450px]" />
        ))}
      </div>
    </div>
  );
}
