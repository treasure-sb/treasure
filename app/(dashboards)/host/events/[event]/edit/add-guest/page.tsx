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

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  bio: z.string().min(1, {
    message: "Bio is required",
  }),
});

export default function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const onSubmit = async () => {
    let avatarSupabaseUrl = "default_avatar";
    if (avatarFile) {
      avatarSupabaseUrl = `avatar${Date.now()}`;
      await supabase.storage
        .from("guest_images")
        .upload(avatarSupabaseUrl, avatarFile);
    }

    const uploadForm = {
      ...form.getValues(),
      event_id: event,
      avatar_url: avatarSupabaseUrl,
    };

    await addGuest(uploadForm);
    toast.success("Guest added successfully");
  };

  return (
    <main className="w-full max-w-xl m-auto">
      <h1 className="font-bold text-2xl w-full mb-10 text-center">
        Add Guest to Event
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-sm m-auto mt-6"
        >
          <div className="flex gap-4">
            <AvatarEdit setAvatarFile={setAvatarFile} />

            <div className="flex flex-col gap-2">
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
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button className="m-auto px-10" type="submit">
              Add Guest
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
