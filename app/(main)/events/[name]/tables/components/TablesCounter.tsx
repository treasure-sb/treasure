"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import { useVendorFlowStore } from "../store";
import { TableView } from "../store";
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";

export default function TablesCounter({
  event,
  table,
  user,
}: {
  event: EventDisplayData;
  table: Tables<"tables">;
  user: User | null;
}) {
  const { setCurrentView } = useVendorFlowStore();
  const [tableCount, setTableCount] = useState(1);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const minTables = 1;
  const maxTables = 6;

  const handleIncrement = () => {
    if (tableCount < maxTables) {
      setTableCount(tableCount + 1);
    }
  };

  const handleDecrement = () => {
    if (tableCount > minTables) {
      setTableCount(tableCount - 1);
    }
  };

  const handleCheckout = async () => {
    if (event.vendor_exclusivity === "APPLICATIONS") {
      setCurrentView(TableView.APPLICATION);
    }
  };

  const checkoutButton = (
    <Button
      disabled={creatingCheckout}
      onClick={async () => await handleCheckout()}
      className="w-full rounded-md"
    >
      Continue to Application
    </Button>
  );

  return (
    <div className="space-y-4 text-background">
      <div className="flex space-x-6 justify-center">
        <Button
          disabled={tableCount === minTables}
          className="text-4xl disabled:text-background/40 hover:bg-background/10 hover:text-background"
          variant={"ghost"}
          onClick={handleDecrement}
        >
          -
        </Button>
        <p className="text-3xl">{tableCount}</p>
        <Button
          disabled={tableCount === maxTables}
          className="text-4xl disabled:text-background/40 hover:bg-background/10 hover:text-background"
          variant={"ghost"}
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
      {user ? checkoutButton : <LoginFlowDialog trigger={checkoutButton} />}
    </div>
  );
}
