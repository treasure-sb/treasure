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
    <div className="relative group hover:translate-y-[-.5rem] transition duration-500 md:w-full md:h-96 w-40 h-40">
      <Link href={`/events/${event.cleaned_name}`}>
        <Image
          priority
          className="object-cover w-full h-full rounded-md group-hover:bg-black group-hover:opacity-50 transition duration-300"
          alt="image"
          src={data.data.publicUrl}
          width={400}
          height={400}
        />
      </Link>
      <p className="absolute top-5 left-5 hidden group-hover:block md:text-xl text-xs">
        {event.name}
      </p>
      <p className="absolute hidden group-hover:block bottom-5 left-5">
        {event.venue_name}
      </p>
    </div>
  );
}
