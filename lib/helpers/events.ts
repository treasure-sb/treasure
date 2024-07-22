"use server";

import { EventDisplayData, SearchParams } from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  getTagData,
  getUpcomingEventsAttending,
  getPastEventsAttending,
  getEventsApplied,
  getUpcomingEventsLiked,
  getPastEventsLiked,
  getUpcomingEventsHosting,
  getPastEventsHosting,
  buildEventsQuery,
} from "./eventsFiltering";
import { formatDate } from "../utils";
import createSupabaseServerClient from "../../utils/supabase/server";

/**
 * Type definition for the filter functions.
 */
interface FilterFunctions {
  Hosting: (page: number, userId: string, upcoming: boolean) => Promise<any>;
  Applied: (page: number, userId: string, upcoming: boolean) => Promise<any>;
  Attending: (page: number, userId: string, upcoming: boolean) => Promise<any>;
  Liked: (page: number, userId: string, upcoming: boolean) => Promise<any>;
}

const getPublicPosterUrl = async (event: Partial<Tables<"events">>) => {
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

const getPublicPosterUrlFromPosterUrl = async (posterUrl: string) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(posterUrl);
  return publicUrl;
};

const getPublicVenueMapUrl = async (
  event: Tables<"events"> | EventDisplayData,
) => {
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

const getEventFromId = async (id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  const event: Tables<"events"> = eventData;
  return { event, eventError };
};

const fetchEventsFromFilters = async (
  page: number,
  searchParams: SearchParams | undefined,
): Promise<any[]> => {
  const { tag, from, until, city, search, distance } = searchParams || {};

  let tagId: string | undefined;

  if (tag) {
    const { data: tagData } = await getTagData(tag);
    tagId = tagData?.id;
  }

  const { data } = await buildEventsQuery(
    page,
    search,
    tagId,
    from,
    until,
    city,
    parseInt(distance || "50"),
  );

  return data || [];
};

const fetchHostingEvents = async (
  page: number,
  userId: string,
  upcoming: boolean,
) => {
  if (upcoming) {
    const { data } = await getUpcomingEventsHosting(page, userId);
    return data;
  } else {
    const { data } = await getPastEventsHosting(page, userId);
    return data;
  }
};

const fetchAppliedEvents = async (
  page: number,
  userId: string,
  upcoming: boolean,
) => {
  const { data } = await getEventsApplied(page, userId);
  return data?.map((event) => event.events) || [];
};

const fetchAttendingEvents = async (
  page: number,
  userId: string,
  upcoming: boolean,
) => {
  if (upcoming) {
    const { data } = await getUpcomingEventsAttending(page, userId);
    return data?.map((event) => event.events) || [];
  } else {
    const { data } = await getPastEventsAttending(page, userId);
    return data?.map((event) => event.events) || [];
  }
};

const fetchLikedEvents = async (
  page: number,
  userId: string,
  upcoming: boolean,
) => {
  if (upcoming) {
    const { data } = await getUpcomingEventsLiked(page, userId);
    return data?.map((event) => event.events) || [];
  } else {
    const { data } = await getPastEventsLiked(page, userId);
    return data?.map((event) => event.events) || [];
  }
};

const filterFunctions: FilterFunctions = {
  Hosting: fetchHostingEvents,
  Applied: fetchAppliedEvents,
  Attending: fetchAttendingEvents,
  Liked: fetchLikedEvents,
};

/**
 * Fetches events associated with a user based on the specified filter.
 * This function can retrieve events the user is hosting, has applied to, or is attending.
 */
const fetchUserEventsFromFilter = async (
  page: number,
  filter: string | null,
  user: Tables<"profiles"> | Tables<"temporary_profiles">,
  upcoming: boolean,
) => {
  const fetchFunction =
    filter && filter in filterFunctions
      ? filterFunctions[filter as keyof FilterFunctions]
      : fetchAttendingEvents;
  return await fetchFunction(page, user.id, upcoming);
};

/**
 * Fetches event data along with additional details such as public poster URL and formatted date.
 * This data is used for displaying events either as a card or display.
 */
const getEventsDisplayData = async (
  page: number,
  searchParams: SearchParams | undefined,
) => {
  const events: Tables<"events">[] = await fetchEventsFromFilters(
    page,
    searchParams,
  );
  return await eventDisplayData(events);
};

/**
 * Fetches user specific event data along with additional details such as public poster URL and formatted date.
 * This data is used for displaying events either as a card or display.
 */
const getUserEventsDisplayData = async (
  page: number,
  filter: string | null,
  upcoming: boolean,
  user: Tables<"profiles"> | Tables<"temporary_profiles">,
) => {
  const events = await fetchUserEventsFromFilter(page, filter, user, upcoming);
  return await eventDisplayData(events);
};

const eventDisplayData = async (events: any[]) => {
  return Promise.all(
    events.map(
      async (event: Tables<"events">) => await getEventDisplayData(event),
    ),
  );
};

const getEventDisplayData = async (
  event: Tables<"events">,
): Promise<EventDisplayData> => {
  const publicPosterUrl = await getPublicPosterUrl(event);
  return {
    ...event,
    publicPosterUrl,
    formattedDate: formatDate(event.date),
  };
};

export {
  getPublicPosterUrl,
  getPublicPosterUrlFromPosterUrl,
  getPublicVenueMapUrl,
  eventDisplayData,
  getEventFromCleanedName,
  getEventFromId,
  getEventDisplayData,
  getEventsDisplayData,
  getUserEventsDisplayData,
};
