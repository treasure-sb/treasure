import Image from "next/image";
import { Tables } from "@/types/supabase";
import {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  formatStartTime,
  formatDate,
} from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/lib/helpers/profiles";
import Link from "next/link";
import Tickets from "./Tickets";
import Tags from "./Tags";
import VendorTables from "./VendorTables";
import Vendors from "./Vendors";
import HostedBy from "./HostedBy";
import ColorThief from "./ColorThief";
import createSupabaseServerClient from "@/utils/supabase/server";
import EditEvent from "@/components/icons/EditEvent";
import DuplicateEvent from "@/components/icons/DuplicateEvent";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EventsPage({
  event,
}: {
  event: Tables<"events">;
}) {
  const {
    data: { user },
  } = await validateUser();

  const [profile, publicPosterUrl, publicVenueMapUrl] = await Promise.all([
    getProfile(user?.id),
    getPublicPosterUrl(event),
    getPublicVenueMapUrl(event),
  ]);

  const formattedDate = formatDate(event.date);
  const formattedStartTime = formatStartTime(event.start_time);
  const organizer = event.organizer_id === user?.id ? true : false;
  const capitalize = (address: string) => {
    const words = address.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  const supabase = await createSupabaseServerClient();

  // get event info for admin to send to create event page
  let eventInfo;
  if (profile.role === "admin") {
    const { data: tagsData, error: tagsError } = await supabase
      .from("event_tags")
      .select("tags(name,id)")
      .eq("event_id", event.id);

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
  }

  // check to see if user is attending, if they are then show button as attending
  const { data: attendingData, error: attendingError } = await supabase
    .from("event_guests")
    .select("*")
    .eq("event_id", event.id)
    .eq("guest_id", user?.id)
    .single();

  const handleAttending = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await validateUser();
    if (!user) {
      redirect("/login");
    }
    console.log("attendingData", attendingData);
    if (attendingData) {
      await supabase
        .from("event_guests")
        .delete()
        .eq("event_id", event.id)
        .eq("guest_id", user.id);
      revalidatePath(`/events/${event.cleaned_name}`);
    } else {
      await supabase
        .from("event_guests")
        .insert([{ guest_id: user.id, event_id: event.id }]);
      revalidatePath(`/events/${event.cleaned_name}`);
    }
  };

  return (
    <main className="w-full lg:w-fit m-auto">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <div className="relative lg:sticky lg:top-0 h-fit max-w-lg mx-auto lg:pt-8">
          <Image
            className="rounded-xl mb-6 lg:mb-0 m-auto"
            alt="event poster image"
            src={publicPosterUrl}
            width={500}
            height={500}
            priority
          />
          <ColorThief public_url={publicPosterUrl} />
        </div>
        <div className="flex flex-col text-left max-w-lg lg:max-w-xl mx-auto space-y-8">
          <h1 className="text-4xl font-semibold">{event.name}</h1>
          <div>
            <h1 className="font-semibold">{event.venue_name}</h1>
            <h1 className="text-tertiary">
              {formattedDate} at {formattedStartTime}
            </h1>
          </div>
          <Tags event={event} />
          <div className="space-y-2">
            <Tickets event={event} user={user} />
            <VendorTables event={event} />
          </div>
          <Separator />
          <div>
            <h1 className="font-semibold text-2xl">About</h1>
            <p className="leading-8">{event.description}</p>
          </div>
          <Separator />
          <Vendors event={event} />
          <HostedBy event={event} />
          <Separator />
          {event.venue_map_url ? (
            <>
              <div className="font-semibold text-2xl my-4 w-full">
                Venue Map
              </div>
              <Image
                className="rounded-xl mb-6 lg:mb-0"
                alt="venue map image"
                src={publicVenueMapUrl}
                width={500}
                height={200}
              />
            </>
          ) : null}
          <Separator />
          <div>
            <h1 className="font-semibold text-2xl">Location</h1>
            <p>{capitalize(event.address)}</p>
            <Link
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.address
              )}`}
            >
              <Button
                className="rounded-full tracking-wide mt-4 w-60"
                variant={"secondary"}
              >
                OPEN IN MAPS
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="fixed right-6 bottom-6 flex flex-col space-y-4 items-end">
        {profile.role === "admin" && (
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
        )}
        {(organizer || profile.role === "admin") && (
          <Link href={`/profile/events/organizer/${event.cleaned_name}`}>
            <div className="opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
              <EditEvent />
            </div>
          </Link>
        )}
        {attendingData ? (
          <form action={handleAttending} className="h-[70%]">
            <Button className="opacity-70 hover:opacity-50 bg-primary w-fit text-background text-md font-bold active:bg-white">
              Attending ✔
            </Button>
          </form>
        ) : (
          <form action={handleAttending} className="h-[70%]">
            <Button className="hover:opacity-70 bg-tertiary hover:bg-tertiary h-full w-fit text-background text-md font-bold">
              Not Attending
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
