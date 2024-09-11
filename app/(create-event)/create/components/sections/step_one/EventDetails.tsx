import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { TextareaWithLabel } from "@/components/ui/custom/textarea-with-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import CreateEventCard from "../../CreateEventCard";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../../../schema";

export default function EventDetails() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateEvent>();

  return (
    <CreateEventCard title="Event Details">
      <div className="space-y-2">
        <FormField
          control={control}
          name="basicDetails.name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabel
                  label="Event Name"
                  placeholder="Enter the event name"
                  {...field}
                  error={errors.basicDetails?.name}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="basicDetails.venueName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabel
                  label="Venue Name"
                  placeholder="Enter the venue name"
                  {...field}
                  error={errors.basicDetails?.venueName}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="basicDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextareaWithLabel
                  label="Description"
                  placeholder="Add a description of your event"
                  {...field}
                  error={errors.basicDetails?.description}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </CreateEventCard>
  );
}
