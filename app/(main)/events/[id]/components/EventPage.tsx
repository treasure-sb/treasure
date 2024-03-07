import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/types/supabase";
import Location from "./sections/Location";
import Tickets from "./tickets/Tickets";
import Tags from "./Tags";
import VendorTables from "./tables/VendorTables";
import HostedBy from "./sections/HostedBy";
import Vendors from "./Vendors";
import EventOptions from "./options/EventOptions";
import EventHeading from "./sections/EventHeading";
import About from "./sections/About";
import Poster from "./sections/Poster";
import VenueMap from "./sections/VenueMap";

export default async function EventPage({
  event,
  vendors,
}: {
  event: Tables<"events">;
  vendors: Tables<"profiles">[];
}) {
  const {
    data: { user },
  } = await validateUser();
  const eventDisplayData = await getEventDisplayData(event);

  return (
    <main className="w-full md:w-fit m-auto">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <Poster event={event} user={user} />
        <div className="text-left max-w-lg lg:max-w-xl mx-auto space-y-8 z-10">
          <EventHeading event={event} />
          <Tags event={event} />
          <div className="space-y-2">
            <Tickets
              event={event}
              user={user}
              eventDisplayData={eventDisplayData}
            />
            <VendorTables event={event} />
          </div>
          <Separator />
          <About event={event} />
          <Separator />
          <Location event={event} />
          <Separator />
          <Vendors vendors={vendors} />
          <HostedBy event={event} />
          <VenueMap event={event} />
        </div>
      </div>
      <EventOptions event={event} user={user} />
    </main>
  );
}
