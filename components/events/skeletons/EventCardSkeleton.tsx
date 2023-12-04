import { Skeleton } from "@/components/ui/skeleton";

export default function EventCardSkeleton() {
  return (
    <div className="flex h-50 w-full space-x-4">
      <Skeleton className="w-[100px] h-[100px] rounded-md" />
      <div className="w-80 space-y-3">
        <Skeleton className="w-[70%] h-3" />
        <Skeleton className="w-[30%] h-3" />
        <Skeleton className="w-[50%] h-3" />
        <Skeleton className="w-[20%] h-3" />
      </div>
    </div>
  );
}
