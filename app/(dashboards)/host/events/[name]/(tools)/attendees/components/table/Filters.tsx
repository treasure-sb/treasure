import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Filters({
  ticketNames,
  ticketFilter,
  updateTicketFilter,
}: {
  ticketNames: string[];
  ticketFilter?: unknown;
  updateTicketFilter: (value: string | undefined) => void;
}) {
  return (
    <div className="flex space-x-2 overflow-scroll scrollbar-hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"dotted"} role="combobox">
            <p>Ticket Name</p>
            {ticketFilter ? (
              <span className="text-xs bg-secondary rounded-sm p-1">
                {ticketFilter as string}
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-1 bg-background">
          <Command>
            <CommandGroup>
              {ticketNames.map((ticketName) => (
                <CommandItem
                  key={ticketName}
                  onSelect={() => updateTicketFilter(ticketName)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      ticketFilter === ticketName ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {ticketName}
                </CommandItem>
              ))}
              {ticketFilter ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => updateTicketFilter(undefined)}
                    variant={"ghost"}
                    className="w-full rounded-sm"
                  >
                    Clear Filter
                  </Button>
                </>
              ) : null}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {ticketFilter ? (
        <Button
          onClick={() => {
            updateTicketFilter(undefined);
          }}
          className="rounded-sm"
          variant={"secondary"}
        >
          Reset
        </Button>
      ) : null}
    </div>
  );
}
