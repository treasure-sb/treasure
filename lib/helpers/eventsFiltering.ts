"use server";

import createSupabaseServerClient from "../../utils/supabase/server";
import format from "date-fns/format";

const today = format(new Date(), "yyyy-MM-dd");
const numEvents = 6;

/**
 * Retrieves the ID of a tag based on its name.
 * @param {string} tagName - The name of the tag.
 * @returns An object containing the ID of the tag or an error if occurred.
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
 * @param {string} search - Search term for event names.
 * @param {string} tagId - The ID of the tag to filter by.
 * @param {string} from - Start date for the range.
 * @param {string} until - End date for the range.
 * @param {number} page - Page number for pagination.
 * @returns An array of events or an error if occurred.
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
 * @param {string} search - Search term for event names.
 * @param {string} tagId - The ID of the tag to filter by.
 * @param {number} page - Page number for pagination.
 * @returns An array of events or an error if occurred.
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
 * @param {string} search - Search term for event names.
 * @param {number} page - Page number for pagination.
 * @returns An array of events or an error if occurred.
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
 *
 * @param {number} page - The current page number for pagination purposes.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<{data: any, error: any}>} - A promise that resolves to an object containing event data and any potential error.
 */
const getEventsAttending = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
  const { data, error } = await supabase
    .from("event_guests")
    .select("events(*)")
    .eq("guest_id", userId)
    .range(startIndex, endIndex);
  return { data, error };
};

/**
 * Retrieves events for which the user has applied as a vendor.
 * This function queries the 'vendor_applications' table to get events based on the vendor's user ID.
 *
 * @param {number} page - The current page number for pagination.
 * @param {string} userId - The unique identifier of the user who is a vendor.
 * @returns {Promise<{data: any, error: any}>} - A promise that resolves to an object containing event data and any potential error.
 */
const getEventsApplied = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
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
 *
 * @param {number} page - The current page number for pagination.
 * @param {string} userId - The unique identifier of the user who is the event organizer.
 * @returns {Promise<{data: any, error: any}>} - A promise that resolves to an object containing event data and any potential error.
 */
const getEventsHosting = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
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
 *
 * @param {number} page - The current page number for pagination.
 * @param {string} userId - The unique identifier of the user who is the event organizer.
 * @returns {Promise<{data: any, error: any}>} - A promise that resolves to an object containing event data and any potential error.
 */
const getEventsLiked = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
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
  getEventDataByDate,
  getEventDataByTag,
  getAllEventData,
  getEventsAttending,
  getEventsApplied,
  getEventsHosting,
  getEventsLiked,
};
