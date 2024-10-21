"use server";

import {
  BaseEventDisplayData,
  DraftEventDisplayData,
  DraftEventWithDates,
  EditEventDisplayData,
  EditEventWithDates,
  EventDisplayData,
  EventWithDates,
  SearchParams,
} from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  getTagData,
  getUpcomingEventsAttending,
  getPastEventsAttending,
  getUpcomingEventsLiked,
  getPastEventsLiked,
  getUpcomingEventsHosting,
  getPastEventsHosting,
  buildEventsQuery,
} from "./eventsFiltering";
import { formatDates } from "../utils";
import createSupabaseServerClient from "../../utils/supabase/server";

interface FilterFunctions {
  Hosting: (
    page: number,
    userId: string,
    upcoming: boolean
  ) => Promise<EventWithDates[]>;
  Attending: (
    page: number,
    userId: string,
    upcoming: boolean
  ) => Promise<EventWithDates[]>;
  Liked: (
    page: number,
    userId: string,
    upcoming: boolean
  ) => Promise<EventWithDates[]>;
}

const getPublicPosterUrl = async (posterUrl: string) => {
  const supabase = await createSupabaseServerClient();
  let publicPosterUrl = "";
  if (posterUrl) {
    const {
      data: { publicUrl },
    } = await supabase.storage.from("posters").getPublicUrl(posterUrl);
    publicPosterUrl = publicUrl;
  }
  return publicPosterUrl;
};

const getPublicVenueMapUrl = async (venueMapUrl: string | null) => {
  if (!venueMapUrl) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  let publicVenueMapUrl = "";
  if (venueMapUrl) {
    const {
      data: { publicUrl: venueMapPublicUrl },
    } = await supabase.storage.from("venue_maps").getPublicUrl(venueMapUrl);
    publicVenueMapUrl = venueMapPublicUrl;
  }
  return publicVenueMapUrl;
};

const getEventFromCleanedName = async (cleanedName: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("* , dates:event_dates(date, start_time, end_time), event_roles(*)")
    .eq("cleaned_name", cleanedName)
    .order("date", { referencedTable: "dates", ascending: true })
    .single();

  const event: EventWithDates = eventData;
  return { event, eventError };
};

const getEditEventFromCleanedName = async (cleanedName: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select(
      "* , dates:event_dates(id, date, start_time, end_time), event_roles(*)"
    )
    .eq("cleaned_name", cleanedName)
    .order("date", { referencedTable: "dates", ascending: true })
    .single();

  const event: EditEventWithDates = eventData;
  return { event, eventError };
};

const getEventFromId = async (id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("* , dates:event_dates(date, start_time, end_time), event_roles(*)")
    .eq("id", id)
    .order("date", { referencedTable: "dates", ascending: true })
    .single();

  const event: EventWithDates = eventData;
  return { event, eventError };
};

const fetchEventsFromFilters = async (
  page: number,
  searchParams: SearchParams | undefined
): Promise<EventWithDates[]> => {
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
    parseInt(distance || "50")
  );

  return data || [];
};

const fetchHostingEvents = async (
  page: number,
  userId: string,
  upcoming: boolean
) => {
  if (upcoming) {
    const { data } = await getUpcomingEventsHosting(page, userId);
    return data;
  } else {
    const { data } = await getPastEventsHosting(page, userId);
    return data;
  }
};

const fetchAttendingEvents = async (
  page: number,
  userId: string,
  upcoming: boolean
) => {
  if (upcoming) {
    const { data } = await getUpcomingEventsAttending(page, userId);
    return data;
  } else {
    const { data } = await getPastEventsAttending(page, userId);
    return data;
  }
};

const fetchLikedEvents = async (
  page: number,
  userId: string,
  upcoming: boolean
) => {
  if (upcoming) {
    const { data } = await getUpcomingEventsLiked(page, userId);
    return data;
  } else {
    const { data } = await getPastEventsLiked(page, userId);
    return data;
  }
};

const filterFunctions: FilterFunctions = {
  Hosting: fetchHostingEvents,
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
  upcoming: boolean
) => {
  const fetchFunction =
    filter && filter in filterFunctions
      ? filterFunctions[filter as keyof FilterFunctions]
      : fetchAttendingEvents;
  return await fetchFunction(page, user.id, upcoming);
};

const getEventsDisplayData = async (
  page: number,
  searchParams: SearchParams | undefined
) => {
  const events = await fetchEventsFromFilters(page, searchParams);
  return await eventDisplayData(events);
};

const getUserEventsDisplayData = async (
  page: number,
  filter: string | null,
  upcoming: boolean,
  user: Tables<"profiles"> | Tables<"temporary_profiles">
) => {
  const events = await fetchUserEventsFromFilter(page, filter, user, upcoming);
  return await eventDisplayData(events);
};

type EventTypes = EventWithDates | DraftEventWithDates | EditEventWithDates;

const eventDisplayData = async <T extends EventWithDates | DraftEventWithDates>(
  events: T[]
): Promise<
  T extends EventWithDates ? EventDisplayData[] : DraftEventDisplayData[]
> => {
  return Promise.all(
    events.map(async (event) => await getEventDisplayData(event))
  ) as any;
};

const getEventDisplayData = async <T extends EventTypes>(
  event: T
): Promise<
  T extends EditEventWithDates
    ? EditEventDisplayData
    : T extends EventWithDates
    ? EventDisplayData
    : DraftEventDisplayData
> => {
  const publicPosterUrl = await getPublicPosterUrl(event.poster_url);
  const baseDisplayData: BaseEventDisplayData = {
    publicPosterUrl,
    formattedDates: formatDates(event.dates),
  };

  return {
    ...event,
    ...baseDisplayData,
  } as any;
};

export {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  eventDisplayData,
  getEventFromCleanedName,
  getEditEventFromCleanedName,
  getEventFromId,
  getEventDisplayData,
  getEventsDisplayData,
  getUserEventsDisplayData,
};
