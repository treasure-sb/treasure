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
  statusFilter,
  updateTypeFilter,
  updateStatusFilter,
}: {
  typeFilter?: unknown;
  statusFilter?: unknown;
  updateTypeFilter: (value: string | undefined) => void;
  updateStatusFilter: (value: string | undefined) => void;
}) {
  return (
    <div className="flex space-x-2 overflow-scroll scrollbar-hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"dotted"} role="combobox">
            <p>Promo Type</p>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-2 transition-all duration-300",
                typeFilter === "DOLLAR"
                  ? "bg-primary"
                  : typeFilter === "PERCENT"
                  ? "bg-tertiary"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-1 bg-background">
          <Command>
            <CommandGroup>
              <CommandItem onSelect={() => updateTypeFilter("DOLLAR")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    typeFilter === "DOLLAR" ? "opacity-100" : "opacity-0"
                  )}
                />
                Dollar
              </CommandItem>
              <CommandItem onSelect={() => updateTypeFilter("PERCENT")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    typeFilter === "PERCENT" ? "opacity-100" : "opacity-0"
                  )}
                />
                Percent
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"dotted"} role="combobox">
            <p>Status</p>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-3 transition-all duration-300",
                statusFilter === "ACTIVE"
                  ? "bg-green-600"
                  : statusFilter === "INACTIVE"
                  ? "bg-red-600"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-1 bg-background">
          <Command>
            <CommandGroup>
              <CommandItem onSelect={() => updateStatusFilter("ACTIVE")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    typeFilter === "DOLLAR" ? "opacity-100" : "opacity-0"
                  )}
                />
                Active
              </CommandItem>
              <CommandItem onSelect={() => updateStatusFilter("INACTIVE")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    typeFilter === "PERCENT" ? "opacity-100" : "opacity-0"
                  )}
                />
                Inactive
              </CommandItem>
              {statusFilter ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => updateStatusFilter(undefined)}
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
      {statusFilter || typeFilter ? (
        <Button
          onClick={() => {
            updateStatusFilter(undefined);
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
