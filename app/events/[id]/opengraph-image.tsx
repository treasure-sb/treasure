import { ImageResponse } from "next/og";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 800,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  // get event and public poster url
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", params.id)
    .single();

  const posterUrl = await getPublicPosterUrl(eventData);
  return new ImageResponse(<img alt="event poster" src={posterUrl} />, size);
}
