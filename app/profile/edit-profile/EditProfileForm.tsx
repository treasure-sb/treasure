"use client";

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
import { Button } from "@/components/ui/button";
import { editProfile } from "@/lib/actions/profile";
import AvatarEdit from "./AvatarEdit";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const profileSchema = z.object({
  first_name: z.string().min(1, {
    message: "First Name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last Name is required",
  }),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  bio: z.string().optional(),
});

interface EventFormProps {
  profile: any;
  avatarUrl: string;
}

export default function EditProfileForm({
  profile,
  avatarUrl,
}: EventFormProps) {
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

  //   Form Stuff
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name === null ? "" : profile.first_name,
      last_name: profile.last_name === null ? "" : profile.last_name,
      instagram: profile.instagram === null ? "" : profile.instagram,
      twitter: profile.twitter === null ? "" : profile.twitter,
      bio: profile.bio === null ? "" : profile.bio,
    },
  });

  //Form submit
  const onSubmit = async () => {
    const newForm = {
      ...profile,
      ...form.getValues(),
    };

    if (newAvatarFile) {
      const newAvatarSupabaseUrl = `avatar${Date.now()}`;
      newForm.avatar_url = newAvatarSupabaseUrl;
      const supabase = createClient();
      if (profile.avatar_url !== "default_avatar.jpeg") {
        await supabase.storage.from("avatars").remove([profile.avatar_url]);
      }
      await supabase.storage
        .from("avatars")
        .upload(newAvatarSupabaseUrl, newAvatarFile);
    }

    await editProfile(newForm);
  };

  return (
    <main className="m-auto max-w-lg">
      {profile.avatar_url ? (
        <AvatarEdit avatarUrl={avatarUrl} setAvatarFile={setNewAvatarFile} />
      ) : null}
      <div className="flex flex-col space-y-6 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-between h-full"
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Instagram Handle" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Twitter Handle" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Bio" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full py-6">
              Save
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
