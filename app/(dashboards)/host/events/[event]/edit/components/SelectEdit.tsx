"use client";
import { TicketIcon, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SelectEdit({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (selected: string) => void;
}) {
  const editOptions = [
    { name: "Tickets", Icon: TicketIcon },
    { name: "Vendors", Icon: Users },
    { name: "Event Info", Icon: Calendar },
  ];

  const renderEditOptions = () => {
    return editOptions.map(({ name, Icon }) => {
      return (
        <div
          onClick={() => onSelect(name)}
          className="flex items-center justify-center w-full hover:cursor-pointer relative"
        >
          <Icon
            className={cn(
              "w-8 h-8 stroke-1 m-auto",
              active === name ? "text-foreground" : "text-secondary"
            )}
          />
          {active === name && (
            <div className="absolute bottom-[-9px] h-[1px] w-full bg-foreground" />
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex space-x-4 w-full md:w-[40rem] m-auto justify-between">
      {renderEditOptions()}
    </div>
  );
}
