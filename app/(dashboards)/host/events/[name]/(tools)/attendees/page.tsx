import createSupabaseServerClient from "@/utils/supabase/server";
import { Attendee, columns } from "./components/table/AttendeeDataColumns";
import { DataTable } from "./components/table/DataTable";
import { redirect } from "next/navigation";
import { Database, Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { CustomerData } from "./types";
import { getEventFromCleanedName } from "@/lib/helpers/events";

type AttendeeData =
  Database["public"]["Functions"]["get_attendee_data"]["Returns"][number];

type Ticket = {
  name: string;
};

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { event } = await getEventFromCleanedName(name);

  const { data } = await supabase.rpc("get_attendee_data", {
    event_id: event.id,
  });

  const attendeeData: AttendeeData[] = data || [];

  const attendeeTicketDataPromise: Promise<Attendee>[] = attendeeData.map(
    async (attendee) => {
      const { first_name, last_name, email, phone, avatar_url } = attendee;
      const avatar = await getProfileAvatar(avatar_url);
      const customer: CustomerData = {
        first_name,
        last_name,
        email,
        phone,
        avatar_url: avatar,
      };
      return {
        id: attendee.attendee_id,
        avatar_url: avatar,
        quantity: attendee.number_tickets_purchased,
        ticketsScanned: attendee.number_tickets_scanned,
        ticketNames: attendee.ticket_names,
        customer,
        lastPurchaseDate: new Date(attendee.date_of_last_purchase),
      };
    }
  );
  const attendeeTicketData = await Promise.all(attendeeTicketDataPromise);

  const { data: ticketData } = await supabase
    .from("tickets")
    .select("name")
    .eq("event_id", event.id)
    .returns<Ticket[]>();

  const ticketNames = ticketData ? ticketData.map((ticket) => ticket.name) : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2 items-start md:flex-row md:space-x-2 md:space-y-0 mb-4 mt-8 md:items-center">
        <h2 className="text-2xl font-semibold">
          Attendees{" "}
          <span className="text-muted-foreground">
            {attendeeTicketData.length}
          </span>
        </h2>
        <span className="hidden md:block text-muted-foreground">|</span>
        <h2 className="text-2xl font-semibold">
          Tickets Sold{" "}
          <span className="text-muted-foreground">
            {attendeeTicketData.reduce((acc, attendee) => {
              return acc + attendee.quantity;
            }, 0)}
          </span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={attendeeTicketData}
        event={event}
        tickets={ticketNames}
      />
    </div>
  );
}
