import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PreviewEvent from "@/components/events/shared/PreviewEvent";
import { Tables } from "@/types/supabase";
import { EventPreview } from "@/types/event";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteEventButton from "@/components/events/organizer/DeleteEventButton";

// redirect if not organizer to another page
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const event_id = params.id;
  const { data, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  const event: Tables<"events"> = data;
  const shortFormattedDate = format(new Date(event.date), "EEE, MMM d");
  let publicPosterUrl = "";
  if (event.poster_url) {
    const {
      data: { publicUrl },
    } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);
    publicPosterUrl = publicUrl;
  }

  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event_id);

  const { data: tagsData, error: tagsError } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event_id);

  const previewTickets =
    tickets?.map((ticket: any) => {
      return {
        ticket_name: ticket.name,
        ticket_price: ticket.price,
        ticket_quantity: ticket.quantity,
      };
    }) || [];

  const previewTags =
    tagsData?.map((tag: any) => {
      return {
        tag_id: tag.tags.id,
        tag_name: tag.tags.name,
      };
    }) || [];

  const previewEvent: EventPreview = {
    name: event.name,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    venue_name: event.venue_name,
    tags: previewTags,
    tickets: previewTickets,
    address: event.address,
    description: event.description,
    poster_url: publicPosterUrl,
    venue_map_url: null,
  };

  const handleDelete = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    if (event.poster_url && event.poster_url !== "poster_coming_soon") {
      await supabase.storage.from("posters").remove([event.poster_url]);
    }

    if (
      event.venue_map_url &&
      event.venue_map_url !== "venue_map_coming_soon"
    ) {
      await supabase.storage.from("venue_maps").remove([event.venue_map_url]);
    }

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", event_id);

    if (!deleteError) {
      redirect("/profile/events");
    }
    console.log("hello");
  };

  return (
    <main className="m-auto w-fit">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        {event.poster_url ? (
          <>
            <Image
              className="rounded-xl lg:hidden mb-6 lg:mb-0"
              alt="image"
              src={publicPosterUrl}
              width={500}
              height={500}
            />
            <Image
              className="rounded-xl hidden lg:block mb-6 lg:mb-0"
              alt="image"
              src={publicPosterUrl}
              width={600}
              height={600}
            />
          </>
        ) : null}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="text-2xl font-semibold">{event.name}</div>
            <div className="flex space-x-3">
              <div className="text-lg text-primary">{shortFormattedDate} </div>
              <span className="text-lg text-white">{event.venue_name}</span>
            </div>
          </div>

          <Link href={`/profile/events/organizer/${event.id}/event-analytics`}>
            <Button className="w-full" variant={"secondary"}>
              Event Analytics
            </Button>
          </Link>
          <Link href={`/profile/events/organizer/${event.id}/edit-event`}>
            <Button className="w-full" variant={"secondary"}>
              Edit Event
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>Preview</Button>
            </DialogTrigger>
            <DialogContent className="h-[80%] max-w-xl overflow-scroll scrollbar-hidden">
              <DialogHeader className="text-left">
                <DialogTitle>Preview</DialogTitle>
              </DialogHeader>
              <PreviewEvent event={previewEvent} />
            </DialogContent>
          </Dialog>
          <Link href={`/profile/events/organizer/${event.id}/message`}>
            <Button className="w-full" variant={"secondary"}>
              Message Guests
            </Button>
          </Link>
          <Link href="">
            <Button className="w-full" variant={"secondary"}>
              Guest List
            </Button>
          </Link>
          <Link href={`/profile/events/organizer/${event.id}/vendor-list`}>
            <Button className="w-full" variant={"secondary"}>
              Vendor List
            </Button>
          </Link>
          <DeleteEventButton handleDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}
