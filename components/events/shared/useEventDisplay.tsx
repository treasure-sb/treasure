import { Tables } from "@/types/supabase";

export const useEventDisplay = (
  events: Tables<"events">[],
  DisplayComponent: any,
  CardComponent: any
) => {
  const mobileView = (
    <div className="space-y-8 md:hidden">
      <DisplayComponent event={events[0]} />
      {events.slice(1).map((event) => (
        <CardComponent
          redirectTo={`/events/${event.cleaned_name}`}
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <DisplayComponent key={`desktop-${event.id}`} event={event} />
      ))}
    </div>
  );

  return { mobileView, desktopView };
};
