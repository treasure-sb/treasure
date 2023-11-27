export interface EventFormTicket {
  ticket_price: string;
  ticket_quantity: string;
  ticket_name: string;
}

export interface EventFormTag {
  tag_name: string;
  tag_id: number;
}

export interface EventForm {
  name: string;
  description: string;
  venue_name: string;
  address: string;
  lng: number;
  lat: number;
  date: Date | undefined;
  start_time: string;
  end_time: string;
  tickets: EventFormTicket[];
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
  }[];
  tags: {
    tag_name: string;
  }[];
}

export interface EventFormLocation {
  address: string;
  lng: number;
  lat: number;
}
