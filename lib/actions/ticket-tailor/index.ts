"use server";

const ticketTest = async () => {
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
    console.error(err);
  }
};

export { ticketTest };
