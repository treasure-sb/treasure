import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "@/components/events/shared/LikeButton";

export default function EventCard({
  redirectTo,
  event,
  user,
  showLikeButton = true,
}: {
  redirectTo: string;
  user?: User | null;
  event: EventDisplayData;
  showLikeButton?: boolean;
}) {
  const { tickets, publicPosterUrl, formattedDate } = event;

  function ticketsText() {
    let text = "";
    if (tickets && tickets?.length < 4) {
      let table = "";
      tickets?.map((ticket: Tables<"tickets">) => {
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
      tickets?.forEach((ticket: Tables<"tickets">) => {
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
    <div className="w-full h-25 flex items-center justify-between">
      <Link className="max-w-[90%] min-w-[90%]" href={redirectTo}>
        <div className="flex space-x-4">
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
              fill
              sizes="100px"
            />
          </div>
          <div className="max-w-[65%]">
            <p className="text-lg font-bold truncate">{event.name}</p>
            <p className="text-primary text-xs">{formattedDate} </p>
            <p className="text-sm font-semibold truncate">{event.venue_name}</p>
            <p className="text-sm overflow-hidden truncate">{ticketsText()}</p>
          </div>
        </div>
      </Link>
      {showLikeButton && <LikeButton event={event} user={user} />}
    </div>
  );
}
