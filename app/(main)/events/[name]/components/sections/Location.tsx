import { Tables } from "@/types/supabase";
import { capitalizeSentence } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Location({ event }: { event: Tables<"events"> }) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.address
  )}`;
  return (
    <section>
      <p className="font-semibold text-xl mb-4">Location</p>
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
