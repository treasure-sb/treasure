"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import CheckoutButton from "./CheckoutButton";

export default function TablesCounter({
  event,
  table,
  user,
}: {
  event: EventDisplayData;
  table: Tables<"tables">;
  user: User | null;
}) {
  const [tableCount, setTableCount] = useState(1);
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
      <CheckoutButton
        event={event}
        table={table}
        user={user}
        tableCount={tableCount}
      />
    </div>
  );
}
