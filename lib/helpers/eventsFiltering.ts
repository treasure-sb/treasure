"use server";

import createSupabaseServerClient from "../../utils/supabase/server";
import format from "date-fns/format";
import { cityMap } from "./cities";
import { capitalize } from "../utils";
import { EventWithDates } from "@/types/event";

const today = format(new Date(), "yyyy-MM-dd");
const numEvents = 12;
const numUserEvents = 6;

type BuiltEvent = EventWithDates & {
  event_categories: {
    categories: {
      name: string;
    };
  }[];
} & {
  event_tags?: {
    tag_id: string;
  }[];
};

type VendorEventData = {
  payment_status: string;
  vendor_id: string;
} & {
  events: EventWithDates[];
};

type LikedEventData = {
  events: EventWithDates[];
};

type HostedEventData = EventWithDates & {
  roles: {
    id: string;
    role: string;
    status: string;
  }[];
};

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

  let query = supabase
    .from("events")
    .select(
      `
      *,
      dates:event_dates(date,start_time,end_time),
      event_categories!inner(categories!inner(name))
      `
    )
    .eq("event_categories.categories.name", "collectables");

  if (tagId) {
    query = supabase
      .from("events")
      .select(
        `*,
         dates:event_dates(date,start_time,end_time),
         event_tags!inner(tag_id), 
         event_categories!inner(categories!inner(name))`
      )
      .eq("event_categories.categories.name", "collectables")
      .eq("event_tags.tag_id", tagId);
  }

  if (city) {
    const { lat, lng } = await getCityCoordinates(city);

    if (lat === 0 && lng === 0) {
      return { data: [] as EventWithDates[], error: "Null Island" };
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
    query = query.gte("max_date", from);
  }

  if (until) {
    query = query.lte("min_date", until);
  }

  if (!from && !until) {
    query = query.gte("min_date", today);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  query = query
    .order("featured", { ascending: false })
    .order("min_date")
    .order("date", { ascending: true, referencedTable: "dates" })
    .range(startIndex, endIndex);

  const { data, error } = await query;
  const events: BuiltEvent[] = data || [];
  const eventWithDates: EventWithDates[] = events.map((event) => {
    const { event_categories, event_tags, ...rest } = event;
    return {
      ...rest,
    };
  });

  return { data: eventWithDates, error };
};

const getUpcomingEventsAttending = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("event_vendors")
    .select(
      `payment_status, 
       vendor_id,
       events!inner(*, dates:event_dates!inner(date, start_time, end_time))`
    )
    .eq("vendor_id", userId)
    .eq("payment_status", "PAID")
    .gte("events.max_date", today)
    .order("events(min_date)", { ascending: true })
    .range(startIndex, endIndex);

  const vendorData: VendorEventData[] = data || [];
  const eventsWithDates: EventWithDates[] = vendorData.flatMap(
    (vendor) => vendor.events
  );

  return { data: eventsWithDates, error };
};

const getPastEventsAttending = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("event_vendors")
    .select(
      `
      payment_status,
      vendor_id,
      events!inner(*, dates:event_dates!inner(date, start_time, end_time))`
    )
    .eq("vendor_id", userId)
    .eq("payment_status", "PAID")
    .lt("events.max_date", today)
    .order("events(min_date)", { ascending: false })
    .range(startIndex, endIndex);

  const vendorData: VendorEventData[] = data || [];
  const eventsWithDates: EventWithDates[] = vendorData.flatMap(
    (vendor) => vendor.events
  );

  return { data: eventsWithDates, error };
};

const getUpcomingEventsLiked = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("event_likes")
    .select(
      "events!inner(*, dates:event_dates!inner(date,start_time,end_time))"
    )
    .eq("user_id", userId)
    .gte("events.max_date", today)
    .order("events(min_date)", { ascending: true })
    .range(startIndex, endIndex);

  const likedEventData: LikedEventData[] = data || [];
  const eventWithDates: EventWithDates[] = likedEventData.flatMap(
    (event) => event.events
  );

  return { data: eventWithDates, error };
};

const getPastEventsLiked = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("event_likes")
    .select(
      "events!inner(*, dates:event_dates!inner(date,start_time,end_time))"
    )
    .eq("user_id", userId)
    .lt("events.date", today)
    .order("events(min_date)", { ascending: false })
    .range(startIndex, endIndex);

  const likedEventData: LikedEventData[] = data || [];
  const eventWithDates: EventWithDates[] = likedEventData.flatMap(
    (event) => event.events
  );
  return { data: eventWithDates, error };
};

const getUpcomingEventsHosting = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("events")
    .select(
      "*, dates:event_dates!inner(date, start_time, end_time), roles:event_roles!inner(id, role, status)"
    )
    .eq("roles.user_id", userId)
    .eq("roles.status", "ACTIVE")
    .in("roles.role", ["HOST", "COHOST"])
    .gte("max_date", today)
    .order("min_date")
    .range(startIndex, endIndex);

  const hostedData: HostedEventData[] = data || [];
  const eventWithDates: EventWithDates[] = hostedData.map((event) => {
    const { roles, ...rest } = event;
    return {
      ...rest,
    };
  });
  return { data: eventWithDates, error };
};

const getPastEventsHosting = async (page: number, userId: string) => {
  const supabase = await createSupabaseServerClient();
  const startIndex = (page - 1) * numUserEvents;
  const endIndex = startIndex + numUserEvents - 1;
  const { data, error } = await supabase
    .from("events")
    .select(
      "*, dates:event_dates!inner(date, start_time, end_time), roles:event_roles!inner(id, role, status)"
    )
    .eq("roles.user_id", userId)
    .eq("roles.status", "ACTIVE")
    .in("roles.role", ["HOST", "COHOST"])
    .lt("max_date", today)
    .order("min_date", { ascending: false })
    .range(startIndex, endIndex);

  const hostedData: HostedEventData[] = data || [];
  const eventWithDates: EventWithDates[] = hostedData.map((event) => {
    const { roles, ...rest } = event;
    return {
      ...rest,
    };
  });
  return { data: eventWithDates, error };
};

const getAllEventData = async (search: string, page: number) => {
  const startIndex = (page - 1) * numEvents;
  const endIndex = startIndex + numEvents - 1;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `*, dates:event_dates(date,start_time,end_time), event_categories!inner(categories!inner(name), *)`
    )
    .eq("event_categories.categories.name", "collectables")
    .gte("max_date", today)
    .ilike("name", `%${search}%`)
    .order("featured", { ascending: false })
    .order("min_date")
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
  buildEventsQuery,
  getAllEventData,
};
