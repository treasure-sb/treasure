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
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

const PlacesAutocomplete = ({
  onChange,
  error,
}: {
  onChange: (value: any) => void;
  error?: FieldError;
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    console.log(address);
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
    onChange({ address, lat, lng, city, state });
  };

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
          onChange({
            address: newValue,
            lat: null,
            lng: null,
            city: "",
            state: "",
          });
        }}
        placeholder="Enter the event address"
        className="placeholder:text-sm bg-field font-light"
        error={error}
      />
      <CommandList>
        <CommandGroup>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <CommandItem
                key={place_id}
                value={description}
                onSelect={() => handleSelect(description)}
                className="bg-field rounded-none h-10"
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
  onChange,
  error,
}: {
  onChange: (value: any) => void;
  error?: FieldError;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  return (
    <div>
      {isLoaded && <PlacesAutocomplete onChange={onChange} error={error} />}
    </div>
  );
}
