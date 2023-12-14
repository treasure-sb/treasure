import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { formatDate } from "@/lib/helpers/events";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import { validateUser } from "@/lib/actions/auth";
import AttendeesOptions from "./AttendeesOptions";
import EventOptions from "./EventOptions";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", params.id)
    .single();

  if (eventError) {
    redirect("/events");
  }

  const event: Tables<"events"> = data;

  const {
    data: { user },
  } = await validateUser();
  if (!user) {
    redirect("/events");
  }

  // redirect if user is not organizer or admin
  const profile = await getProfile(user.id);
  if (event.organizer_id !== user.id && profile.role !== "admin") {
    redirect("/events");
  }

  const shortFormattedDate = formatDate(event.date);
  const publicPosterUrl = await getPublicPosterUrl(event);

  return (
    <main className="m-auto max-w-fit lg:max-w-6xl">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
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
        <div className="flex flex-col space-y-6 lg:w-96">
          <div>
            <div className="text-2xl font-semibold">{event.name}</div>
            <div className="flex space-x-3">
              <div className="text-lg text-primary">{shortFormattedDate} </div>
              <span className="text-lg text-white">{event.venue_name}</span>
            </div>
          </div>
          <Accordion type="multiple">
            <EventOptions event={event} />
            <AttendeesOptions event={event} />
          </Accordion>
        </div>
      </div>
    </main>
  );
}
