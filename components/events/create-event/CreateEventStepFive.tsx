"use client";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EventForm } from "@/types/event";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { createEvent } from "@/lib/actions/events";
import { createClient } from "@/utils/supabase/client";
import PreviewEvent from "./PreviewEvent";

interface Step3Props {
  onBack: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const stepTwoSchema = z.object({
  venue_map_url: z.union([z.instanceof(File), z.string()]).optional(),
});

export default function Step5({ onBack, eventForm, setEventForm }: Step3Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      venue_map_url: eventForm.venue_map_url,
    },
  });

  const onSubmit = async () => {
    const newForm = {
      ...eventForm,
      ...form.getValues(),
    };

    const venueMap = newForm.venue_map_url;
    if (venueMap) {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("venue_maps")
        .upload(`venueMap${Date.now()}.png`, venueMap);
      if (data) {
        newForm.venue_map_url = data.path;
      }
    }

    const poster = newForm.poster_url;
    if (poster) {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("posters")
        .upload(`poster${Date.now()}.png`, poster);

      if (data) {
        newForm.poster_url = data.path;
        await createEvent(newForm);
      }
    }
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <h1 className="text-3xl font-semibold">Create Event</h1>
          <FormField
            control={form.control}
            name="venue_map_url"
            render={({ field }) => (
              <FormItem className="flex mx-auto">
                <FormLabel
                  className="hover:cursor-pointer relative group"
                  htmlFor="poster"
                >
                  {imageUrl && (
                    <div className="">
                      <img
                        src={imageUrl}
                        alt="Uploaded image"
                        className="w-full h-auto rounded-md"
                      />
                      <div className="w-full h-full absolute top-0 hover:bg-black hover:bg-opacity-50 transition duration-300 flex items-center justify-center">
                        <h1 className="hidden group-hover:block">
                          Replace Venue Map
                        </h1>
                      </div>
                    </div>
                  )}
                  {!imageUrl && (
                    <div className="p-40 border-2 border-gray-300 rounded-md">
                      <h1>Upload Venue Map</h1>
                    </div>
                  )}
                </FormLabel>
                <FormControl>
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
                </FormControl>
                <div className="h-1">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button className="w-full" onClick={() => onBack()}>
                Back
              </Button>
              <Button className="w-full" type="submit">
                Create Event
              </Button>
            </div>
            <Dialog>
              <DialogTrigger>
                <Button type="button" className="w-full" variant={"secondary"}>
                  Preview Event
                </Button>
              </DialogTrigger>
              <DialogContent className="h-[90%] overflow-scroll scrollbar-hidden">
                <h1 className="font-bold text-xl">Preview</h1>
                <PreviewEvent
                  event={{ ...eventForm, venue_map_url: imageUrl }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
  );
}
