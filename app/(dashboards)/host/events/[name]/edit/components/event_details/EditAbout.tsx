import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormType } from "./EditEventForm";
import { useState } from "react";
import { PencilIcon, EyeIcon } from "lucide-react";

export default function EditAbout({ form }: { form: FormType }) {
  const [edit, setEdit] = useState(false);

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem className="ml-2 my-4 md:mb-0">
          <FormLabel className="mb-2 flex space-x-2 items-center">
            <span className="text-lg font-semibold">About</span>
            {edit ? (
              <EyeIcon
                size={22}
                className="text-foreground/30 hover:text-foreground transition duration-500 hover:cursor-pointer"
                onClick={() => setEdit(false)}
              />
            ) : (
              <PencilIcon
                size={20}
                onClick={() => setEdit(true)}
                className="mb-2 text-foreground/30 hover:text-foreground transition duration-500 hover:cursor-pointer"
              />
            )}
          </FormLabel>
          <FormControl>
            {edit ? (
              <Textarea
                className="w-full h-60 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                {...field}
              ></Textarea>
            ) : (
              <p
                className="leading-2 whitespace-pre-line text-sm md:text-base text-foreground/80"
                onDoubleClick={() => setEdit(true)}
              >
                {field.value}
              </p>
            )}
          </FormControl>
          <FormMessage className="text-xs md:text-sm" />
        </FormItem>
      )}
    />
  );
}
