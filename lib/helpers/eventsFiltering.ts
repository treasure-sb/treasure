"use server";

import createSupabaseServerClient from "../../utils/supabase/server";
import format from "date-fns/format";

const today = format(new Date(), "yyyy-MM-dd");
const numEvents = 12;
const numUserEvents = 6;

/**
 * Retrieves the ID of a tag based on its name.
 */
const getTagData = async (tagName: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id")
    .eq("name", tagName)
    .single();
  return { data, error };
};

/**
 * Fetches event data filtered by a specific tag, date range, and page number.
 * Designed for events that match both a tag and a date range.
 */
const getDateTagEventData = async (
  search: string,
  tagId: string,
  from: string,
  until: string,
  page: number
) => {
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_tags!inner(*)")
    .ilike("name", `%${search}%`)
    .order("featured", { ascending: false })
    .order("date", { ascending: true })
    .order("id", { ascending: true })
    .range(startIndex, endIndex)
    .gte("date", from)
    .lte("date", until)
    .eq("event_tags.tag_id", tagId);

  return { data, error };
};

/**
 * Fetches event data filtered by a date range and page number.
 * @param {string} search - Search term for event names.
 * @param {string} from - Start date for the range.
 * @param {string} until - End date for the range.
 * @param {number} page - Page number for pagination.
 * @returns An array of events or an error if occurred.
 */
const getEventDataByDate = async (
  search: string,
  from: string,
  until: string,
  page: number
) => {
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .ilike("name", `%${search}%`)
    .order("featured", { ascending: false })
    .order("date", { ascending: true })
    .order("id", { ascending: true })
    .range(startIndex, endIndex)
    .gte("date", from)
    .lte("date", until);
  return { data, error };
};

/**
 * Fetches event data filtered by a specific tag and page number.
 */
const getEventDataByTag = async (
  search: string,
  tagId: string,
  page: number
) => {
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_tags!inner(*)")
    .gte("date", today)
    .ilike("name", `%${search}%`)
    .order("featured", { ascending: false })
    .order("date", { ascending: true })
    .order("id", { ascending: true })
    .range(startIndex, endIndex)
    .eq("event_tags.tag_id", tagId);
  return { data, error };
};

/**
 * Fetches all event data based on a search term and page number.
 */
const getAllEventData = async (search: string, page: number) => {
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .ilike("name", `%${search}%`)
    .order("featured", { ascending: false })
    .order("date", { ascending: true })
    .order("id", { ascending: true })
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Fetches events that a user is attending.
 * This function queries the 'event_guests' table to retrieve events based on the guest's user ID.
 */
const getEventsAttending = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numEvents - 1;
  const { data, error } = await supabase
    .from("event_guests")
    .select("events(*)")
    .eq("guest_id", userId)
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Fetches upcoming events that a user is attending.
 * This function queries the 'event_guests' table to retrieve events based on the guest's user ID.
 */
const getUpcomingEventsAttending = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data: attendeeData, error: attendeeError } = await supabase
    .from("event_tickets")
    .select("events!inner(*)")
    .eq("attendee_id", userId)
    .gte("events.date", today)
    .order("id", { foreignTable: "events", ascending: true })
    .order("date", { foreignTable: "events", ascending: true });
  // .range(startIndex, endIndex);

  // filter out the duplicate events
  let eventNameList: string[] = [];
  let filteredData: any[] = [];

  attendeeData?.map((event: any) => {
    if (!eventNameList.includes(event.events.name as string)) {
      eventNameList.push(event.events.name);
      filteredData.push(event);
    }
  });

  const { data: vendorData, error: vendorError } = await supabase
    .from("event_vendors")
    .select("events!inner(*)")
    .eq("vendor_id", userId)
    .eq("payment_status", "PAID")
    .gte("events.date", today)
    .order("id", { foreignTable: "events", ascending: true })
    .order("date", { foreignTable: "events", ascending: true })
    .range(startIndex, endIndex);

  let data = filteredData;
  let error = attendeeError;

  if (vendorData && vendorData?.length > 0) {
    data = vendorData;
    error = vendorError;
  } else if (page > 1) {
    data = [];
    error = null;
  }
  return { data, error };
};

/**
 * Fetches upcoming events that a user has liked.
 * This function queries the 'event_likes' table to retrieve events based on the guest's user ID.
 */
const getUpcomingEventsLiked = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("event_likes")
    .select("events!inner(*)")
    .eq("user_id", userId)
    .gte("events.date", today)
    .order("events(date)", { ascending: true })
    .order("events(id)", { ascending: true })
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Fetches upcoming events that a user has liked.
 * This function queries the 'event_likes' table to retrieve events based on the guest's user ID.
 */
const getUpcomingEventsHosting = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userId)
    .gte("date", today)
    .order("date", { ascending: true })
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Fetches past events that a user attended.
 * This function queries the 'event_guests' table to retrieve events based on the guest's user ID.
 */
const getPastEventsAttending = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data: attendeeData, error: attendeeError } = await supabase
    .from("event_tickets")
    .select("events!inner(*)")
    .eq("attendee_id", userId)
    .lt("events.date", today)
    .order("events(date)", { ascending: false })
    .order("events(id)", { ascending: true });
  // .range(startIndex, endIndex);

  // filter out the duplicate events
  let eventNameList: string[] = [];
  let filteredData: any[] = [];

  attendeeData?.map((event: any) => {
    if (!eventNameList.includes(event.events.name as string)) {
      eventNameList.push(event.events.name);
      filteredData.push(event);
    }
  });

  const { data: vendorData, error: vendorError } = await supabase
    .from("event_vendors")
    .select("events!inner(*)")
    .eq("vendor_id", userId)
    .eq("payment_status", "PAID")
    .lt("events.date", today)
    .order("id", { foreignTable: "events", ascending: true })
    .order("date", { foreignTable: "events", ascending: true })
    .range(startIndex, endIndex);

  let data = filteredData;
  let error = attendeeError;

  if (vendorData && vendorData?.length > 0) {
    data = vendorData;
    error = vendorError;
  } else if (page > 1) {
    data = [];
    error = null;
  }

  return { data, error };
};

/**
 * Fetches past events that a user has liked.
 * This function queries the 'event_likes' table to retrieve events based on the guest's user ID.
 */
const getPastEventsLiked = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("event_likes")
    .select("events!inner(*)")
    .eq("user_id", userId)
    .lt("events.date", today)
    .order("events(date)", { ascending: false })
    .order("events(id)", { ascending: true })
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Fetches past events that a user has liked.
 * This function queries the 'event_likes' table to retrieve events based on the guest's user ID.
 */
const getPastEventsHosting = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userId)
    .lt("date", today)
    .order("date", { ascending: true })
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Retrieves events for which the user has applied as a vendor.
 * This function queries the 'vendor_applications' table to get events based on the vendor's user ID.
 */
const getEventsApplied = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("vendor_applications")
    .select("events(*)")
    .eq("vendor_id", userId)
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Fetches events that a user is hosting.
 * This function queries the 'events' table to retrieve events based on the organizer's user ID.
 */
const getEventsHosting = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userId)
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Fetches events that a user likes.
 * This function queries the 'events' table to retrieve events based on the user's ID.
 */
const getEventsLiked = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("event_likes")
    .select("events(*)")
    .eq("user_id", userId)
    .range(startIndex, endIndex);
  return { data, error };
};

export {
  getTagData,
  getDateTagEventData,
  getUpcomingEventsAttending,
  getPastEventsAttending,
  getUpcomingEventsLiked,
  getUpcomingEventsHosting,
  getPastEventsHosting,
  getPastEventsLiked,
  getEventDataByDate,
  getEventDataByTag,
  getAllEventData,
  getEventsAttending,
  getEventsApplied,
  getEventsHosting,
  getEventsLiked,
};
