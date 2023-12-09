import Link from "next/link";
import Image from "next/image";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl, formatDate } from "@/lib/helpers/events";

export default async function HostingCard({
  event,
  redirectTo,
}: {
  event: Tables<"events">;
  redirectTo: string;
}) {
  const publicPosterUrl = await getPublicPosterUrl(event);
  const formattedDate = formatDate(event.date);

  return (
    <div className="group w-full h-50">
      <Link
        className="flex space-x-4"
        href={`/profile/events/organizer/${event.cleaned_name}`}
      >
        <div
          className="relative max-w-sm"
          style={{
            width: "100px",
            height: "100px",
          }}
        >
          <Image
            className="rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300"
            alt="image"
            src={publicPosterUrl}
            fill={true}
          />
        </div>
        <div>
          <div className="text-base">{event.name}</div>
          <div className="text-primary text-sm">{formattedDate} </div>
          <div className="text-sm">{event.venue_name}</div>
        </div>
      </Link>
    </div>
  );
}
