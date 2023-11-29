"use server";
import { EventFormTicket } from "@/types/event";
import format from "date-fns/format";

interface TicketTailorEvent {
  name: string;
  description: string;
  venue_name: string;
}

const createTicketTailorEvent = async (event: TicketTailorEvent) => {
  const url = `${process.env.NEXT_PUBLIC_TICKET_TAILOR_API_URL}/v1/event_series`;
  const headers = new Headers({
    Accept: "application/json",
    Content_Type: "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + btoa(process.env.NEXT_PUBLIC_TICKET_TAILOR_API_KEY as string),
  });

  const body = {
    ...event,
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

interface TicketTailorEventOccurence {
  start_date: string | Date;
  end_date: string | Date;
  end_time?: string;
  start_time?: string;
}

const createTicketTailorEventOccurence = async (
  event_id: string,
  event_occurence: any
) => {
  const url = `${process.env.NEXT_PUBLIC_TICKET_TAILOR_API_URL}/v1/event_series/${event_id}/events`;
  const headers = new Headers({
    Accept: "application/json",
    Content_Type: "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + btoa(process.env.NEXT_PUBLIC_TICKET_TAILOR_API_KEY as string),
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: new URLSearchParams(event_occurence),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (err) {
    console.log(err);
  }
};

const formatTicketPrices = (tickets: EventFormTicket[]) => {
  return tickets.map((ticket) => {
    let price = Number(ticket.ticket_price);
    let formattedPrice = "";

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

const createTicketTailorTickets = async (
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

  const formattedTickets = formatTicketPrices(tickets);
  formattedTickets.forEach(async (ticket) => {
    const body = {
      name: ticket.ticket_name,
      price: ticket.ticket_price,
      quantity: ticket.ticket_quantity,
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
    } catch (err) {
      console.log(err);
    }
  });
};

const publishTicketTailorEvent = async (ticket_tailor_event_id: string) => {
  const url = `${process.env.NEXT_PUBLIC_TICKET_TAILOR_API_URL}/v1/event_series/${ticket_tailor_event_id}/status`;
  const headers = new Headers({
    Accept: "application/json",
    Content_Type: "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + btoa(process.env.NEXT_PUBLIC_TICKET_TAILOR_API_KEY as string),
  });

  const body = {
    status: "PUBLISHED",
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
  } catch (err) {
    console.log(err);
  }
};

const listAllTicketTailorEvents = async () => {
  const url = `${process.env.NEXT_PUBLIC_TICKET_TAILOR_API_URL}/v1/event_series`;
  const headers = new Headers({
    Accept: "application/json",
    Authorization:
      "Basic " + btoa(process.env.NEXT_PUBLIC_TICKET_TAILOR_API_KEY as string),
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
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

const getATicketTailorEvent = async (event_series_id: string) => {
  const url = `${process.env.NEXT_PUBLIC_TICKET_TAILOR_API_URL}/v1/event_series/${event_series_id}`;
  const headers = new Headers({
    Accept: "application/json",
    Authorization:
      "Basic " + btoa(process.env.NEXT_PUBLIC_TICKET_TAILOR_API_KEY as string),
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
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

export {
  createTicketTailorEvent,
  createTicketTailorTickets,
  listAllTicketTailorEvents,
  publishTicketTailorEvent,
  createTicketTailorEventOccurence,
};
