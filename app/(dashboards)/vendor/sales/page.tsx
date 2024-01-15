"use client";

import { useEffect } from "react";
import { useStore } from "../store";
import { parseLocalDate } from "@/lib/utils";
import format from "date-fns/format";
import SalesDateFiltering from "./components/SalesDateFiltering";

export default function Page({
  searchParams,
}: {
  searchParams: {
    from?: string;
    until?: string;
  };
}) {
  const { from, until } = searchParams;
  const { setCurrentPage } = useStore();
  useEffect(() => {
    setCurrentPage("sales");
  }, []);

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">Sales</h1>
      <div className="flex justify-between">
        <h1 className="text-4xl relative">
          $125.50
          {from && until && (
            <span className="text-sm block text-left text-primary font-semibold">
              {format(parseLocalDate(from), "MMMM d")} -{" "}
              {format(parseLocalDate(until), "MMMM d")}
            </span>
          )}
        </h1>
        <SalesDateFiltering />
      </div>
    </>
  );
}
