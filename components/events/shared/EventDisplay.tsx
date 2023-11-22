import Link from "next/link";
import Image from "next/image";
import createSupabaseServerClient from "@/utils/supabase/server";
import format from "date-fns/format";

export default async function EventDisplay({ event }: { event: any }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);
  const formattedDate = format(new Date(event.date), "EEE, MMMM do");
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  return (
    <div className="group w-fit">
      <Link href={`/events/${event.id}`}>
        <Image
          className="rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300"
          alt="image"
          src={publicUrl}
          width={500}
          height={500}
        />
        <h1 className="text-xl mt-2">{event.name}</h1>
        <h1>
          <span className="text-yellow-300">{formattedDate}</span>{" "}
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
