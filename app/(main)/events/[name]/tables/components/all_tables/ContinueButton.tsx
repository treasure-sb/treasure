"use client";
import { Tables } from "@/types/supabase";
import { useVendorApplicationStore } from "../vendor_applications/store";
import { useVendorFlowStore, TableView } from "../../store";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContinueButton({
  table,
  tableCount,
}: {
  table: Tables<"tables">;
  tableCount: number;
}) {
  const { event, profile, setCurrentView } = useVendorFlowStore();
  const { setVendorInfo } = useVendorApplicationStore();
  const [creatingCheckout, setCreatingCheckout] = useState(false);

  const autofillVendorInfo = () => {
    setVendorInfo({
      phone: profile?.phone || "",
      email: profile?.email || "",
      businessName: profile?.business_name || "",
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
    });
  };

  const handleCheckout = async () => {
    if (event.vendor_exclusivity === "APPLICATIONS") {
      useVendorApplicationStore.setState({
        tableQuantity: tableCount,
        table,
      });
      autofillVendorInfo();
      setCurrentView(TableView.Application);
    }
  };

  return (
    <Button
      disabled={creatingCheckout}
      onClick={async () => await handleCheckout()}
      className="w-full rounded-full p-6"
    >
      Continue to Application
    </Button>
  );
}
