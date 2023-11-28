"use server";
import { Tables } from "@/types/supabase";

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

const createTicketTailorTicket = async (ticket: Tables<"tickets">) => {};

export { createTicketTailorEvent, createTicketTailorTicket };
