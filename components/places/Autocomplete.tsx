import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { EventFormLocation } from "@/types/event";
import { useState } from "react";

const PlacesAutocomplete = ({
  setVenueLocation,
}: {
  setVenueLocation: React.Dispatch<
    React.SetStateAction<EventFormLocation | null>
  >;
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    const result = await getGeocode({ address });
    const { lat, lng } = await getLatLng(result[0]);
    setVenueLocation({ address, lat, lng });
  };

  return (
    <Command>
      <CommandInput
        value={value}
        onValueChange={setValue}
        placeholder="Venue Address"
      />
      <CommandList>
        <CommandGroup>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <CommandItem
                key={place_id}
                value={description}
                onSelect={handleSelect}
              >
                {description}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default function Autocomplete({
  setVenueLocation,
}: {
  setVenueLocation: React.Dispatch<
    React.SetStateAction<EventFormLocation | null>
  >;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  return (
    <div>
      {isLoaded && <PlacesAutocomplete setVenueLocation={setVenueLocation} />}
    </div>
  );
}
