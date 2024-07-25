import { ImageResponse } from "next/og";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventFromCleanedName } from "@/lib/helpers/events";

export const runtime = "edge";

export const alt = "Event Poster";
export const size = {
  width: 1200,
  height: 800,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { name: string } }) {
  const supabase = await createSupabaseServerClient();
  const { event, eventError } = await getEventFromCleanedName(params.name);

  const posterUrl = await getPublicPosterUrl(event);
  return new ImageResponse(<img alt="event poster" src={posterUrl} />, size);
}
