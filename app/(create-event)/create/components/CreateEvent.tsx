"use client";

import {
  CreateEventProvider,
  CreateEventState,
  CurrentStep,
} from "../context/CreateEventContext";
import {
  CreateEventDate,
  CreateEventTable,
  CreateEventTicket,
  eventSchema,
  type CreateEvent,
} from "../schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tables } from "@/types/supabase";
import { AllEventData } from "../page";
import CreateEventOrPreview from "./CreateEventOrPreview";
import MenuBar from "./menu/MenuBar";
import Exit from "./sections/Exit";

export default function CreateEvent({
  tags,
  user,
  draft,
  draftPosterPublicUrl,
  draftVenuePublicUrl,
  eventId,
}: {
  tags: Tables<"tags">[];
  user: Tables<"profiles"> | null;
  draft: AllEventData | null;
  draftPosterPublicUrl: string | null;
  draftVenuePublicUrl: string | null;
  eventId: string | null;
}) {
  const dates: CreateEventDate[] = draft
    ? draft.dates.map((date) => ({
        date: date.date ? new Date(date.date) : undefined,
        startTime: date.start_time ? date.start_time.slice(0, -3) : "09:30",
        endTime: date.end_time ? date.end_time.slice(0, -3) : "16:30",
      }))
    : [];

  const tickets: CreateEventTicket[] = draft
    ? draft.tickets.map((ticket) => ({
        name: ticket.name ? ticket.name : "",
        description: ticket.description,
        price: ticket.price.toFixed(2).toString(),
        quantity: ticket.quantity ? ticket.quantity.toString() : "",
        dates: ticket.dates.map(
          (date) => new Date(date.date.date ? date.date.date : "")
        ),
      }))
    : [];

  const tables: CreateEventTable[] = draft
    ? draft.tables.map((table) => ({
        name: table.section_name || "",
        price: table.price.toFixed(2).toString(),
        quantity: table.quantity ? table.quantity.toString() : "",
        tableProvided: table.table_provided,
        spaceAllocated: table.space_allocated
          ? table.space_allocated.toString()
          : "",
        numberVendorsAllowed: table.number_vendors_allowed
          ? table.number_vendors_allowed.toString()
          : "",
      }))
    : [];

  const eventTags = draft ? draft.tags.map((tag) => tag.tag) : [];

  const terms = draft
    ? draft.terms.map((term) => ({
        term: term.term || "",
      }))
    : [];

  const initialState: CreateEvent = {
    basicDetails: {
      name: draft?.name || "",
      venueName: draft?.venue_name || "",
      description: draft?.description || "",
      venueAddress: {
        address: draft?.address || "",
        lat: draft?.lat || 0,
        lng: draft?.lng || 0,
        city: draft?.city || "",
        state: draft?.state || "",
      },
    },
    dates:
      dates.length > 0
        ? dates
        : [{ date: undefined, startTime: "09:30", endTime: "16:30" }],
    tickets:
      tickets.length > 0
        ? tickets
        : [
            {
              name: "",
              description: "",
              price: "0.00",
              quantity: "100",
              dates: [],
            },
          ],
    tables:
      tables.length > 0
        ? tables
        : [
            {
              name: "",
              price: "0.00",
              quantity: "100",
              tableProvided: false,
              spaceAllocated: "",
              numberVendorsAllowed: "",
              additionalInformation: "",
            },
          ],
    vendorInfo: {
      checkInTime: draft?.vendorInfo?.check_in_time || "",
      checkInLocation: draft?.vendorInfo?.check_in_location || "",
      wifiAvailability: draft?.vendorInfo?.wifi_availability || false,
      additionalInfo: draft?.vendorInfo?.additional_information || "",
      terms: terms.length > 0 ? terms : [{ term: "" }],
    },
    tags: eventTags,
    poster: draft?.poster_url || undefined,
    venueMap: draft?.venue_map_url || undefined,
  };

  const form = useForm<CreateEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialState,
  });

  const initalCreateEventState: CreateEventState = {
    currentStep: CurrentStep.STEP_ONE,
    tags: tags,
    user: user,
    preview: false,
    eventId: eventId,
    originalDraft: draft,
    draftPosterPublicUrl: draftPosterPublicUrl,
    draftVenuePublicUrl: draftVenuePublicUrl,
  };

  return (
    <CreateEventProvider initialState={initalCreateEventState}>
      <FormProvider {...form}>
        <main className="min-h-screen">
          <CreateEventOrPreview form={form} />
          <MenuBar />
        </main>
      </FormProvider>
    </CreateEventProvider>
  );
}
