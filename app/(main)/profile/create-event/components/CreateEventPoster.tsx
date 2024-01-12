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
import { Input } from "@/components/ui/input";
import { EventForm } from "@/types/event";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const stepTwoSchema = z.object({
  poster_url: z.union([z.instanceof(File), z.string()]).optional(),
});

export default function EventPoster({
  onNext,
  onBack,
  eventForm,
  setEventForm,
}: Step4Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    eventForm.poster_url instanceof File
      ? URL.createObjectURL(eventForm.poster_url)
      : null
  );
  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      poster_url: eventForm.poster_url,
    },
  });

  const handleNext = async () => {
    const newForm = {
      ...eventForm,
      ...form.getValues(),
    };
    setEventForm(newForm);
    onNext();
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className="flex flex-col justify-between h-full"
        >
          <FormField
            control={form.control}
            name="poster_url"
            render={({ field }) => (
              <FormItem className="flex mx-auto justify-center items-center h-full w-full">
                <FormLabel
                  className="hover:cursor-pointer relative group w-full"
                  htmlFor="poster"
                >
                  {imageUrl && (
                    <div>
                      <img
                        src={imageUrl}
                        alt="Uploaded image"
                        className="w-full h-auto rounded-md"
                      />
                      <div className="w-full h-full absolute top-0 hover:bg-black hover:bg-opacity-50 transition duration-300 flex items-center justify-center">
                        <h1 className="hidden group-hover:block">
                          Replace Poster
                        </h1>
                      </div>
                    </div>
                  )}
                  {!imageUrl && (
                    <div className="flex h-80 w-full items-center justify-center  border-2 border-gray-300 rounded-md">
                      <h1>Upload Poster</h1>
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
          <div className="flex space-x-2">
            <Button className="w-full py-6" onClick={() => onBack()}>
              Back
            </Button>
            <Button className="w-full py-6" type="submit">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
