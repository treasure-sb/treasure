import { getPublicPosterUrl } from "@/lib/helpers/events";
import { User } from "@supabase/supabase-js";
import { EventWithDates } from "@/types/event";
import LikeButton from "@/components/events/shared/LikeButton";
import EventPoster from "@/components/events/shared/EventPoster";

export default async function Poster({
  event,
  user,
}: {
  event: EventWithDates;
  user: User | null;
}) {
  const publicPosterUrl = await getPublicPosterUrl(event.poster_url);

  return (
    <div className="relative md:sticky md:top-20 h-fit m-auto md:m-0">
      <div className="absolute right-2 top-2 p-2 h-9 z-20 bg-black bg-opacity-30 backdrop-blur-sm rounded-full hover:bg-black/50 transition duration-500">
        <LikeButton event={event} user={user} isDisplay={true} />
      </div>
      <div className="mb-6 w-full max-w-xl relative z-10">
        <EventPoster posterUrl={publicPosterUrl} />
      </div>
    </div>
  );
}
