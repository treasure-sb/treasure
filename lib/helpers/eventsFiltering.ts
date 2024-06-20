"use server";

import createSupabaseServerClient from "../../utils/supabase/server";
import format from "date-fns/format";
import { cityMap } from "./cities";
import { capitalize } from "../utils";

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

const getCityCoordinates = async (city: string) => {
  if (!cityMap[city]) {
    const splitCity = city.split("-");
    const stateName = splitCity[splitCity.length - 1];
    const cityName = splitCity
      .slice(0, splitCity.length - 1)
      .map((term) => capitalize(term))
      .join(" ");

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      `${cityName}, ${stateName}`
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
    } catch (error) {
      console.error("Error fetching city coordinates", error);
      return { lat: 0, lng: 0 };
    }
  } else {
    return { lat: cityMap[city].latitude, lng: cityMap[city].longitude };
  }

  return { lat: 0, lng: 0 };
};

const buildEventsQuery = async (
  page: number,
  search?: string,
  tagId?: string,
  from?: string,
  until?: string,
  city?: string,
  distance?: number
) => {
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
  const supabase = await createSupabaseServerClient();

  let query = supabase.from("events").select("*");

  if (tagId) {
    query = supabase
      .from("events")
      .select("*, event_tags!inner(*)")
      .eq("event_tags.tag_id", tagId);
  }

  if (city) {
    const { lat, lng } = await getCityCoordinates(city);

    if (lat === 0 && lng === 0) {
      return { data: [], error: "Null Island" };
    }

    query = supabase.rpc("get_nearby_events", {
      radius: distance,
      user_lat: lat,
      user_lon: lng,
    });

    if (tagId) {
      query = supabase.rpc("get_tagged_nearby_events", {
        radius: distance,
        user_lat: lat,
        user_lon: lng,
        tagid: tagId,
      });
    }
  }

  if (from) {
    query = query.gte("date", from);
  }

  if (until) {
    query = query.lte("date", until);
  }

  if (!from && !until) {
    query = query.gte("date", today);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  query = query
    .order("featured", { ascending: false })
    .order("date", { ascending: true })
    .order("id", { ascending: true })
    .range(startIndex, endIndex);

  const { data, error } = await query;
  return { data, error };
};

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

export {
  getTagData,
  getUpcomingEventsAttending,
  getPastEventsAttending,
  getUpcomingEventsLiked,
  getUpcomingEventsHosting,
  getPastEventsHosting,
  getPastEventsLiked,
  getEventsApplied,
  getEventsHosting,
  getEventsLiked,
  buildEventsQuery,
  getAllEventData,
};
