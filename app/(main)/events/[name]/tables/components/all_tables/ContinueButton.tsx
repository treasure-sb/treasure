"use client";
import { Tables } from "@/types/supabase";
import { useVendorApplication } from "../../context/VendorApplicationContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableView, useVendorFlow } from "../../context/VendorFlowContext";

export default function ContinueButton({
  table,
  tableCount,
}: {
  table: Tables<"tables">;
  tableCount: number;
}) {
  const { state, dispatch } = useVendorFlow();
  const { profile, event } = state;

  const { dispatch: applicationDispatch } = useVendorApplication();
  const [creatingCheckout, setCreatingCheckout] = useState(false);

  const autofillVendorInfo = () => {
    const vendorInfo = {
      phone: profile?.phone || "",
      email: profile?.email || "",
      businessName: profile?.business_name || "",
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
    };
    applicationDispatch({ type: "setVendorInfo", payload: vendorInfo });
  };

  const handleCheckout = async () => {
    if (event.vendor_exclusivity === "APPLICATIONS") {
      applicationDispatch({ type: "setTable", payload: table });
      applicationDispatch({ type: "setTableQuantity", payload: tableCount });
      autofillVendorInfo();
      dispatch({ type: "setCurrentView", payload: TableView.Application });
    }
  };

  return (
    <Button
      disabled={creatingCheckout || event.vendor_exclusivity !== "APPLICATIONS"}
      onClick={async () => await handleCheckout()}
      className="w-full rounded-full p-6"
    >
      {event.vendor_exclusivity === "APPLICATIONS" ? (
        <p>Continue to Application</p>
      ) : (
        <p>Not Accepting Applications</p>
      )}
    </Button>
  );
}
