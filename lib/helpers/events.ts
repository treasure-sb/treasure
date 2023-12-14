import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "../../utils/supabase/server";

const getPublicPosterUrl = async (event: Tables<"events">) => {
  const supabase = await createSupabaseServerClient();
  let publicPosterUrl = "";
  if (event.poster_url) {
    const {
      data: { publicUrl },
    } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);
    publicPosterUrl = publicUrl;
  }
  return publicPosterUrl;
};

const getPublicVenueMapUrl = async (event: Tables<"events">) => {
  const supabase = await createSupabaseServerClient();
  let publicVenueMapUrl = "";
  if (event.venue_map_url) {
    const {
      data: { publicUrl: venueMapPublicUrl },
    } = await supabase.storage
      .from("venue_maps")
      .getPublicUrl(event.venue_map_url);
    publicVenueMapUrl = venueMapPublicUrl;
  }
  return publicVenueMapUrl;
};

const formatStartTime = (startTime: string) => {
  const parsedStartTime = startTime.split(":");
  const formattedStartTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(
    new Date(
      0,
      0,
      0,
      parseInt(parsedStartTime[0]),
      parseInt(parsedStartTime[1])
    )
  );
  return formattedStartTime;
};

const formatDate = (date: string) => {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return formattedDate;
};

const getEventFromCleanedName = async (cleanedName: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", cleanedName)
    .single();

  const event: Tables<"events"> = eventData;
  return { event, eventError };
};

export {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  formatStartTime,
  getEventFromCleanedName,
  formatDate,
};
