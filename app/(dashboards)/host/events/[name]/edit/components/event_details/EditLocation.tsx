import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPinIcon } from "lucide-react";
import { FormType } from "./EditEventForm";
import { PencilIcon, EyeIcon, ArrowUpRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { EventLocation } from "@/lib/actions/events";
import Link from "next/link";
import Autocomplete from "@/app/(main)/profile/create-event/components/places/Autocomplete";

export default function EditLocation({
  form,
  venueLocation,
  setVenueLocation,
}: {
  form: FormType;
  venueLocation: EventLocation;
  setVenueLocation: Dispatch<SetStateAction<EventLocation>>;
}) {
  const [edit, setEdit] = useState(false);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueLocation.address
  )}`;

  return (
    <div>
      <div className="flex space-x-2 items-center relative w-fit">
        <MapPinIcon className="stroke-1 text-foreground/60" />
        <FormField
          control={form.control}
          name="venueName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {edit ? (
                  <Input
                    className="border-none"
                    {...field}
                    placeholder="Venue Name"
                  />
                ) : (
                  <Link
                    target="_blank"
                    href={googleMapsUrl}
                    className="relative group flex"
                  >
                    <p>{field.value}</p>
                    <ArrowUpRight
                      size={18}
                      className="stroke-1 text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 group-hover:text-foreground"
                    />
                  </Link>
                )}
              </FormControl>
            </FormItem>
          )}
        />
        {!edit && (
          <PencilIcon
            size={20}
            onClick={() => setEdit(true)}
            className="absolute -top-1 -right-8 text-foreground/30 hover:text-foreground transition duration-500 hover:cursor-pointer"
          />
        )}
      </div>
      {edit && (
        <>
          <div className="w-full md:w-[75%]">
            <Autocomplete setVenueLocation={setVenueLocation} />
          </div>
          <div className="flex justify-end">
            <EyeIcon
              size={22}
              className="text-foreground/30 hover:text-foreground transition duration-500 hover:cursor-pointer"
              onClick={() => setEdit(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
