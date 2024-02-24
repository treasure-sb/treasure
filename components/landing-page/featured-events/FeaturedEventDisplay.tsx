import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Tables } from "@/types/supabase";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
    <div className="relative group hover:translate-y-[-.5rem] transition duration-500 md:w-80 w-40">
      <AspectRatio ratio={1}>
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
      </AspectRatio>
    </div>
  );
}
