import { useLoadScript } from "@react-google-maps/api";
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
import type { Libraries } from "@react-google-maps/api";

const PlacesAutocomplete = ({
  setVenueLocation,
}: {
  setVenueLocation: any;
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
    let city = "";
    let state = "";
    result[0].address_components.forEach((component) => {
      if (component.types.includes("locality")) {
        city = component.short_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
    });
    const { lat, lng } = await getLatLng(result[0]);

    setVenueLocation({ address, lat, lng, city, state });
  };

  return (
    <Command>
      <CommandInput
        value={value}
        onValueChange={setValue}
        placeholder="Venue Address"
        className="placeholder:text-sm"
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

const libraries: Libraries = ["places"];
export default function Autocomplete({
  setVenueLocation,
}: {
  setVenueLocation: any;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  return (
    <div>
      {isLoaded && <PlacesAutocomplete setVenueLocation={setVenueLocation} />}
    </div>
  );
}
