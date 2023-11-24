import format from "date-fns/format";
import Link from "next/link";
import Image from "next/image";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function EventCard({ event }: { event: any }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);
  const formattedDate = format(new Date(event.date), "EEE, d MMM");
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  return (
    <div className="group w-full h-50">
      <Link className="flex space-x-4" href={`/profile/events/${event.id}`}>
        <div
          className="relative max-w-sm"
          style={{
            width: "100px",
            height: "100px",
          }}
        >
          <Image
            className="rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300"
            alt="image"
            src={publicUrl}
            fill={true}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-base">{event.name}</div>
          <div className="text-primary text-sm">{formattedDate} </div>
          <div className="text-sm">{event.venue_name}</div>
          <div className="flex space-x-2">
            {tickets?.map((ticket) => (
              <div className="text-sm">
                ${ticket.price} {ticket.name}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
