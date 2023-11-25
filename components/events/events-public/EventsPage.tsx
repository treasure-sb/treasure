import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function EventsPage({ event }: { event: any }) {
  const supabase = await createSupabaseServerClient();
  const event_id = event.id;

  const formattedDate = format(new Date(event.date), "EEE, MMMM do");
  const formattedStartTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(
    new Date(
      0,
      0,
      0,
      event.start_time.split(":")[0],
      event.start_time.split(":")[1]
    )
  );

  const {
    data: { publicUrl: posterPublicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);

  const {
    data: { publicUrl: venueMapPublicUrl },
  } = await supabase.storage
    .from("venue_maps")
    .getPublicUrl(event.venue_map_url);

  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event_id);

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", event.organizer_id)
    .single();

  const { data: tagsData, error: tagsError } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event_id);

  const cheapestTicket = tickets?.reduce((prev, cur) => {
    return prev.price < cur.price ? prev : cur;
  }, 0);

  return (
    <main className="m-auto w-fit">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <Image
          className="rounded-xl mb-6 lg:mb-0"
          alt="event poster image"
          src={posterPublicUrl}
          width={500}
          height={500}
        />
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold">{event.name}</h1>
          <div>
            <h1 className="font-semibold">{event.venue_name}</h1>
            <h1 className="text-yellow-300">
              {formattedDate} at {formattedStartTime}
            </h1>
          </div>
          <div className="flex space-x-2">
            {tagsData?.map((tag: any) => (
              <Button className="hover:bg-primary hover:cursor-default">
                {tag.tags.name}
              </Button>
            ))}
          </div>
          {tickets && tickets.length > 0 ? (
            <div className="bg-secondary w-full lg:w-96 h-20 items-center rounded-md flex justify-between px-10 font-bold">
              <h1 className="text-lg">Tickets from ${cheapestTicket.price}</h1>
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
                      <div className="flex justify-between items-center">
                        <div>
                          <h1 className="font-semibold text-xl">
                            {ticket.name} ${ticket.price}
                          </h1>
                        </div>
                        <Button>Buy Now!</Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <h1>No Tickets</h1>
          )}
          <h1>{event.address}</h1>
          <div>
            <h1 className="font-semibold text-2xl">About</h1>
            <p>{event.description}</p>
          </div>
          <div>
            <h1 className="font-semibold text-2xl">Vendors</h1>
            <h1>Vendors list goes here</h1>
          </div>
          <div>
            <h1 className="font-semibold text-2xl">Hosted By</h1>
            <h1>{user.email}</h1>
          </div>
        </div>
      </div>
      {event.venue_map_url ? (
        <div>
          <h1 className="font-semibold text-2xl my-4">Venue Map</h1>
          <Image
            className="rounded-xl mb-6 lg:mb-0"
            alt="venue map image"
            src={venueMapPublicUrl}
            width={500}
            height={200}
          />
        </div>
      ) : null}
    </main>
  );
}
