"use client";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../../../schema";
import CreateEventCard from "../../CreateEventCard";

export default function EventVenueMap() {
  const { control, getValues } = useFormContext<CreateEvent>();
  const venueMap = getValues("venueMap");
  const [imageUrl, setImageUrl] = useState<string | null>(
    venueMap ? URL.createObjectURL(venueMap as File) : null
  );

  return (
    <FormField
      control={control}
      name="venueMap"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <>
              <Label
                className="hover:cursor-pointer relative group block w-full aspect-w-16 aspect-h-8"
                htmlFor="map"
              >
                {imageUrl ? (
                  <div className="w-full h-full">
                    <img
                      src={imageUrl}
                      alt="Uploaded image"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 hover:bg-black hover:bg-opacity-50 transition duration-300 flex items-center justify-center rounded-md">
                      <h1 className="hidden group-hover:block text-white">
                        Replace Map
                      </h1>
                    </div>
                  </div>
                ) : (
                  <CreateEventCard className="bg-opacity-40 h-full flex flex-col items-center justify-center px-10 lg:px-2 hover:bg-opacity-60 transition duration-300">
                    <p className="text-2xl md:text-3xl font-extrabold text-center leading-[1.3] mb-1 lg:mb-2">
                      DESIGN YOUR VENUE MAP
                    </p>
                    <p className="text-center text-muted-foreground leading-6 text-xs lg:text-sm">
                      Don't have a venue map yet?
                      <br />
                      Upload one later
                    </p>
                  </CreateEventCard>
                )}
              </Label>
              <Input
                id="map"
                className="hidden"
                type="file"
                multiple={false}
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    setImageUrl(URL.createObjectURL(file));
                  }
                  field.onChange(file);
                }}
              />
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
