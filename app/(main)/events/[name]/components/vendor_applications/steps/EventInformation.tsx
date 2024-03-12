import { convertToStandardTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useVendorApplicationStore } from "../store";
import { useEventVendorInformation } from "../query";
import { Tables } from "@/types/supabase";

export default function EventInformation({
  event,
}: {
  event: Tables<"events">;
}) {
  const { currentStep, setCurrentStep } = useVendorApplicationStore();
  const vendorInformation = useEventVendorInformation(event);

  return (
    <>
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Event Information</h1>
          <div className="space-y-2">
            <p>
              <span className="text-primary">Name:</span> {event.name}
            </p>
            <p>
              <span className="text-primary">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </p>
            <p>
              <span className="text-primary ">From:</span>{" "}
              {convertToStandardTime(event.start_time)}
            </p>
            <p>
              <span className="text-primary">Until:</span>{" "}
              {convertToStandardTime(event.end_time)}
            </p>
          </div>
        </div>
        <div className="text-left space-y-2">
          <h1 className="text-xl font-semibold">Vendor Check In</h1>
          <div className="space-y-2">
            <p>
              <span className="text-primary">Location:</span>{" "}
              {vendorInformation?.check_in_location}
            </p>
            <p>
              <span className="text-primary">Check In Time:</span>{" "}
              {convertToStandardTime(vendorInformation?.check_in_time)}
            </p>
            <p>
              <span className="text-primary">Wifi Availability:</span>{" "}
              {vendorInformation?.wifi_availability ? "Yes" : "No"}
            </p>
            <p>
              <span className="text-primary">Additional Information:</span>{" "}
              {vendorInformation?.additional_information}
            </p>
          </div>
        </div>
      </div>
      <Button onClick={() => setCurrentStep(currentStep + 1)}>
        Begin Application
      </Button>
    </>
  );
}
