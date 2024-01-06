export interface EventFormTicket {
  ticket_price: string;
  ticket_quantity: string;
  ticket_name: string;
}

export interface EventFormTable {
  table_price: string;
  table_quantity: string;
}

export interface EventFormTag {
  tag_name: string;
  tag_id: string;
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
}

export type EventDisplayData = Tables<"events"> & {
  publicPosterUrl: string;
  formattedDate: string;
};
