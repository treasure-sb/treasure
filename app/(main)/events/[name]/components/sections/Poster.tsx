import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import LikeButton from "@/components/events/shared/LikeButton";
import EventPoster from "@/components/events/shared/EventPoster";
import ColorThief from "@/components/events/shared/ColorThief";
import { User } from "@supabase/supabase-js";

export default async function Poster({
  event,
  user,
}: {
  event: Tables<"events">;
  user: User | null;
}) {
  const publicPosterUrl = await getPublicPosterUrl(event);

  return (
    <div className="relative md:sticky md:top-24 h-fit m-auto md:m-0">
      <div className="absolute right-2 top-2 p-2 z-10 bg-black rounded-full hover:bg-black">
        <LikeButton event={event} user={user} />
      </div>
      <div className="mb-6 w-full max-w-xl">
        <EventPoster posterUrl={publicPosterUrl} />
      </div>
      <ColorThief publicUrl={publicPosterUrl} />
    </div>
  );
}
