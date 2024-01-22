"use client";

import { useEffect } from "react";
import { useStore } from "../store";
import EventTools from "./components/EventTools";
import AllEvents from "./components/AllEvents";

export default function Page() {
  const { setCurrentPage } = useStore();

  useEffect(() => {
    setCurrentPage("events");
  }, []);

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">My Events</h1>
      <AllEvents />
    </>
  );
}
