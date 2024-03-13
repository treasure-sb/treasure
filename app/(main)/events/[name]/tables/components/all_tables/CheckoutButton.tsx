"use client";
import { Tables } from "@/types/supabase";
import { useVendorApplicationStore } from "../vendor_applications/store";
import { useVendorFlowStore, TableView } from "../../store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export default function CheckoutButton({
  event,
  table,
  user,
  tableCount,
}: {
  event: Tables<"events">;
  table: Tables<"tables">;
  user: User | null;
  tableCount: number;
}) {
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const { setCurrentView } = useVendorFlowStore();
  const handleCheckout = async () => {
    if (event.vendor_exclusivity === "APPLICATIONS") {
      useVendorApplicationStore.setState({ tableQuantity: tableCount, table });
      setCurrentView(TableView.APPLICATION);
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
