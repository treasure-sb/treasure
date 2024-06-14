"use client";
import { Tables } from "@/types/supabase";
import { useVendorApplication } from "../../context/VendorApplicationContext";
import { Button } from "@/components/ui/button";
import { TableView, useVendorFlow } from "../../context/VendorFlowContext";
import { formatPhoneNumber } from "@/components/ui/custom/phone-input";
import { VendorInfo } from "../../types";

export default function ContinueButton({
  table,
  tableCount,
}: {
  table: Tables<"tables">;
  tableCount: number;
}) {
  const { profile, event, flowDispatch } = useVendorFlow();
  const { applicationDispatch } = useVendorApplication();

  const areApplicationsOpen =
    event.vendor_exclusivity === "APPLICATIONS" ||
    event.vendor_exclusivity === "APPLICATIONS_NO_PAYMENT";

  const isSoldOut = table.quantity === 0;

  const autofillVendorInfo = () => {
    let vendorInfo: VendorInfo = {} as VendorInfo;
    if (profile) {
      vendorInfo = {
        phone: formatPhoneNumber(
          profile.phone?.slice(profile?.phone.length - 10) || ""
        ),
        email: profile.email,
        businessName: profile.business_name,
        firstName: profile.first_name,
        lastName: profile.last_name,
        instagram: profile.instagram,
      };
    }
    applicationDispatch({ type: "setVendorInfo", payload: vendorInfo });
  };

  const handleCheckout = async () => {
    if (areApplicationsOpen) {
      applicationDispatch({ type: "setTable", payload: table });
      applicationDispatch({ type: "setTableQuantity", payload: tableCount });
      autofillVendorInfo();
      flowDispatch({ type: "setCurrentView", payload: TableView.Application });
    }
  };

  return (
    <Button
      disabled={!areApplicationsOpen || isSoldOut}
      onClick={async () => await handleCheckout()}
      className="w-full rounded-full p-6 relative"
    >
      {areApplicationsOpen ? (
        <p>Continue to Registration</p>
      ) : (
        <p>Not Accepting Applications</p>
      )}
      {isSoldOut && (
        <div className="absolute -rotate-12 bg-red-500 p-2 w-36">Sold Out</div>
      )}
    </Button>
  );
}
