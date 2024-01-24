"use client";

import { useEffect } from "react";
import { useStore } from "../store";
import EventTools from "./components/tools/EventTools";
import AllEvents from "./components/AllEvents";

export default function Page() {
  const { setCurrentPage, event } = useStore();

  useEffect(() => {
    setCurrentPage("events");
  }, []);

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">My Events</h1>
      {event ? <EventTools /> : <AllEvents />}
    </>
  );
}
