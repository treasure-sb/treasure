import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function FeaturedEventDisplay({ event }: { event: any }) {
  const supabase = await createSupabaseServerClient();
  const data = await supabase.storage
    .from("posters")
    .getPublicUrl(event.poster_url);

  return (
    <Link href={`/events/${event.id}`}>
      <div className="relative w-36 h-36 sm:w-80 sm:h-80">
        <Image
          className="rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300"
          alt="image"
          src={data.data.publicUrl}
          sizes="(max-width: 768px) 100vw, 33vw"
          fill={true}
        />
      </div>
    </Link>
  );
}
