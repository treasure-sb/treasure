import { Button } from "@/components/ui/button";
import { useVendorApplicationStore } from "../store";
import { useProfile } from "@/app/(dashboards)/query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInstagram } from "../query";
import { InstagramIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { VendorApplication } from "@/types/applications";
import { submitVendorApplication } from "@/lib/actions/vendors/applications";
import { useState } from "react";

export default function ReviewInformation() {
  const {
    event,
    currentStep,
    table,
    tableQuantity,
    vendorsAtTable,
    inventory,
    comments,
    setCurrentStep,
  } = useVendorApplicationStore();
  const { profile, publicUrl } = useProfile();
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const instagramUsername = useInstagram(profile);

  const handleSubmit = async () => {
    setSubmitting(true);
    const vendorApplication: VendorApplication = {
      event_id: event?.id as string,
      vendor_id: profile?.id as string,
      table_id: table?.id as string,
      table_quantity: tableQuantity,
      vendors_at_table: vendorsAtTable,
      inventory,
      comments,
    };
    const { error } = await submitVendorApplication(
      vendorApplication,
      event?.organizer_id ? event.organizer_id : ""
    );
    if (error) {
      setSubmitting(false);
      setAlreadySubmitted(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between h-[80%]">
        <div className="flex justify-between">
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">Review Information</h1>
            <p>
              <span className="text-primary">First Name:</span>{" "}
              {profile?.first_name}
            </p>
            <p>
              <span className="text-primary">Last Name:</span>{" "}
              {profile?.last_name}
            </p>
            <p>
              <span className="text-primary">Email:</span> {profile?.email}
            </p>
            <p>
              <span className="text-primary">Business Name:</span>{" "}
              {profile?.business_name || "N/A"}
            </p>
            <p>
              <span className="text-primary">Inventory:</span> {inventory}
            </p>
            <p>
              <span className="text-primary">Additional Comments:</span>{" "}
              {comments || "N/A"}
            </p>
            <p>
              <InstagramIcon className="inline-block mr-2" />
              {`@${instagramUsername}` || "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-24 h-24 mt-8">
              <AvatarImage src={publicUrl} />
              <AvatarFallback />
            </Avatar>
            <Button
              variant={"ghost"}
              onClick={() => setCurrentStep(currentStep - 2)}
            >
              Edit
            </Button>
          </div>
        </div>
        {table && (
          <div>
            <div className="flex justify-between">
              <p>
                {table.section_name}, {vendorsAtTable} vendors at table
              </p>
              <p>Qty: {tableQuantity}</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-end">
              ${table.price * tableQuantity}
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="w-full"
          variant={"secondary"}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          variant={"tertiary"}
          className={`w-full ${
            submitting && "bg-tertiary/40 pointer-events-none"
          } ${
            alreadySubmitted &&
            "bg-destructive pointer-events-none text-foreground"
          }}`}
        >
          {submitting
            ? "Submitting..."
            : alreadySubmitted
            ? "Already Submitted"
            : "Submit"}
        </Button>
      </div>
    </>
  );
}
