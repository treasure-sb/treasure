"use client";
import { Button } from "@/components/ui/button";
import { useVendorApplicationStore } from "../store";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TableView } from "../../../store";
import { useVendorFlow } from "../../../context/VendorFlowContext";
import { submitVendorApplication } from "@/lib/actions/vendors/applications";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";

export interface VendorApplication {
  event_id: string;
  vendor_id: string;
  table_id: string;
  application_phone: string;
  application_email: string;
  table_quantity: number;
  vendors_at_table: number;
  inventory: string;
  comments: string;
}

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
    vendorInfo,
    setCurrentStep,
  } = useVendorApplicationStore();
  const { state, dispatch } = useVendorFlow();
  const { event, profile } = state;
  const [submitting, setSubmitting] = useState(false);

  const submitApplication = async () => {
    const vendorApplication: VendorApplication = {
      event_id: event.id,
      vendor_id: profile?.id as string,
      application_phone: vendorInfo.phone as string,
      application_email: vendorInfo.email as string,
      table_id: table.id,
      table_quantity: tableQuantity,
      vendors_at_table: vendorsAtTable,
      inventory,
      comments,
    };
    const { error } = await submitVendorApplication(vendorApplication, event);
    if (error) {
      setSubmitting(false);
      toast.error("Error submitting application");
      return false;
    }
    return true;
  };

  const updateUserProfile = async () => {
    const fieldsToUpdate = {
      business_name: vendorInfo.businessName,
      first_name: vendorInfo.firstName,
      last_name: vendorInfo.lastName,
    };
    if (profile?.id) {
      const { error } = await updateProfile(fieldsToUpdate, profile.id);
      if (error) {
        setSubmitting(false);
        toast.error("Error updating profile");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const applicationSuccess = await submitApplication();
    const profileSuccess = await updateUserProfile();
    if (applicationSuccess && profileSuccess) {
      dispatch({ type: "setCurrentView", payload: TableView.Complete });
    }
  };

  return (
    <div className="h-full space-y-10">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Review Information</h1>
        <LabeledText label="First Name">
          {vendorInfo.firstName || ""}
        </LabeledText>
        <LabeledText label="Last Name">{vendorInfo.lastName || ""}</LabeledText>
        <LabeledText label="Email">{vendorInfo.email || ""}</LabeledText>
        <LabeledText label="Phone">{vendorInfo.phone || ""}</LabeledText>
        <LabeledText label="Business Name">
          {vendorInfo.businessName || "N/A"}
        </LabeledText>
        <LabeledText label="Inventory">{inventory}</LabeledText>
        <LabeledText label="Comments">{comments}</LabeledText>
      </div>
      <div>
        <div className="flex justify-between">
          <p>
            {table.section_name}, {vendorsAtTable} vendors at table
          </p>
          <p>Qty: {tableQuantity}</p>
        </div>
        <Separator className="my-2" />
        {<div className="flex justify-end">${table.price * tableQuantity}</div>}
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="w-full"
          disabled={submitting}
          variant={"secondary"}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          variant={"tertiary"}
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
