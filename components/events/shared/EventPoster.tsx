"use client";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventPoster({
  posterUrl,
  hidden,
}: {
  posterUrl: string;
  hidden?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const imageVisibility = loading ? "invisible" : "visible";
  const skeletonDisplay = loading ? "inline-block" : "hidden";

  return (
    <div className="relative">
      <Image
        className={`rounded-xl my-auto ${
          hidden ? "invisible" : imageVisibility
        }`}
        alt="event poster image"
        src={posterUrl}
        width={1000}
        height={1000}
        priority
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <Skeleton
          className={`w-full h-full absolute inset-0 ${skeletonDisplay}`}
        />
      )}
    </div>
  );
}
