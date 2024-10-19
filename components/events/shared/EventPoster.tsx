"use client";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateEvent } from "@/app/(create-event)/create/context/CreateEventContext";

export default function EventPoster({
  posterUrl,
  hidden,
}: {
  posterUrl: string | File | undefined;
  hidden?: boolean;
}) {
  const { draftPosterPublicUrl } = useCreateEvent();
  const [loading, setLoading] = useState(true);
  const imageVisibility = loading ? "invisible" : "visible";
  const skeletonDisplay = loading ? "inline-block" : "hidden";

  const imageSrc =
    typeof posterUrl === "string"
      ? (draftPosterPublicUrl as string)
      : posterUrl instanceof File
      ? URL.createObjectURL(posterUrl)
      : "/static/placeholder_poster.jpg";

  return (
    <div className="relative">
      <Image
        className={`rounded-xl my-auto ${
          hidden ? "invisible" : imageVisibility
        }`}
        alt="event poster image"
        src={imageSrc}
        width={1000}
        height={1000}
        priority
        onLoad={() => setLoading(false)}
      />
      {loading && !hidden && (
        <Skeleton
          className={`w-full h-full absolute inset-0 ${skeletonDisplay}`}
        />
      )}
    </div>
  );
}
