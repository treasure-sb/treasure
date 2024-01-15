import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useTables } from "../query";

export default function Tables() {
  const { data, isLoading } = useTables();
  const { eventsData } = data ?? {};

  return (
    <div className="border-[1px] p-6 rounded-3xl my-4 md:my-0 dashboard-section-theme">
      <h1 className="text-2xl font-semibold text-left mb-6">Tables</h1>
      {isLoading && (
        <div className="h-60 space-y-4">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-[80%] rounded-md" />
        </div>
      )}
      {eventsData && eventsData.length > 0 && (
        <>
          <p className="mb-2">
            You're vending at{" "}
            <span className="font-semibold">{eventsData[0].name}!</span>
          </p>
          <div className="group aspect-square w-full relative">
            <Image
              className="object-cover h-40 w-40 rounded-md"
              alt="image"
              src={eventsData[0].publicPosterUrl}
              width={100}
              height={100}
            />
          </div>
        </>
      )}
    </div>
  );
}
