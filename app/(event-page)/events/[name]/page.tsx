import EventPage from "@/app/(event-page)/events/[name]/components/EventPage";
import { redirect } from "next/navigation";
import { getEventFromCleanedName } from "@/lib/helpers/events";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}) {
  const { event, eventError } = await getEventFromCleanedName(params.name);

  if (eventError) {
    return {
      title: "Not Found",
      description: "Event not found",
    };
  }

  return {
    title: event.name,
    description: event.description,
  };
}

export default async function Page({ params }: { params: { name: string } }) {
  const { event, eventError } = await getEventFromCleanedName(params.name);

  if (eventError) {
    redirect("/events");
  }

  return <EventPage key={event.id} event={event} />;
}
