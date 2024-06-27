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
  typeFilter,
  updateTypeFilter,
}: {
  typeFilter?: unknown;
  updateTypeFilter: (value: string | undefined) => void;
}) {
  return (
    <div className="flex space-x-2 overflow-scroll scrollbar-hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"dotted"} role="combobox">
            <p>Item Type</p>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-3 transition-all duration-300",
                typeFilter === "TICKET"
                  ? "bg-tertiary"
                  : typeFilter === "TABLE"
                  ? "bg-primary"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-1 bg-background">
          <Command>
            <CommandGroup>
              <CommandItem onSelect={() => updateTypeFilter("TICKET")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    typeFilter === "TICKET" ? "opacity-100" : "opacity-0"
                  )}
                />
                Tickets
              </CommandItem>
              <CommandItem onSelect={() => updateTypeFilter("TABLE")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    typeFilter === "TABLE" ? "opacity-100" : "opacity-0"
                  )}
                />
                Tables
              </CommandItem>
              {typeFilter ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => updateTypeFilter(undefined)}
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
      {typeFilter ? (
        <Button
          onClick={() => {
            updateTypeFilter(undefined);
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
