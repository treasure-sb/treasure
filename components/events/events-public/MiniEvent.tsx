import format from "date-fns/format";
import Link from "next/link";
import Image from "next/image";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function MiniEvent({ event }: { event: any }) {
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
    <div className="group w-full h-50">
      <Link
        className="flex space-x-4"
        style={{
          maxHeight: "100px",
          height: "30vw",
        }}
        href={`/events/${event.id}`}
      >
        <div
          className="relative max-w-sm"
          style={{
            width: "30vw",
            maxWidth: "100px",
            maxHeight: "100px",
            height: "30vw",
          }}
        >
          <Image
            className="rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300"
            alt="image"
            src={publicUrl}
            fill={true}
          />
        </div>
        <div>
          <h1 className="text-xl mt-2">{event.name}</h1>
          <h1>
            <span className="text-yellow-300">{formattedDate} </span>
            {event.venue_name}
          </h1>
          <div>
            {tickets?.map((ticket) => (
              <h1>
                ${ticket.price} {ticket.name}
              </h1>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
