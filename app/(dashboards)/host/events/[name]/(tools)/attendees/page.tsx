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

  const { event, eventError } = await getEventFromCleanedName(name);

  const { data } = await supabase.rpc("get_attendee_data", {
    event_id: event.id,
  });

  const attendeeData: AttendeeData[] = data || [];

  const attendeeTableDataPromise: Promise<Attendee>[] = attendeeData.map(
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
  const attendeeTableData = await Promise.all(attendeeTableDataPromise);

  const { data: ticketData } = await supabase
    .from("tickets")
    .select("name")
    .eq("event_id", event.id)
    .returns<Ticket[]>();

  const ticketNames = ticketData ? ticketData.map((ticket) => ticket.name) : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4 mt-8">
        <h2 className="text-2xl font-semibold">
          Attendees{" "}
          <span className="text-muted-foreground">
            {attendeeTableData.length}
          </span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={attendeeTableData}
        event={event}
        tickets={ticketNames}
      />
    </div>
  );
}
