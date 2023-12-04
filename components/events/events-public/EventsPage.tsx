import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tables } from "@/types/supabase";
import {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  formatStartTime,
  formatDate,
} from "@/utils/helpers/events";
import Link from "next/link";
import { getTicketTailorCheckoutUrl } from "@/lib/actions/ticket-tailor";
import { Separator } from "@/components/ui/separator";
import Map from "@/components/places/Map";

export default async function EventsPage({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const publicPosterUrl = await getPublicPosterUrl(event);
  const publicVenueMapUrl = await getPublicVenueMapUrl(event);
  const formattedDate = formatDate(event.date);
  const formattedStartTime = formatStartTime(event.start_time);

  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);
  const cheapestTicket = tickets?.reduce((prev, cur) => {
    return prev.price < cur.price ? prev : cur;
  }, 0);

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", event.organizer_id)
    .single();

  const { data: tagsData, error: tagsError } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

  // avatars for organizer and vendors
  const {
    data: { publicUrl: organizerPublicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);

  // @ts-ignore
  const vendors = event.profiles;
  const vendorsWithPublicUrls = await Promise.all(
    vendors.map(async (vendor: any) => {
      let {
        data: { publicUrl: vendorPublicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(vendor.avatar_url);
      return {
        ...vendor,
        vendorPublicUrl,
      };
    })
  );

  const checkoutURL = await getTicketTailorCheckoutUrl(
    event.ticket_tailor_event_id === null ? "" : event.ticket_tailor_event_id
  );

  const capitalize = (address: string) => {
    const words = address.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  return (
    <main className="relative w-full md:w-fit m-auto">
      <div className="mt-10 flex flex-col md:flex-row md:space-x-10">
        <div className="relative md:max-w-md">
          <Image
            className="rounded-xl mb-6 lg:mb-0 m-auto"
            alt="event poster image"
            src={publicPosterUrl}
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col lg:flex-col text-left max-w-lg md:max-w-sm mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold">{event.name}</h1>
            <div>
              <h1 className="font-semibold">{event.venue_name}</h1>
              <h1 className="text-tertiary">
                {formattedDate} at {formattedStartTime}
              </h1>
            </div>
            <div className="w-full">
              {tagsData ? (
                <div className="flex gap-2 w-full flex-wrap">
                  {tagsData.map((tag: any) => (
                    <Button
                      className="hover:bg-tertiary bg-tertiary hover:cursor-default h-8"
                      key={tag.id}
                    >
                      {tag.tags.name}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
            {tickets && tickets.length > 0 ? (
              <div className="bg-secondary w-full lg:w-96 h-20 items-center rounded-md flex justify-between px-5 font-bold">
                <h1 className="text-lg">
                  Tickets from ${cheapestTicket.price}
                </h1>
                <Dialog>
                  <DialogTrigger className="bg-primary h-[70%] w-24 rounded-md text-background text-md">
                    Buy Now
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-2xl p-4 mb-6 text-center border-b-2">
                        Tickets
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                      {tickets?.map((ticket: any) => (
                        <div
                          key={ticket.id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <h1 className="font-semibold text-xl">
                              {ticket.name} ${ticket.price}
                            </h1>
                          </div>
                          <Link target="_blank" href={checkoutURL}>
                            <Button>Buy Now!</Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <h1>No Tickets</h1>
            )}
            <Separator />
            <div>
              <h1 className="font-semibold text-2xl">About</h1>
              <p>{event.description}</p>
            </div>
            <Separator />
            <div>
              <h1 className="font-semibold text-2xl">Vendors</h1>
              <div className="flex flex-col gap-4 flex-wrap max-h-80 smScrollbar-hidden overflow-scroll py-3 md:overflow-auto">
                {vendorsWithPublicUrls && vendorsWithPublicUrls.length > 0 ? (
                  vendorsWithPublicUrls.map((vendor: any) => (
                    <Link key={vendor.id} href={`/users/${vendor.id}`}>
                      <div className="flex flex-col gap-1 justify-center align-middle">
                        <div className="h-28 w-28 m-auto rounded-full overflow-hidden">
                          <Image
                            className="block w-full h-full object-cover"
                            alt="avatar"
                            src={vendor.vendorPublicUrl}
                            width={100}
                            height={100}
                          />
                        </div>
                        <h1 className="text-center text-sm">
                          @{vendor.instagram}
                        </h1>
                      </div>
                    </Link>
                  ))
                ) : (
                  <h1 className="text-center text-sm">Vendors Coming Soon!</h1>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <h1 className="font-semibold text-2xl">Hosted By</h1>
              <div className="h-40 overflow-hidden justify-end mt-4">
                <Link href={`/users/${user.id}`}>
                  <div className="flex flex-col gap-2 text-center">
                    <div className="h-28 w-28 rounded-full overflow-hidden m-auto">
                      <Image
                        className="block w-full h-full object-cover"
                        alt="avatar"
                        src={organizerPublicUrl}
                        width={100}
                        height={100}
                      />
                    </div>
                    <p className="text-sm w-auto">@{user.instagram}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
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
            <Link
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.address
              )}`}
            >
              {capitalize(event.address)}
            </Link>
            <Map lat={event.lat} lng={event.lng} />
          </div>
        </div>
      </div>
    </main>
  );
}
