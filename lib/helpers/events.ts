"use server";

import { SearchParams, EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import {
  getTagData,
  getAllEventData,
  getEventDataByDate,
  getDateTagEventData,
  getEventDataByTag,
  getEventsHosting,
  getEventsApplied,
  getEventsAttending,
  getEventsLiked,
} from "./eventsFiltering";
import createSupabaseServerClient from "../../utils/supabase/server";

/**
 * Type definition for the filter operations.
 */
type FetchOperation = (
  page: number,
  searchParams: SearchParams | undefined
) => Promise<any[]>;

/**
 * Type definition for the filter functions.
 */
interface FilterFunctions {
  Hosting: (page: number, userId: string) => Promise<any>;
  Applied: (page: number, userId: string) => Promise<any>;
  Attending: (page: number, userId: string) => Promise<any>;
  Liked: (page: number, userId: string) => Promise<any>;
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

/**
 * Formats the start time of an event into a user-friendly string.
 *
 * @param {string} startTime - The start time of the event in HH:MM format.
 * @returns {string} - Formatted start time in a 12-hour format with AM/PM.
 */
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

/**
 * Converts a date string into a more readable format.
 *
 * @param {string} date - The date string to format.
 * @returns {string} - The formatted date string, showing weekday, day, and month.
 */
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

const fetchDateAndTagEvents: FetchOperation = async (page, searchParams) => {
  const { tag, from, until, search = "" } = searchParams || {};
  const { data: tagData } = await getTagData(tag!);
  const { data } = await getDateTagEventData(
    search,
    tagData?.id!,
    from!,
    until!,
    page
  );
  return data || [];
};

const fetchDateEvents: FetchOperation = async (page, searchParams) => {
  const { from, until, search = "" } = searchParams || {};
  const { data } = await getEventDataByDate(search, from!, until!, page);
  return data || [];
};

const fetchTagEvents: FetchOperation = async (page, searchParams) => {
  const { tag, search = "" } = searchParams || {};
  const { data: tagData } = await getTagData(tag!);
  const { data } = await getEventDataByTag(search, tagData?.id!, page);
  return data || [];
};

const fetchDefaultEvents: FetchOperation = async (page, searchParams) => {
  const { search = "" } = searchParams || {};
  const { data } = await getAllEventData(search, page);
  return data || [];
};

/**
 * Determines which fetch operation to use based on the provided search parameters and executes it.
 * @param {number} page - The current page number for pagination.
 * @param {SearchParams | undefined} searchParams - Optional search parameters to filter events.
 * @returns {Promise<any[]>} - A promise that resolves to an array of events based on the filter criteria.
 */
const fetchEventsFromFilters = async (
  page: number,
  searchParams: SearchParams | undefined
): Promise<any[]> => {
  const { tag, from, until } = searchParams || {};

  let operation: FetchOperation;

  if (from && until && tag) {
    operation = fetchDateAndTagEvents;
  } else if (from && until) {
    operation = fetchDateEvents;
  } else if (tag) {
    operation = fetchTagEvents;
  } else {
    operation = fetchDefaultEvents;
  }

  return await operation(page, searchParams);
};

const fetchHostingEvents = async (page: number, userId: string) => {
  const { data } = await getEventsHosting(page, userId);
  return data || [];
};

const fetchAppliedEvents = async (page: number, userId: string) => {
  const { data } = await getEventsApplied(page, userId);
  return data?.map((event) => event.events) || [];
};

const fetchAttendingEvents = async (page: number, userId: string) => {
  const { data } = await getEventsAttending(page, userId);
  return data?.map((event) => event.events) || [];
};

const fetchLikedEvents = async (page: number, userId: string) => {
  const { data } = await getEventsLiked(page, userId);
  return data?.map((event) => event.events) || [];
};

/**
 * Map of filter functions for different event types.
 */
const filterFunctions: FilterFunctions = {
  Hosting: fetchHostingEvents,
  Applied: fetchAppliedEvents,
  Attending: fetchAttendingEvents,
  Liked: fetchLikedEvents,
};

/**
 * Fetches events associated with a user based on the specified filter.
 * This function can retrieve events the user is hosting, has applied to, or is attending.
 *
 * @param {number} page - The page number for pagination, determining which set of events to fetch.
 * @param {string | null} filter - The filter criteria ('Hosting', 'Applied', or null for 'Attending').
 * @param {Tables<"profiles"> | Tables<"temporary_profiles">} user - The user object, typically containing user identification information or temporary profile.
 * @returns {Promise<any[]>} - A promise that resolves to an array of events based on the filter criteria.
 */
const fetchUserEventsFromFilter = async (
  page: number,
  filter: string | null,
  user: Tables<"profiles"> | Tables<"temporary_profiles">
) => {
  const fetchFunction =
    filter && filter in filterFunctions
      ? filterFunctions[filter as keyof FilterFunctions]
      : fetchAttendingEvents;
  return await fetchFunction(page, user.id);
};

/**
 * Fetches event data along with additional details such as public poster URL and formatted date.
 * This data is used for displaying events either as a card or display.
 *
 * @param {number} page - The page number for pagination.
 * @param {SearchParams | undefined} searchParams - Optional search parameters to filter events.
 * @returns {Promise<EventDisplayData[]>} - A promise that resolves to an array of events with additional details.
 */
const getEventsDisplayData = async (
  page: number,
  searchParams: SearchParams | undefined
) => {
  const events: Tables<"events">[] = await fetchEventsFromFilters(
    page,
    searchParams
  );
  return Promise.all(
    events.map(async (event: Tables<"events">) => {
      const publicPosterUrl = await getPublicPosterUrl(event);
      return {
        ...event,
        publicPosterUrl,
        formattedDate: formatDate(event.date),
      };
    })
  );
};

/**
 * Fetches user specific event data along with additional details such as public poster URL and formatted date.
 * This data is used for displaying events either as a card or display.
 *
 * @param {number} page - The page number for pagination.
 * @param {string | null} filter - The filter criteria ('Hosting', 'Applied', or null for 'Attending').
 * @param {Tables<"profiles"> | Tables<"temporary_profiles">} user - The user object, typically containing user identification information or temporary profile.
 * @returns {Promise<EventDisplayData[]>} - A promise that resolves to an array of events with additional details.
 */
const getUserEventsDisplayData = async (
  page: number,
  filter: string | null,
  user: Tables<"profiles"> | Tables<"temporary_profiles">
) => {
  const events = await fetchUserEventsFromFilter(page, filter, user);
  return Promise.all(
    events.map(async (event: Tables<"events">) => {
      const publicPosterUrl = await getPublicPosterUrl(event);

      return {
        ...event,
        publicPosterUrl,
        formattedDate: formatDate(event.date),
      };
    })
  );
};

export {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  formatStartTime,
  getEventFromCleanedName,
  formatDate,
  getEventsDisplayData,
  getUserEventsDisplayData,
};
