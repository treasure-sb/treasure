import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const event_id = params.id;
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

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
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold">{event.name}</h1>
          <div>
            <h1 className="font-semibold">{event.venue_name}</h1>
            <h1 className="text-yellow-300">
              {formattedDate} at {formattedStartTime}
            </h1>
          </div>
          <div>
            <h1>Tags go here</h1>
          </div>
          <div>
            {tickets?.map((ticket) => (
              <h3>
                ${ticket.price} {ticket.name}
              </h3>
            ))}
          </div>
          <h1>City, State</h1>
          <div>
            <h1 className="font-semibold text-2xl">About</h1>
            <p>{event.description}</p>
          </div>
          <div>
            <h1 className="font-semibold text-2xl">Vendors</h1>
            <h1>Vendors list goes here</h1>
          </div>
          <Button className="mt-6 w-full">Edit Event</Button>
        </div>
      </div>
    </main>
  );
}
