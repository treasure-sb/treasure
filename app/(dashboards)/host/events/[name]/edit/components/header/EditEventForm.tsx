import { z } from "zod";
import { EventDisplayData } from "@/types/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import CalendarIcon from "@/components/icons/CalendarIcon";
import EventPoster from "@/components/events/shared/EventPoster";
import { toast } from "sonner";
import { EditEvent, updateEvent } from "@/lib/actions/events";

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

export default function EditEventForm({ event }: { event: EventDisplayData }) {
  const [imageUrl, setImageUrl] = useState(event.publicPosterUrl);
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
    console.log(values);
    toast.loading("Updating event...");
    const editEventForm: EditEvent = {
      ...values,
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

    toast.dismiss();
    if (error) {
      toast.error("Error updating event, please try again");
      return;
    }
    toast.success("Event updated!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="posterUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="hover:cursor-pointer inline-block"
                  htmlFor="poster"
                >
                  {imageUrl && (
                    <div className="w-28 md:w-80 relative group">
                      <EventPoster posterUrl={imageUrl} />
                      <div className="absolute inset-0 rounded-xl hover:bg-black hover:bg-opacity-60 transition duration-300 flex items-center justify-center">
                        <p className="hidden group-hover:block transition duration-300">
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
                    placeholder="Ticket Quantity"
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
                <div className="h-1">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        className="border-none"
                        label="Event Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        className="border-none"
                        label="Venue Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="ml-2">
                    <FormLabel className="text-xs text-gray-500 ml-1">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea className="w-96" {...field}></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        className="border-none"
                        label="Start Time"
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FloatingLabelInput
                      className="border-none"
                      type="time"
                      label="End Time"
                      {...field}
                    />
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="ml-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "flex justify-between w-60 pl-2 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : format(new Date(event.date), "PPP")}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex">
          <Button type="submit" variant={"secondary"} className="ml-auto w-20">
            Edit
          </Button>
        </div>
      </form>
    </Form>
  );
}
