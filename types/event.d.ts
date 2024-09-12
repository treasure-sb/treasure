import { Tables } from "./supabase";

export interface EventFormTicket {
  ticket_price: string;
  ticket_quantity: string;
  total_tickets: string;
  ticket_name: string;
}

export interface EventFormTable {
  section_name: string;
  table_price: string;
  table_quantity: string;
  table_total_tables: string;
  table_provided: boolean;
  space_allocated: string;
  number_vendors_allowed: string;
  additional_information?: string | undefined;
}

export interface EventFormTag {
  tag_name: string;
  tag_id: string;
}

export interface EventVendorApplication {
  check_in_time: string;
  check_in_location: string;
  wifi_availability: boolean;
  additional_information?: string;
  terms: EventTerms[];
}

export interface EventTerms {
  term_id: number;
  term: string;
}

export interface EventForm {
  name: string;
  description: string;
  venue_name: string;
  address: string;
  lng: number;
  lat: number;
  city: string;
  state: string;
  date: Date | undefined;
  start_time: string;
  end_time: string;
  tickets: EventFormTicket[];
  tables: EventFormTable[];
  tags: EventFormTag[];
  application_vendor_information: EventVendorApplication;
  sales_status: string;
  vendor_exclusivity: string;
  poster_url: File | string | undefined;
  venue_map_url: File | string | undefined;
}

export interface EventPreview {
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  address: string;
  description: string;
  poster_url: string | null;
  venue_map_url: string | null;
  tickets: {
    ticket_name: string;
    ticket_price: number;
    ticket_quantity: number | null;
  }[];
  tags: {
    tag_name: string;
    tag_id: string;
  }[];
}

export interface EventFormLocation {
  address: string;
  lng: number;
  lat: number;
}

export interface EditEventForm {
  name: string;
  description: string;
  venue_name: string;
  address: string | undefined;
  lng: number;
  lat: number;
  date: Date | undefined;
  start_time: string;
  end_time: string;
  poster_url: string | File;
}

export interface SearchParams {
  tag?: string;
  from?: string;
  until?: string;
  search?: string;
  city?: string;
  distance?: string;
}

export type EventWithDates = Tables<"events"> & {
  dates: { date: string; start_time: string; end_time: string }[];
  event_roles: Tables<"event_roles">[];
};

export type EditEventWithDates = Tables<"events"> & {
  dates: { id: string; date: string; start_time: string; end_time: string }[];
};

type BaseEventDisplayData = {
  publicPosterUrl: string;
  formattedDates: { date: string; start_time: string; end_time: string }[];
};

export type EventDisplayData = EventWithDates & BaseEventDisplayData;
export type EditEventDisplayData = EditEventWithDates & BaseEventDisplayData;
