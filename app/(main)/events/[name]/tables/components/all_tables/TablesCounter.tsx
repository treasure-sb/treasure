"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import ContinueButton from "./ContinueButton";

export default function TablesCounter({ table }: { table: Tables<"tables"> }) {
  const [tableCount, setTableCount] = useState(1);
  const minTables = 1;
  const maxTables = Math.min(table.quantity, 6);

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
    <div className="space-y-4 dark:text-background">
      <div className="flex space-x-6 justify-center">
        <Button
          disabled={tableCount === minTables}
          className="text-4xl disabled:text-foreground/40 dark:disabled:text-background/40 dark:hover:bg-background/10 dark:hover:text-background"
          variant={"ghost"}
          onClick={handleDecrement}
        >
          -
        </Button>
        <p className="text-3xl">{tableCount}</p>
        <Button
          disabled={tableCount === maxTables}
          className="text-4xl disabled:text-foreground/40 dark:disabled:text-background/40 dark:hover:bg-background/10 dark:hover:text-background"
          variant={"ghost"}
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
      <ContinueButton table={table} tableCount={tableCount} />
    </div>
  );
}
