import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

export default async function EventDisplay({ event }: { event: any }) {
  const supabase = await createSupabaseServerClient();
  const data = await supabase.storage
    .from("posters")
    .getPublicUrl(event.poster_url);
  const formattedDate = format(new Date(event.date), "EEE, MMMM do");

  console.log(event);

  return (
    <div className="group">
      <Link href="/">
        <Image
          className="rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300"
          alt="image"
          src={data.data.publicUrl}
          width={500}
          height={500}
        />
        <h1 className="text-lg mt-2">{event.name}</h1>
        <div>{formattedDate}</div>
      </Link>
    </div>
  );
}
