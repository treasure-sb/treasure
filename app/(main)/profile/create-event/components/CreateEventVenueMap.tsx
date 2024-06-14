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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EventForm } from "@/types/event";
import { useState } from "react";
import { createEvent } from "@/lib/actions/events";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import PreviewEvent from "@/components/events/shared/PreviewEvent";

interface Step5Props {
  onBack: () => void;
  eventForm: EventForm;
}

const stepTwoSchema = z.object({
  venue_map_url: z.union([z.instanceof(File), z.string()]).optional(),
});

export default function EventVenueMap({ onBack, eventForm }: Step5Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      venue_map_url: eventForm.venue_map_url,
    },
  });

  const uploadFile = async (file: any, storageFolder: string) => {
    if (file) {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from(storageFolder)
        .upload(`${storageFolder}${Date.now()}`, file);

      if (data) {
        return data.path;
      }
    }
    return null;
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const newForm = {
      ...eventForm,
      ...form.getValues(),
    };

    newForm.venue_map_url =
      (await uploadFile(newForm.venue_map_url, "venue_maps")) ||
      "venue_map_coming_soon";
    newForm.poster_url =
      (await uploadFile(newForm.poster_url, "posters")) || "poster_coming_soon";
    try {
      await createEvent(newForm);
    } catch (error) {
      toast.error("Error creating event");
      console.log(error);
    }
    setSubmitting(false);
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <div className="text-lg font-semibold text-primary">Venue Map</div>
          <FormField
            control={form.control}
            name="venue_map_url"
            render={({ field }) => (
              <FormItem className="flex mx-auto w-full h-full items-center justify-center">
                <FormLabel
                  className="hover:cursor-pointer relative group w-full"
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
                    <div className="h-60 w-full flex items-center justify-center border-2 border-gray-300 rounded-md">
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
              <Button
                className="w-full disabled:cursor-not-allowed"
                disabled={submitting}
                onClick={() => onBack()}
              >
                Back
              </Button>
              <Button
                className="w-full disabled:cursor-not-allowed"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Creating Event..." : "Create Event"}
              </Button>
            </div>
            <Dialog>
              <DialogTrigger>
                <Button
                  disabled={submitting}
                  type="button"
                  className="w-full disabled:cursor-not-allowed"
                  variant={"secondary"}
                >
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
