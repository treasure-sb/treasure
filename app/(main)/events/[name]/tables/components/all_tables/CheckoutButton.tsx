"use client";
import { Tables } from "@/types/supabase";
import { useVendorApplicationStore } from "../vendor_applications/store";
import { useVendorFlowStore, TableView } from "../../store";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CheckoutButton({
  table,
  tableCount,
}: {
  table: Tables<"tables">;
  tableCount: number;
}) {
  const { event } = useVendorFlowStore();
  const [creatingCheckout, setCreatingCheckout] = useState(false);

  const handleCheckout = async () => {
    if (event.vendor_exclusivity === "APPLICATIONS") {
      useVendorApplicationStore.setState({ tableQuantity: tableCount, table });
      useVendorFlowStore.setState({
        currentView: TableView.Application,
      });
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
