import AssignEventOrganizer from "./AssignEventOrganizer";
import DuplicateEvent from "@/components/icons/DuplicateEvent";
import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import AssignTempVendor from "./AssignTempVendor";
import { Tables } from "@/types/supabase";
import { TagData } from "../../types";

export default async function AdminOptions({
  event,
}: {
  event: Tables<"events">;
}) {
  let eventInfo;
  const supabase = await createSupabaseServerClient();
  const { data: tagsData, error: tagsError } = await supabase
    .from("event_tags")
    .select("tags(*)")
    .eq("event_id", event.id)
    .returns<TagData[]>();

  const eventTags = tagsData || [];

  const { data: ticketsData, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .neq("name", "Table");

  const { data: tableData, error: tableError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .eq("name", "Table");

  const tags: string[] = [];
  tagsData?.map((tag) => {
    // @ts-ignore
    tags.push({ tag_name: tag.tags.name, tag_id: tag.tags.id });
  });

  const tickets: string[] = [];
  ticketsData?.map((ticket) => {
    // @ts-ignore
    tickets.push({
      ticket_name: ticket.name,
      ticket_price: ticket.price.toString(),
      ticket_quantity: ticket.quantity.toString(),
    });
  });

  const tables: string[] = [];
  tableData?.map((table) => {
    // @ts-ignore
    tables.push({
      table_price: table.price.toString(),
      table_quantity: table.quantity.toString(),
    });
  });
  eventInfo = { ...event, tags, tickets, tables };

  return (
    <>
      <AssignTempVendor event={event} tags={eventTags} />
      <AssignEventOrganizer event={event} />
      <Link
        href={{
          pathname: `/profile/create-event`,
          query: { data: JSON.stringify(eventInfo) },
        }}
      >
        <div className="opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
          <DuplicateEvent />
        </div>
      </Link>
    </>
  );
}
