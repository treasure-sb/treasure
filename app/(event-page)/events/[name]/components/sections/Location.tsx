import { Tables } from "@/types/supabase";
import { capitalizeSentence } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventWithDates } from "@/types/event";

export default function Location({ event }: { event: EventWithDates }) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.address
  )}`;
  return (
    <section>
      <h3 className="font-semibold text-xl mb-4">Location</h3>
      <p>{capitalizeSentence(event.address)}</p>
      <Link target="_blank" href={googleMapsUrl}>
        <Button
          className="rounded-full tracking-wide mt-4 w-60"
          variant={"secondary"}
        >
          OPEN IN MAPS
        </Button>
      </Link>
    </section>
  );
}
