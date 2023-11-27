import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PreviewEvent({ event }: { event: any }) {
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

  const cheapestTicket = event.tickets?.reduce((prev: any, current: any) => {
    return prev.ticket_price < current.ticket_price ? prev : current;
  }, 0);

  return (
    <main className="m-auto w-fit">
      <div className="mt-10 flex flex-col">
        <Image
          className="rounded-xl mb-6"
          alt="event poster image"
          src={
            typeof event.poster_url === "string"
              ? event.poster_url
              : URL.createObjectURL(event.poster_url)
          }
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
            {event.tags?.map((tag: any) => (
              <Button
                className="hover:bg-primary hover:cursor-default"
                key={tag.id}
              >
                {tag.tag_name}
              </Button>
            ))}
          </div>
          {event.tickets && event.tickets.length > 0 ? (
            <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-10 font-bold">
              <h1 className="text-lg">
                Tickets from ${cheapestTicket.ticket_price}
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
                    {event.tickets?.map((ticket: any) => (
                      <div
                        className="flex justify-between items-center"
                        key={ticket.name + ticket.price}
                      >
                        <div>
                          <h1 className="font-semibold text-xl">
                            {ticket.ticket_name} ${ticket.ticket_price}
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
        </div>
        {event.venue_map_url ? (
          <div>
            <h1 className="font-semibold text-2xl my-4">Venue Map</h1>
            <Image
              className="rounded-xl mb-6 lg:mb-0"
              alt="venue map image"
              src={event.venue_map_url}
              width={500}
              height={200}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
