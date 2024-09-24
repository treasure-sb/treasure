"use client";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { CreateEvent } from "../../../schema";
import { useFormContext } from "react-hook-form";
import CreateEventCard from "../../CreateEventCard";

export default function EventPoster() {
  const { control, getValues } = useFormContext<CreateEvent>();
  const poster = getValues("poster");

  const [imageUrl, setImageUrl] = useState<string | null>(
    poster ? URL.createObjectURL(poster as File) : null
  );

  return (
    <FormField
      control={control}
      name="poster"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <>
              <Label
                className="hover:cursor-pointer relative group block w-full aspect-w-16 aspect-h-16"
                htmlFor="poster"
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
                        Replace Poster
                      </h1>
                    </div>
                  </div>
                ) : (
                  <CreateEventCard className="bg-opacity-40 h-full flex flex-col items-center justify-center px-10 lg:px-2 hover:bg-opacity-60 transition duration-300">
                    <p className="text-4xl md:text-5xl font-extrabold text-center leading-[1.3] mb-4 lg:mb-10">
                      DESIGN YOUR EVENT PAGE
                    </p>
                    <p className="text-center text-muted-foreground leading-6">
                      Don't have a poster yet?
                      <br />
                      Upload one later
                    </p>
                  </CreateEventCard>
                )}
              </Label>
              <Input
                id="poster"
                className="hidden"
                placeholder="Ticket Quantity"
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
