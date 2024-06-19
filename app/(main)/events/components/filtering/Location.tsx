"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { MapPinIcon, LocateFixedIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Location() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const cities = [
    {
      value: "new-york-ny",
      label: "New York, NY",
    },
    {
      value: "washington-dc",
      label: "Washington, DC",
    },
    {
      value: "boston-ma",
      label: "Boston, MA",
    },
    {
      value: "chicago-il",
      label: "Chicago, IL",
    },
    {
      value: "los-angeles-ca",
      label: "Los Angeles, CA",
    },
    {
      value: "san-francisco-ca",
      label: "San Francisco, CA",
    },
    {
      value: "seattle-wa",
      label: "Seattle, WA",
    },
    {
      value: "austin-tx",
      label: "Austin, TX",
    },
    {
      value: "denver-co",
      label: "Denver, CO",
    },
    {
      value: "dallas-tx",
      label: "Dallas, TX",
    },
    {
      value: "houston-tx",
      label: "Houston, TX",
    },
    {
      value: "miami-fl",
      label: "Miami, FL",
    },
    {
      value: "atlanta-ga",
      label: "Atlanta, GA",
    },
    {
      value: "philadelphia-pa",
      label: "Philadelphia, PA",
    },
    {
      value: "phoenix-az",
      label: "Phoenix, AZ",
    },
    {
      value: "san-diego-ca",
      label: "San Diego, CA",
    },
    {
      value: "minneapolis-mn",
      label: "Minneapolis, MN",
    },
    {
      value: "portland-or",
      label: "Portland, OR",
    },
    {
      value: "detroit-mi",
      label: "Detroit, MI",
    },
    {
      value: "salt-lake-city-ut",
      label: "Salt Lake City, UT",
    },
    {
      value: "las-vegas-nv",
      label: "Las Vegas, NV",
    },
    {
      value: "charlotte-nc",
      label: "Charlotte, NC",
    },
    {
      value: "raleigh-nc",
      label: "Raleigh, NC",
    },
    {
      value: "nashville-tn",
      label: "Nashville, TN",
    },
    {
      value: "new-orleans-la",
      label: "New Orleans, LA",
    },
    {
      value: "pittsburgh-pa",
      label: "Pittsburgh, PA",
    },
    {
      value: "indianapolis-in",
      label: "Indianapolis, IN",
    },
    {
      value: "columbus-oh",
      label: "Columbus, OH",
    },
    {
      value: "milwaukee-wi",
      label: "Milwaukee, WI",
    },
    {
      value: "st-louis-mo",
      label: "St. Louis, MO",
    },
    {
      value: "kansas-city-mo",
      label: "Kansas City, MO",
    },
    {
      value: "oklahoma-city-ok",
      label: "Oklahoma City, OK",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between space-x-1"
        >
          <MapPinIcon className="h-4 w-4" />
          <p>
            {value
              ? cities.find((city) => city.value === value)?.label
              : "New York, NY"}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 mt-1" align="start">
        <Command>
          <CommandInput className="text-sm" placeholder="Search city..." />
          <CommandEmpty>No cities found.</CommandEmpty>
          <CommandGroup className="overflow-scroll overflow-x-hidden h-72">
            {cities.map((city) => (
              <CommandItem
                className="py-2"
                key={city.value}
                value={city.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <Button
              variant={"ghost"}
              className="rounded-none w-full font-normal"
            >
              <LocateFixedIcon className="mr-2 h-4 w-4" />
              <p>Use My Current Location</p>
            </Button>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup className="p-4">
            <Slider max={100} step={25} />
            <div className="flex justify-between mt-2 text-[.62rem]">
              <p>0 mi</p>
              <p>25 mi</p>
              <p>50 mi</p>
              <p>75 mi</p>
              <p>100 mi</p>
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
