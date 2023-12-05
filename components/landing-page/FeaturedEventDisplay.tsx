import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function FeaturedEventDisplay({ event }: { event: any }) {
  const supabase = await createSupabaseServerClient();
  const data = await supabase.storage
    .from("posters")
    .getPublicUrl(event.poster_url);

  return (
    <div className="group aspect-square w-full">
      <Link href={`/events/${event.id}`}>
        <Image
          className="object-cover w-full h-full rounded-md group-hover:bg-black group-hover:opacity-50 transition duration-300"
          alt="image"
          src={data.data.publicUrl}
          width={200}
          height={200}
        />
      </Link>
    </div>
  );
}
