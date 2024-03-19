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
import { Tables } from "@/types/supabase";
import { useState, useEffect } from "react";
import { editProfile } from "@/lib/actions/profile";
import { createLinks, updateLinks, deleteLinks } from "@/lib/actions/links";
import { createClient } from "@/utils/supabase/client";
import PaymentLinks from "./PaymentLinks";
import AvatarEdit from "./AvatarEdit";
import SocialLinks from "./SocialLinks";

const LinkSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  application: z.string().min(1, {
    message: "Application is required",
  }),
  type: z.string(),
});

const profileSchema = z.object({
  first_name: z.string().min(1, {
    message: "First Name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last Name is required",
  }),
  business_name: z.string().optional(),
  bio: z.string().optional(),
  social_links: z.array(LinkSchema).optional(),
  payment_links: z.array(LinkSchema).optional(),
});

interface EventFormProps {
  profile: Tables<"profiles">;
  avatarUrl: string;
  userLinks: Partial<Tables<"links">>[] | undefined;
}

export default function EditProfileForm({
  profile,
  avatarUrl,
  userLinks,
}: EventFormProps) {
  const [saving, setSaving] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      business_name: profile.business_name || "",
      bio: profile.bio || "",
    },
  });

  useEffect(() => {
    if (userLinks) {
      form.reset({
        ...form.getValues(),
        social_links: userLinks.filter((link) => link.type === "social"),
        payment_links: userLinks.filter((link) => link.type === "payment"),
      });
    }
  }, [userLinks, form]);

  const onSubmit = async () => {
    setSaving(true);
    const newForm = {
      ...profile,
      ...form.getValues(),
    };

    const userFormLinks = [
      ...(form.getValues().social_links ?? []),
      ...(form.getValues().payment_links ?? []),
    ];

    const removedLinks = userLinks?.filter(
      (obj) =>
        !userFormLinks.some((obj2) => obj2.application === obj.application)
    );

    const addedLinks = userFormLinks.filter(
      (obj) => !userLinks?.some((obj2) => obj2.application === obj.application)
    );

    const updatedLinks = userFormLinks.filter((obj) =>
      userLinks?.some((obj2) => {
        if (obj2.application === obj.application) {
          return obj2.username !== obj.username;
        }
      })
    );

    if (newAvatarFile) {
      const newAvatarSupabaseUrl = `avatar${Date.now()}`;
      newForm.avatar_url = newAvatarSupabaseUrl;
      const supabase = createClient();
      if (profile.avatar_url !== "default_avatar") {
        await supabase.storage.from("avatars").remove([profile.avatar_url]);
      }
      await supabase.storage
        .from("avatars")
        .upload(newAvatarSupabaseUrl, newAvatarFile);
    }

    const editPromise = [
      await editProfile(newForm, profile.id),
      await createLinks(addedLinks, profile.id),
      await updateLinks(updatedLinks, profile.id),
      removedLinks ? await deleteLinks(removedLinks, profile.id) : null,
    ];
    await Promise.all(editPromise);
    setSaving(false);
  };

  return (
    <main className="m-auto max-w-lg">
      {profile.avatar_url && (
        <AvatarEdit avatarUrl={avatarUrl} setAvatarFile={setNewAvatarFile} />
      )}
      <div className="flex flex-col space-y-6 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-between h-full"
          >
            <div className="space-y-6 my-10 flex flex-col">
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
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Business Name" {...field} />
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
              <SocialLinks
                form={form}
                userSocialLinks={userLinks?.filter(
                  (link) => link.type === "social"
                )}
              />
              <PaymentLinks
                form={form}
                userPaymentLinks={userLinks?.filter(
                  (link) => link.type === "payment"
                )}
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full py-6">
              {saving ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
