import Image from "next/image";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";

export default async function EventImage({
  event,
}: {
  event: Partial<Tables<"events">>;
}) {
  const publicUrl = await getPublicPosterUrl(event);

  return (
    <>
      <Image
        className="object-cover h-full w-full rounded-md"
        alt="image"
        src={publicUrl}
        width={200}
        height={200}
      />
    </>
  );
}
