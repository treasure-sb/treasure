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
  ticket_price: string;
  ticket_quantity: string;
  poster_url: File | string | undefined;
}

interface EventFormTicket {
  ticket_price: string;
  ticket_quantity: string;
  ticket_name: string;
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
  poster_url: File | string | undefined;
}

export interface EventFormLocation {
  address: string;
  lng: number;
  lat: number;
}
