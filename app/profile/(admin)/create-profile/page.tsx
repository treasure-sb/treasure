"use client";

import AvatarEdit from "../../edit-profile/AvatarEdit";
import * as z from "zod";
import { createTemporaryProfile } from "@/lib/actions/profile";
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

const formSchema = z.object({
  business_name: z.string().min(1, {
    message: "First Name is required",
  }),
  username: z.string().min(1, {
    message: "Username is required",
  }),
  instagram: z.string().optional(),
});

export default function Page() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      username: "",
      instagram: "",
    },
  });

  const onSubmit = async () => {
    let avatarSupabaseUrl = "default_avatar.jpeg";
    if (avatarFile) {
      avatarSupabaseUrl = `avatar${Date.now()}`;
      await supabase.storage
        .from("avatars")
        .upload(avatarSupabaseUrl, avatarFile);
    }

    const uploadForm = {
      ...form.getValues(),
      avatar_url: avatarSupabaseUrl,
    };

    await createTemporaryProfile(uploadForm);
  };

  return (
    <main className="w-full max-w-xl m-auto">
      <h1 className="font-bold text-2xl w-full mb-10 text-center">
        Create Temporary Profile
      </h1>
      <AvatarEdit setAvatarFile={setAvatarFile} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-sm m-auto mt-6"
        >
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Business Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Instagram (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Create
          </Button>
        </form>
      </Form>
    </main>
  );
}
