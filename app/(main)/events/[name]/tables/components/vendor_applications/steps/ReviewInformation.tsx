"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useVendorFlow, TableView } from "../../../context/VendorFlowContext";
import { submitVendorApplication } from "@/lib/actions/vendors/applications";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";
import { useVendorApplication } from "../../../context/VendorApplicationContext";
import { sendVendorAppSubmittedEmail } from "@/lib/actions/emails";
import { VendorAppSubmittedEmailProps } from "@/emails/VendorAppSubmitted";

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
    applicationDispatch,
  } = useVendorApplication();
  const { event, profile, flowDispatch } = useVendorFlow();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    toast.loading("Submitting application...");

    const successfulApplication = await submitApplication();
    await updateUserProfile();

    toast.dismiss();
    if (successfulApplication) {
      toast.success("Application submitted successfully");
      await handleSendSubmittedEmail();
      flowDispatch({ type: "setCurrentView", payload: TableView.Complete });
    } else {
      toast.error("Error submitting application");
    }
    setSubmitting(false);
  };

  const submitApplication = async () => {
    const vendorApplication: VendorApplication = {
      event_id: event.id,
      vendor_id: profile?.id as string,
      application_phone: `+1${vendorInfo.phone as string}`,
      application_email: vendorInfo.email as string,
      table_id: table.id,
      table_quantity: tableQuantity,
      vendors_at_table: vendorsAtTable,
      inventory,
      comments,
    };
    const { error } = await submitVendorApplication(vendorApplication, event);
    return !error;
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
        toast.error("Error updating profile");
        return false;
      }
    }
    return true;
  };

  const handleSendSubmittedEmail = async () => {
    const vendorEmailPayload: VendorAppSubmittedEmailProps = {
      eventName: event.name,
      posterUrl: event.publicPosterUrl,
      tableType: table.section_name,
      quantity: tableQuantity,
      location: event.address,
      date: event.date,
      guestName: `${vendorInfo.firstName} ${vendorInfo.lastName}`,
      businessName: vendorInfo.businessName,
      itemInventory: inventory,
      totalPrice: "$" + table.price * tableQuantity,
      numberOfVendors: vendorsAtTable,
      eventInfo: event.description,
    };
    const { error } = await sendVendorAppSubmittedEmail(
      vendorInfo.email as string,
      vendorEmailPayload
    );

    if (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    applicationDispatch({ type: "setCurrentStep", payload: currentStep - 1 });
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
          onClick={handleBack}
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
          Submit
        </Button>
      </div>
    </div>
  );
}
