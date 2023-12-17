import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Tables } from "@/types/supabase";

export default async function FeaturedEventDisplay({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const data = await supabase.storage
    .from("posters")
    .getPublicUrl(event.poster_url);

  return (
    <div className="relative group aspect-square w-full hover:translate-y-[-.5rem] transition duration-500">
      <Link href={`/events/${event.cleaned_name}`}>
        <Image
          className="object-cover w-full h-full rounded-md group-hover:bg-black group-hover:opacity-50 transition duration-300"
          alt="image"
          src={data.data.publicUrl}
          width={200}
          height={200}
        />
      </Link>
      <p className="absolute top-5 left-5 hidden group-hover:block text-xl">
        {event.name}
      </p>
      <p className="absolute hidden group-hover:block bottom-5 left-5">
        {event.venue_name}
      </p>
    </div>
  );
}
