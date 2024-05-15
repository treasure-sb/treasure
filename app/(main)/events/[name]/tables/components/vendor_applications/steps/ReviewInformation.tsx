"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useVendorFlow, TableView } from "../../../context/VendorFlowContext";
import {
  createVendorTags,
  submitVendorApplication,
} from "@/lib/actions/vendors/applications";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";
import { useVendorApplication } from "../../../context/VendorApplicationContext";
import {
  sendVendorAppReceivedEmail,
  sendVendorAppSubmittedEmail,
} from "@/lib/actions/emails";
import { VendorAppSubmittedEmailProps } from "@/emails/VendorAppSubmitted";
import { filterPhoneNumber } from "@/components/ui/custom/phone-input";
import { updateLink } from "@/lib/actions/links";
import type { VendorApplication } from "../../../types";
import { sendVendorAppSubmittedSMS } from "@/lib/sms";

const LabeledText = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <p className="text-md">
      <span className="text-primary font-normal">{label}:</span> {children}
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
    vendorTags,
    applicationDispatch,
  } = useVendorApplication();
  const { event, profile, flowDispatch } = useVendorFlow();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    toast.loading("Submitting application...");

    const successfulApplication = await submitApplication();
    await setVendorTags();
    await updateUserProfile();
    await updateInstagram();

    toast.dismiss();
    if (successfulApplication) {
      toast.success("Application submitted successfully");
      await handleSendSubmittedEmail();
      await handleSendSubmittedSMS();
      flowDispatch({ type: "setCurrentView", payload: TableView.Complete });
    } else {
      toast.error("Error submitting application");
    }
    setSubmitting(false);
  };

  const submitApplication = async () => {
    const filteredPhoneNumber = filterPhoneNumber(vendorInfo.phone as string);
    const vendorApplication: VendorApplication = {
      event_id: event.id,
      vendor_id: profile?.id as string,
      application_phone: `+1${filteredPhoneNumber}`,
      application_email: vendorInfo.email as string,
      table_id: table.id,
      table_quantity: tableQuantity,
      vendors_at_table: vendorsAtTable,
      inventory,
      comments,
    };
    const { error } = await submitVendorApplication(
      vendorApplication,
      event,
      vendorInfo
    );
    return !error;
  };

  const setVendorTags = async () => {
    const { error } = await createVendorTags(
      vendorTags,
      profile?.id as string,
      event.id
    );

    if (error) {
      console.log(error);
    }
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
      }
    }
  };

  const updateInstagram = async () => {
    if (vendorInfo.instagram) {
      const linkType = {
        application: "Instagram",
        username: vendorInfo.instagram,
        type: "social",
      };
      const { error } = await updateLink(linkType, profile?.id as string);
      if (error) {
        console.log(error);
      }
    }
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
    await sendVendorAppSubmittedEmail(
      vendorInfo.email as string,
      vendorEmailPayload
    );
  };

  const handleSendSubmittedSMS = async () => {
    await sendVendorAppSubmittedSMS(
      vendorInfo.phone as string,
      vendorInfo.firstName as string,
      event.name
    );
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
        <LabeledText label="Instagram">
          {vendorInfo.instagram || "N/A"}
        </LabeledText>
        <LabeledText label="Tags">
          {vendorTags.map((tag) => tag.name).join(", ")}
        </LabeledText>
        <LabeledText label="Inventory">{inventory}</LabeledText>
        <LabeledText label="Comments">{comments || "None"}</LabeledText>
      </div>
      <div>
        <div className="flex justify-between">
          <p>
            {table.section_name}, {vendorsAtTable} vendors at table
          </p>
          <p>Qty: {tableQuantity}</p>
        </div>
        {event.vendor_exclusivity === "APPLICATIONS" && (
          <>
            <Separator className="my-2" />
            {
              <div className="flex justify-end">
                ${table.price * tableQuantity}
              </div>
            }
          </>
        )}
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
