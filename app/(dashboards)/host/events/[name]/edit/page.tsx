import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import EditState from "./components/EditState";
import EditEventDetails from "./components/event_details/EditEventDetails";
import { ArrowUpLeft } from "lucide-react";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getEventFromCleanedName } from "@/lib/helpers/events";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { event, eventError } = await getEventFromCleanedName(name);

  if (eventError) {
    redirect("/host/events");
  }

  return (
    <main className="relative">
      <Link
        href={`/host/events/${event.cleaned_name}`}
        className="flex space-x-1 items-center mb-4 group cursor-pointer w-fit"
      >
        <ArrowUpLeft className="group-hover:-translate-x-[0.15rem] group-hover:-translate-y-[0.15rem] transition duration-300" />
        <p className="md:text-lg">Event Tools</p>
      </Link>
      <EditState>
        <EditEventDetails event={event} />
      </EditState>
    </main>
  );
}
