export interface EventForm {
  name: string;
  description: string;
  venueName: string;
  venueAddress: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  ticketQuantity: string;
  poster: File | undefined;
}
