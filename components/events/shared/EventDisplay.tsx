import Link from "next/link";
import Image from "next/image";
import createSupabaseServerClient from "@/utils/supabase/server";
import { formatDate } from "@/utils/helpers/events";

export default async function EventDisplay({ event }: { event: any }) {
  console.log(event);
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);
  const formattedDate = formatDate(event.date);
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  return (
    <div className="group aspect-square w-full">
      <Link href={`/events/${event.id}`}>
        <Image
          className="object-cover h-full w-full rounded-md"
          alt="image"
          src={publicUrl}
          width={200}
          height={200}
        />
        <h1 className="text-xl mt-2">{event.name}</h1>
        <h1>
          <span className="text-primary">{formattedDate}</span>{" "}
          {event.venue_name}
        </h1>
        <div>
          {tickets?.map((ticket) => (
            <h1>
              ${ticket.price} {ticket.name}
            </h1>
          ))}
        </div>
      </Link>
    </div>
  );
}
