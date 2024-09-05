import EventDates from "./components/EventDates";
import EventDetails from "./components/EventDetails";
import EventPoster from "./components/EventPoster";
import EventTables from "./components/EventTables";
import EventTickets from "./components/EventTickets";
import Exit from "./components/Exit";
import MenuBar from "./components/MenuBar";

export default function Page() {
  return (
    <>
      <main className="max-w-lg lg:max-w-6xl mx-auto space-y-4">
        <Exit />
        <div className="w-full flex flex-col space-y-4 lg:flex-row-reverse lg:space-y-0 lg:justify-between">
          <EventPoster />
          <div className="space-y-4 w-full lg:pr-10 lg:space-y-10">
            <EventDetails />
            <EventDates />
            <EventTickets />
            <EventTables />
          </div>
        </div>
      </main>
      <MenuBar />
    </>
  );
}
