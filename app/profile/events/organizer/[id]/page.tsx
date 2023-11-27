import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PreviewEvent from "@/components/events/create-event/PreviewEvent";

// redirect if not organizer to another page
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const event_id = params.id;
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  // const shortFormattedDate = format(new Date(event?.date), "EEE, MMM d");

  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event?.poster_url);

  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event_id);

  const { data: tagsData, error: tagsError } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event_id);

  const previewTickets = tickets?.map((ticket: any) => {
    return {
      ticket_name: ticket.name,
      ticket_price: ticket.price,
    };
  });

  const previewTags = tagsData?.map((tag: any) => {
    return {
      tag_name: tag.tags.name,
    };
  });

  const previewEvent = {
    name: event?.name,
    date: event?.date,
    start_time: event?.start_time,
    end_time: event?.end_time,
    venue_name: event?.venue_name,
    tags: previewTags,
    tickets: previewTickets,
    address: event?.address,
    description: event?.description,
    poster_url: publicUrl,
    venue_map_url: null,
  };

  return (
    <main className="m-auto w-fit">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <Image
          className="rounded-xl lg:hidden mb-6 lg:mb-0"
          alt="image"
          src={publicUrl}
          width={500}
          height={500}
        />
        <Image
          className="rounded-xl hidden lg:block mb-6 lg:mb-0"
          alt="image"
          src={publicUrl}
          width={600}
          height={600}
        />
        <div className="flex flex-col space-y-6">
          <div>
            <div className="text-2xl font-semibold">{event?.name}</div>
            <div className="flex space-x-3">
              {/* <div className="text-lg text-primary">{shortFormattedDate} </div> */}
              <span className="text-lg text-white">{event?.venue_name}</span>
            </div>
          </div>

          <Link href="">
            <Button className="w-full" variant={"secondary"}>
              Event Analytics
            </Button>
          </Link>
          <Link href="">
            <Button className="w-full" variant={"secondary"}>
              Edit Event
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 h-10 px-4 py-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Preview Event
            </DialogTrigger>
            <DialogContent className="h-[80%] max-w-xl overflow-scroll scrollbar-hidden">
              <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
              </DialogHeader>
              <PreviewEvent event={previewEvent} />
            </DialogContent>
          </Dialog>
          <Link href="">
            <Button className="w-full" variant={"secondary"}>
              Message Guests
            </Button>
          </Link>
          <Link href="">
            <Button className="w-full" variant={"secondary"}>
              Guest List
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
