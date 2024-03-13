"use client";
import { Button } from "@/components/ui/button";
import { useVendorApplicationStore } from "../store";
import { useVendorFlowStore } from "../../../store";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const LabeledText = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <p className="text-md">
      <span className="text-primary font-semibold">{label}:</span> {children}
    </p>
  );
};

export default function ReviewInformation() {
  const {
    table,
    tableQuantity,
    inventory,
    comments,
    currentStep,
    vendorsAtTable,
    setCurrentStep,
  } = useVendorApplicationStore();
  const { profile } = useVendorFlowStore();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {};

  return (
    <div className="h-full flex flex-col justify-between space-y-10">
      <div className="flex flex-col justify-between h-[80%]">
        <div className="flex justify-between">
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">Review Information</h1>
            <LabeledText label="First Name">{profile?.first_name}</LabeledText>
            <LabeledText label="Last Name">{profile?.last_name}</LabeledText>
            <LabeledText label="Email">{profile?.email}</LabeledText>
            <LabeledText label="Phone">{profile?.phone}</LabeledText>
            <LabeledText label="Business Name">
              {profile?.business_name || "N/A"}
            </LabeledText>
            <LabeledText label="Inventory">{inventory}</LabeledText>
            <LabeledText label="Comments">{comments}</LabeledText>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <p>
              {table.section_name}, {vendorsAtTable} vendors at table
            </p>
            <p>Qty: {tableQuantity}</p>
          </div>
          <Separator className="my-2" />
          {
            <div className="flex justify-end">
              ${table.price * tableQuantity}
            </div>
          }
        </div>
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
          }`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
