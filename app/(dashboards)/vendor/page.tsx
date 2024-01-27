"use client";
import Sales from "./components/Sales";
import Tables from "./components/Tables";

export default function Page() {
  return (
    <>
      <h1 className="font-semibold text-3xl mb-4">Vendor Overview</h1>
      <div className="max-h-[calc(100vh-12rem)] 2xl:grid 2xl:grid-cols-3 2xl:grid-rows-2 2xl:gap-4 space-y-4 2xl:space-y-0 overflow-scroll scrollbar-hidden 2xl:overflow-hidden">
        {/* <UpcomingEvents /> */}
        {/* <Profit /> */}
        <Sales />
        <Tables />
        {/* <Tables /> */}
      </div>
    </>
  );
}
