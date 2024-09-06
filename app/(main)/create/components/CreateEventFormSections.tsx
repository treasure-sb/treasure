import EventDates from "./sections/step_one/EventDates";
import EventDetails from "./sections/step_one/EventDetails";
import EventPoster from "./sections/step_one/EventPoster";
import EventTables from "./sections/step_one/EventTables";
import EventTickets from "./sections/step_one/EventTickets";
import EventVendorInfo from "./sections/step_two/EventVendorInfo";
import EventTablesInfo from "./sections/step_two/EventTablesInfo";
import { useCreateEvent } from "../context/CreateEventContext";

export default function CreateEventFormSections() {
  const { currentStep } = useCreateEvent();

  return (
    <div className="w-full flex flex-col space-y-4 lg:flex-row-reverse lg:space-y-0 lg:justify-between">
      <EventPoster />
      <div className="space-y-4 w-full lg:pr-10 lg:space-y-10">
        <EventDetails />
        <EventDates />
        <EventTickets />
        <EventTables />
        {currentStep >= 2 && (
          <>
            <EventVendorInfo />
            <EventTablesInfo />
          </>
        )}
        {currentStep === 3 && (
          <div>
            <h1>final step</h1>
          </div>
        )}
      </div>
    </div>
  );
}
