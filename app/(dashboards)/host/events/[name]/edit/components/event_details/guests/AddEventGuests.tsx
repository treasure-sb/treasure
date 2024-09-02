"use client";
import AvatarEdit from "@/app/(main)/profile/edit-profile/components/AvatarEdit";
import * as z from "zod";
import { addGuest } from "@/lib/actions/edit-events";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EventWithDates } from "@/types/event";
import { PlusIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  bio: z.string().min(1, {
    message: "Bio is required",
  }),
});

export default function AddEventGuests({ event }: { event: EventWithDates }) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { refresh } = useRouter();
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const reset = () => {
    setAvatarFile(null);
    form.reset();
  };

  const onSubmit = async () => {
    toast.loading("Adding guest...");
    let avatarSupabaseUrl = "default_avatar";
    if (avatarFile) {
      avatarSupabaseUrl = `avatar${Date.now()}`;
      await supabase.storage
        .from("guest_images")
        .upload(avatarSupabaseUrl, avatarFile);
    }

    const uploadForm = {
      ...form.getValues(),
      event_id: event.id,
      avatar_url: avatarSupabaseUrl,
    };

    const { error } = await addGuest(uploadForm);
    toast.dismiss();

    if (error) {
      toast.error("Error adding guests");
      return;
    }

    toast.success("Guest added successfully");
    reset();
    refresh();
  };

  return (
    <Form {...form}>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="w-full p-8 rounded-none bg-slate-500/5 hover:cursor-pointer hover:bg-slate-400/5 transition duration-500 text-muted-foreground dark:text-muted-forground hover:text-foreground"
            type="button"
          >
            <PlusIcon className="mr-2" />
            <p>Add Guest</p>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mb-6">
            <SheetTitle>Add Guest</SheetTitle>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="w-fit">
              <AvatarEdit setAvatarFile={setAvatarFile} />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="rounded-sm w-full" type="submit">
              Add Guest
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </Form>
  );
}
