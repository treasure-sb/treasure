import TagInput from "@/components/events/shared/TagInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useCreateEvent } from "../../../context/CreateEventContext";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../../../schema";
import CreateEventCard from "../../CreateEventCard";

export default function EventTags() {
  const { tags } = useCreateEvent();
  const { control } = useFormContext<CreateEvent>();

  return (
    <CreateEventCard title="Event Tags">
      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TagInput
                initialTags={field.value}
                allTags={tags}
                onTagsChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </CreateEventCard>
  );
}
