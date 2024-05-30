"use client";

import { z } from "zod";
import { EventDisplayData } from "@/types/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { EditEvent, EventLocation, updateEvent } from "@/lib/actions/events";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";
import EventPoster from "@/components/events/shared/EventPoster";
import Autocomplete from "@/app/(main)/profile/create-event/components/places/Autocomplete";
import EditLocation from "./EditLocation";
import EditTimeAndDate from "./EditTimeAndDate";
import EditTags from "./tags/EditTags";
import EditAbout from "./EditAbout";
import { EventTag, addEventTags, removeEventTags } from "@/lib/actions/tags";

const fixDate = (time: string) => {
  let fixedTime = time
    .slice(time.indexOf("-") + 1)
    .concat("-" + time.slice(0, time.indexOf("-")));
  fixedTime = fixedTime.replaceAll("-", "/");
  return new Date(fixedTime);
};

const isValidTime = (value: string) => {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
};

const replacePoster = async (posterUrl: string, newPosterFile: File) => {
  const supabase = createClient();

  const fileExtension = newPosterFile.name.split(".").pop();
  const { data, error: uploadError } = await supabase.storage
    .from("posters")
    .upload(`posters${Date.now()}.${fileExtension}`, newPosterFile);

  if (uploadError) {
    return { error: uploadError };
  }

  const { error: removeError } = await supabase.storage
    .from("posters")
    .remove([posterUrl]);

  return { data: data.path, error: removeError };
};

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  venueName: z.string().min(1, {
    message: "Location name is required",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().refine((value) => isValidTime(value), {
    message: "Must be a valid time (HH:mm)",
  }),
  endTime: z.string().refine((value) => isValidTime(value), {
    message: "Must be a valid time (HH:mm)",
  }),
  posterUrl: z.union([z.instanceof(File), z.string()]),
});

export type FormType = UseFormReturn<
  {
    name: string;
    description: string;
    venueName: string;
    date: Date;
    startTime: string;
    endTime: string;
    posterUrl: (string | File) & (string | File | undefined);
  },
  any,
  undefined
>;

export default function EditEventForm({
  event,
  initialTags,
  allTags,
}: {
  event: EventDisplayData;
  initialTags: Tables<"tags">[];
  allTags: Tables<"tags">[];
}) {
  const [imageUrl, setImageUrl] = useState(event.publicPosterUrl);
  const [venueLocation, setVenueLocation] = useState<EventLocation>({
    lat: event.lat,
    lng: event.lng,
    address: event.address,
    city: event.city,
    state: event.state,
  });

  const [selectedTags, setSelectedTags] = useState(initialTags);
  const handleTagsChange = (newTags: Tables<"tags">[]) => {
    setSelectedTags(newTags);
  };

  const { refresh } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      venueName: event.venue_name,
      startTime: event.start_time.slice(0, event.start_time.lastIndexOf(":")),
      endTime: event.end_time.slice(0, event.end_time.lastIndexOf(":")),
      date: fixDate(event.date),
      posterUrl: event.poster_url,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Updating event...");
    const editEventForm: EditEvent = {
      ...values,
      ...venueLocation,
      posterUrl: "",
    };

    if (imageUrl !== event.publicPosterUrl) {
      const { data: updatedPosterUrl, error } = await replacePoster(
        event.poster_url,
        values.posterUrl as File
      );
      if (error) {
        toast.dismiss();
        toast.error("Error replacing image, please try again");
        return;
      }
      if (updatedPosterUrl) {
        editEventForm.posterUrl = updatedPosterUrl;
      }
    } else {
      editEventForm.posterUrl = event.poster_url;
    }

    const { error } = await updateEvent(editEventForm, event.id);
    const { addError, removeError } = await updateTags();

    toast.dismiss();
    if (error) {
      toast.error("Error updating event, please try again");
      return;
    } else if (addError || removeError) {
      toast.error("Error updating tags, please try again");
    }
    toast.success("Event updated!");
    refresh();
  };

  const updateTags = async () => {
    const tagsToDelete: EventTag[] = initialTags
      .filter(
        (tag) =>
          !selectedTags.some((selectedTag) => selectedTag.name === tag.name)
      )
      .map((tag) => ({
        event_id: event.id,
        tag_id: tag.id,
      }));

    const tagsToAdd: EventTag[] = selectedTags
      .filter(
        (tag) => !initialTags.some((initTag) => initTag.name === tag.name)
      )
      .map((tag) => ({
        event_id: event.id,
        tag_id: tag.id,
      }));

    const [addResult, removeResult] = await Promise.allSettled([
      addEventTags(tagsToAdd),
      removeEventTags(tagsToDelete),
    ]);
    const addError =
      addResult.status === "rejected"
        ? addResult.reason
        : addResult.value.error;
    const removeError =
      removeResult.status === "rejected"
        ? removeResult.reason
        : removeResult.value.error;

    return { addError, removeError };
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto flex flex-col md:flex-row md:justify-between md:space-x-14 mb-4">
          <FormField
            control={form.control}
            name="posterUrl"
            render={({ field }) => (
              <FormItem className="mx-auto">
                <FormLabel
                  className="hover:cursor-pointer inline-block"
                  htmlFor="poster"
                >
                  {imageUrl && (
                    <div className="w-full group max-w-xl relative z-10">
                      <EventPoster posterUrl={imageUrl} />
                      <div className="absolute inset-0 rounded-xl hover:bg-black hover:bg-opacity-60 transition duration-500 flex items-center justify-center">
                        <p className="hidden group-hover:block">
                          Replace Poster
                        </p>
                      </div>
                    </div>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    id="poster"
                    className="hidden"
                    type="file"
                    multiple={false}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        setImageUrl(URL.createObjectURL(file));
                      }
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-left w-full max-w-xl md:max-w-2xl mx-auto relative z-20 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none h-14 text-4xl md:text-5xl font-semibold"
                      placeholder="Event Name"
                    />
                  </FormControl>
                  <FormMessage className="absolute left-28 top-1" />
                </FormItem>
              )}
            />
            <EditTags
              allTags={allTags}
              handleTagsChange={handleTagsChange}
              selectedTags={selectedTags}
            />
            <EditTimeAndDate form={form} event={event} />
            <EditLocation
              form={form}
              setVenueLocation={setVenueLocation}
              venueLocation={venueLocation}
            />
            <EditAbout form={form} />
          </div>
        </div>
        <div className="md:max-w-[1160px] max-w-xl mx-auto flex justify-end">
          <Button type="submit" className="w-40">
            Edit Basic Info
          </Button>
        </div>
      </form>
    </Form>
  );
}
