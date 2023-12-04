import { Skeleton } from "@/components/ui/skeleton";

export default function EventDisplaySkeleton() {
  return (
    <div className="aspect-square animate-pulse space-y-2">
      <Skeleton className="w-full h-full rounded-md" />
      <Skeleton className="w-[40%] h-4" />
      <Skeleton className="w-[50%] h-4" />
      <Skeleton className="w-[20%] h-4" />
    </div>
  );
}
