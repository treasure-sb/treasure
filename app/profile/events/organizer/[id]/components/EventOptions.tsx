import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { EventPreview } from "@/types/event";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";
import PreviewEvent from "@/components/events/shared/PreviewEvent";
import DeleteEventButton from "./DeleteEventButton";
import Link from "next/link";

export default async function EventOptions({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const publicPosterUrl = await getPublicPosterUrl(event);
  const { data: ticketsData, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  const tickets: Tables<"tickets">[] = ticketsData || [];
  const previewTickets =
    tickets?.map((ticket: Tables<"tickets">) => {
      return {
        ticket_name: ticket.name,
        ticket_price: ticket.price,
        ticket_quantity: ticket.quantity,
      };
    }) || [];

  const { data: tagsData, error: tagsError } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

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
      .eq("id", event.id);

    if (!deleteError) {
      redirect("/profile/events");
    }
  };

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Event Options</AccordionTrigger>
      <AccordionContent className="flex flex-col space-y-4 items-center">
        <Link
          className="w-[90%]"
          href={`/profile/events/organizer/${event.cleaned_name}/event-analytics`}
        >
          <Button className="w-full" variant={"ghost"}>
            Event Analytics
          </Button>
        </Link>
        <Link
          className="w-[90%]"
          href={`/profile/events/organizer/${event.cleaned_name}/edit-event`}
        >
          <Button className="w-full" variant={"ghost"}>
            Edit Event
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger className="w-[90%]" asChild>
            <Button variant={"ghost"}>Preview</Button>
          </DialogTrigger>
          <DialogContent className="h-[80%] max-w-xl overflow-scroll scrollbar-hidden">
            <DialogHeader className="text-left">
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <PreviewEvent event={previewEvent} />
          </DialogContent>
        </Dialog>
        <DeleteEventButton handleDelete={handleDelete} />
      </AccordionContent>
    </AccordionItem>
  );
}
