import Link from "next/link";
import Image from "next/image";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl, formatDate } from "@/lib/helpers/events";

export default async function EventCard({
  event,
  redirectTo,
}: {
  event: Tables<"events">;
  redirectTo: string;
}) {
  const supabase = await createSupabaseServerClient();
  const publicPosterUrl = await getPublicPosterUrl(event);
  const formattedDate = formatDate(event.date);

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  function ticketsText() {
    let text = "";
    if (tickets && tickets?.length < 4) {
      let table = "";
      tickets?.map((ticket) => {
        if (ticket.name == "Table") {
          table += `${ticket.name} $${ticket.price} | `;
        } else {
          text += `${ticket.name} $${ticket.price} | `;
        }
      });
      text =
        table == ""
          ? text.substring(0, text.length - 2)
          : text + table.substring(0, table.length - 2);
    } else {
      let table = "";
      let cheapest = 1000000;
      tickets?.forEach((ticket) => {
        if (ticket.name == "Table") {
          table += `${ticket.price}`;
        } else {
          cheapest = cheapest < ticket.price ? cheapest : ticket.price;
        }
      });
      text += `From $${cheapest} | Table $${table}`;
    }
    return text;
  }

  return (
    <div className="group w-full h-25 overflow-hidden">
      <Link className="flex space-x-4" href={redirectTo}>
        <div
          className="relative shrink-0"
          style={{
            width: "100px",
            height: "100px",
          }}
        >
          <Image
            className="rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300"
            alt="image"
            src={publicPosterUrl}
            fill={true}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-base">
            {event.name.length > 40
              ? event.name.substring(0, 38) + "..."
              : event.name}
          </div>
          <div className="text-primary text-sm">{formattedDate} </div>
          <div className="text-sm whitespace-nowrap">
            {event.venue_name.length > 30
              ? event.venue_name.substring(0, 28) + "..."
              : event.venue_name}
          </div>
          <div className="text-sm overflow-hidden">{ticketsText()}</div>
        </div>
      </Link>
    </div>
  );
}
