"use client";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventForm } from "@/types/event";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { EventFormLocation } from "@/types/event";
import Autocomplete from "../../places/Autocomplete";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

interface Step1Props {
  onNext: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const stepOneSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  venue_name: z.string().min(1, {
    message: "Location name is required",
  }),
});

export default function Step1({ onNext, eventForm, setEventForm }: Step1Props) {
  const [tags, setTags] = useState<any[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [venueLocation, setVenueLocation] = useState<EventFormLocation | null>(
    null
  );
  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: eventForm.name,
      description: eventForm.description,
      venue_name: eventForm.venue_name,
    },
  });

  const handleNext = () => {
    const newForm = {
      ...eventForm,
      ...venueLocation,
      ...form.getValues(),
    };
    setEventForm(newForm);
    onNext();
  };

  // get events tags
  const supabase = createClient();
  useEffect(() => {
    const getTags = async () => {
      const { data: tags, error } = await supabase
        .from("tags")
        .select("*")
        .ilike("name", `%${tagSearch}%`)
        .order("name", { ascending: true });

      if (tags) {
        setTags(tags);
      }
    };
    getTags();
  }, [tagSearch]);

  const handleTagSelect = (tag: any) => {
    if (!eventForm.tags.some((eventTag) => eventTag.tag_name === tag.name)) {
      setEventForm({
        ...eventForm,
        tags: [...eventForm.tags, { tag_name: tag.name, tag_id: tag.id }],
      });
    } else {
      setEventForm({
        ...eventForm,
        tags: eventForm.tags.filter(
          (eventTag) => eventTag.tag_name !== tag.name
        ),
      });
    }
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className="flex flex-col justify-between h-full"
        >
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Event Name" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Small Description" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venue_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Venue Name" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div>
              <Input
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Search for tags..."
              ></Input>
              <div className="flex overflow-scroll scrollbar-hidden h-12 space-x-2 mt-4">
                {tags?.map((tag) => (
                  <Button
                    onClick={() => handleTagSelect(tag)}
                    variant={
                      eventForm.tags.some(
                        (eventTag) => eventTag.tag_name === tag.name
                      )
                        ? "default"
                        : "secondary"
                    }
                    type="button"
                    className="h-8"
                    key={tag.id}
                  >
                    <h1>{tag.name}</h1>
                  </Button>
                ))}
              </div>
            </div>
            <Autocomplete setVenueLocation={setVenueLocation} />
          </div>
          <Button type="submit" className="w-full py-6">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
