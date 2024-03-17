"use client";

import { Tables } from "@/types/supabase";

export default function BasicEventInfo({ event }: { event: Tables<"events"> }) {
  return (
    <>
      <div className="flex w-full justify-between md:justify-start items-center gap-4">
        <p className="md:w-52">event name :</p>
        <p className="font-semibold text-primary"> {event.name}</p>
      </div>

      <div className="flex w-full justify-between md:justify-start items-center gap-4">
        <p className="md:w-52">event date :</p>
        <p className="font-semibold text-primary"> {event.date}</p>
      </div>

      <div className="flex w-full justify-between md:justify-start items-center gap-4">
        <p className="md:w-52">venue name :</p>
        <p className="font-semibold text-primary"> {event.venue_name}</p>
      </div>

      <div className="flex w-full justify-between md:justify-start items-center gap-4">
        <p className="md:w-52">address :</p>
        <p className="font-semibold text-primary">
          {event.address.split(",")[0]}
        </p>
      </div>
    </>
  );
}
