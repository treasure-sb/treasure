"use client";

import { useState } from "react";
import CreateEventName from "./CreateEventName";
import CreateEventDate from "./CreateEventDate";
import CreateEventTickets from "./CreateEventTickets";
import CreateEventVendorInfo from "./CreateEventVendorInfo";
import CreateEventTables from "./CreateEventTables";
import CreateEventPoster from "./CreateEventPoster";
import CreateEventVenueMap from "./CreateEventVenueMap";
import { EventForm } from "@/types/event";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function CreateEvent() {
  const eventID = useSearchParams().get("data");

  const [step, setStep] = useState(1);
  const [eventForm, setEventForm] = useState<EventForm>({
    name: "",
    description: "",
    venue_name: "",
    address: "",
    lat: 0,
    lng: 0,
    city: "",
    state: "",
    date: undefined,
    start_time: "09:30",
    end_time: "16:30",
    tickets: [
      {
        ticket_price: "",
        ticket_quantity: "",
        total_tickets: "",
        ticket_name: "",
      },
    ],
    tables: [
      {
        section_name: "",
        table_price: "",
        table_quantity: "",
        table_total_tables: "",
        table_provided: false,
        space_allocated: "",
        number_vendors_allowed: "",
      },
    ],
    tags: [],
    application_vendor_information: {
      check_in_time: "07:30",
      check_in_location: "",
      wifi_availability: false,
      additional_information: undefined,
      terms: [{ term_id: 1, term: "" }],
    },
    sales_status: "NO_SALE",
    vendor_exclusivity: "PUBLIC",
    poster_url: undefined,
    venue_map_url: undefined,
  }); 

  useMemo(() => {
    if (eventID) {
      try {
        const eventData = JSON.parse(eventID);
        setEventForm({
          ...eventForm,
          name: eventData.name,
          description: eventData.description,
          venue_name: eventData.venue_name,
          address: eventData.address,
          lat: eventData.lat,
          lng: eventData.lng,
          city: eventData.city,
          state: eventData.state,
          start_time: eventData.start_time.slice(0, -3),
          end_time: eventData.end_time.slice(0, -3),
          tickets: eventData.tickets,
          tables:
            eventData.tables.length === 0 ? eventForm.tables : eventData.tables,
          tags: eventData.tags,
          sales_status: eventData.sales_status,
          vendor_exclusivity: eventData.vendor_exclusivity,
          // poster_url: eventData.poster_url,
          // venue_map_url: eventData.venue_map_url,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const progress = Array.from({ length: 7 }, (_, i) => (
    <div
      className={`rounded-full w-2 h-2 transition duration-500 ${
        step === i + 1 ? "bg-primary" : "bg-secondary"
      }`}
    />
  ));

  return (
    <main className="max-w-lg h-[calc(100vh-300px)] m-auto">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between mx-10 mb-4">{progress}</div>
        <h1 className="text-3xl font-semibold">Create Event</h1>
      </div>
      {step === 1 && (
        <CreateEventName
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
        />
      )}
      {step === 2 && (
        <CreateEventDate
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 3 && (
        <CreateEventTickets
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 4 && (
        <CreateEventVendorInfo
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 5 && (
        <CreateEventTables
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 6 && (
        <CreateEventPoster
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 7 && (
        <CreateEventVenueMap
          eventForm={eventForm}
          onBack={() => setStep(step - 1)}
        />
      )}
    </main>
  );
}
