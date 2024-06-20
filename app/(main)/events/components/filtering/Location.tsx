"use client";

import { Check } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cityMap } from "@/lib/helpers/cities";
import { useLoadScript } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import { getGeocode } from "use-places-autocomplete";

const libraries: Libraries = ["geocoding"];

export default function Location() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchParams.get("city") || "new-york-ny");
  const [sliderValue, setSliderValue] = useState<number[]>(
    searchParams.get("distance")
      ? [parseInt(searchParams.get("distance")!)]
      : [50]
  );
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const handleSelectCity = (city: string) => {
    setValue(city);
    const params = new URLSearchParams(searchParams);
    if (city === "new-york-ny") {
      params.delete("city");
    } else {
      params.set("city", city);
    }
    replace(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleDistanceSlider = (distance: number[]) => {
    setSliderValue(distance);
    const params = new URLSearchParams(searchParams);
    params.set("distance", distance[0].toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(success, error);
  };

  const success = async (position: GeolocationPosition) => {
    console.log(position);
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const geocoderRequest: google.maps.GeocoderRequest = {
      location: coords,
    };

    const results = await getGeocode(geocoderRequest);
    const address = results[0].address_components;
    let city: string[] = [];
    let state: string[] = [];
    address.forEach((component) => {
      if (component.types.includes("locality")) {
        city = [component.short_name, component.long_name];
      } else if (component.types.includes("administrative_area_level_1")) {
        state = [component.short_name, component.long_name];
      }
    });

    const cityParam = `${city[0]
      .toLowerCase()
      .replace(" ", "-")}-${state[0].toLowerCase()}`;

    setValue(cityParam);
    const params = new URLSearchParams(searchParams);
    params.set("city", cityParam);
    replace(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const error = (error: GeolocationPositionError) => {
    console.log(error);
  };

  const cities = Object.keys(cityMap).map((key) => ({
    value: key,
    label: cityMap[key].label,
  }));

  const allowedSliderValues = [5, 25, 50, 75, 100];

  let buttonLabel = "New York, NY";
  if (cityMap[value]) {
    buttonLabel = cityMap[value].label;
  } else {
    const splitCity = value.split("-");
    const stateName = splitCity[splitCity.length - 1];
    const cityName = splitCity
      .slice(0, splitCity.length - 1)
      .map((term) => capitalize(term))
      .join(" ");
    buttonLabel = `${cityName}, ${stateName.toUpperCase()}`;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between space-x-1"
        >
          <MapPinIcon className="h-4 w-4" />
          <p>{buttonLabel}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[250px] p-0 mt-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No cities found.</CommandEmpty>
          <CommandGroup className="overflow-auto max-h-72 h-auto">
            {cities.map((city) => (
              <CommandItem
                className="py-2"
                key={city.value}
                value={city.value}
                onSelect={(currentValue) => {
                  handleSelectCity(currentValue);
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
              onClick={useCurrentLocation}
              disabled={!cityMap[value]}
              className="rounded-none w-full font-normal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LocateFixedIcon className="mr-2 h-4 w-4" />
              <p>Use My Current Location</p>
            </Button>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup className="p-4">
            <Slider
              value={sliderValue}
              min={5}
              max={100}
              step={undefined}
              onValueChange={(value) => {
                const closestValue = allowedSliderValues.reduce((prev, curr) =>
                  Math.abs(curr - value[0]) < Math.abs(prev - value[0])
                    ? curr
                    : prev
                );
                handleDistanceSlider([closestValue]);
              }}
            />
            <div className="flex justify-between mt-2 text-[.62rem]">
              <p>5 mi</p>
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
