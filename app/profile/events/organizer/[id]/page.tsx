import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import EventsPage from "@/components/events/events-public/EventsPage";

// redirect if not organizer to another page
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const event_id = params.id;
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  const shortFormattedDate = format(new Date(event.date), "EEE, MMM d");
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
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);

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

  console.log(tagsData);

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
            <div className="text-2xl font-semibold">{event.name}</div>
            <div className="flex space-x-3">
              <div className="text-lg text-primary">{shortFormattedDate} </div>
              <span className="text-lg text-white">{event.venue_name}</span>
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
            <DialogTrigger className="w-full">
              <Button className="w-full" variant={"secondary"}>
                Preview Event
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[80%] min-w-full overflow-scroll">
              <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
              </DialogHeader>
              <EventsPage key={event.id} event={event} />
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
