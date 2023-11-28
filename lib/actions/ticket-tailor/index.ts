"use server";
import { Tables } from "@/types/supabase";
import { EventFormTicket } from "@/types/event";

const createTicketTailorEvent = async (event: Tables<"events">) => {
  const url = `${process.env.NEXT_PUBLIC_TICKET_TAILOR_API_URL}/v1/event_series`;
  const headers = new Headers({
    Accept: "application/json",
    Content_Type: "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + btoa(process.env.NEXT_PUBLIC_TICKET_TAILOR_API_KEY as string),
  });

  const body = {
    name: event.name,
    description: event.description,
    venue: event.venue_name,
    currency: "usd",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: new URLSearchParams(body),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const formatPrices = (tickets: EventFormTicket[]) => {
  return tickets.map((ticket) => {
    let formattedPrice = "";
    let price = Number(ticket.ticket_price);

    // If price is a whole number, multiply by 100 to get cents (ex. 30 -> 3000)
    if (price % 1 === 0) {
      formattedPrice = (price * 100).toString();
    } else {
      formattedPrice = (price * 100).toFixed(0).toString();
    }
    return {
      ...ticket,
      ticket_price: formattedPrice,
    };
  });
};

const createTicketTailorTicket = async (
  tickets: EventFormTicket[],
  ticvet_tailor_event_id: string
) => {
  const url = `${process.env.NEXT_PUBLIC_TICKET_TAILOR_API_URL}/v1/event_series/${ticvet_tailor_event_id}/ticket_types`;
  const headers = new Headers({
    Accept: "application/json",
    Content_Type: "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + btoa(process.env.NEXT_PUBLIC_TICKET_TAILOR_API_KEY as string),
  });

  const formattedTickets = formatPrices(tickets);
  formattedTickets.forEach(async (ticket) => {
    const body = {
      name: ticket.ticket_name,
      price: ticket.ticket_price,
      quantity: ticket.ticket_quantity,
    };
    console.log(body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: new URLSearchParams(body),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export { createTicketTailorEvent, createTicketTailorTicket };
