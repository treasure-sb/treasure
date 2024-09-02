import { EventWithDates } from "@/types/event";

export default function About({ event }: { event: EventWithDates }) {
  return (
    <section className="overflow-hidden">
      <h3 className="font-semibold text-lg mb-2">About</h3>
      <p className="leading-2 whitespace-pre-line text-sm md:text-base text-foreground/80">
        {event.description}
      </p>
    </section>
  );
}
