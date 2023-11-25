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

export interface EventFormLocation {
  address: string;
  lng: number;
  lat: number;
}
