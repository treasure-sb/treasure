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
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { createLinks, updateLinks, deleteLinks } from "@/lib/actions/links";
import { createClient } from "@/utils/supabase/client";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";
import { UpdateProfile } from "@/lib/actions/profile";
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
  username: z.string().min(1, {
    message: "Username is required",
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
  const { refresh } = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      username: profile.username || "",
      business_name: profile.business_name || "",
      bio: profile.bio || "",
      social_links: userLinks?.filter((link) => link.type === "social") || [],
      payment_links: userLinks?.filter((link) => link.type === "payment") || [],
    },
  });

  const onSubmit = async () => {
    setSaving(true);
    toast.loading("Updating...");

    const { social_links, payment_links, username, ...rest } = form.getValues();
    const profileUpdateForm: UpdateProfile = {
      ...profile,
      ...rest,
      username: username.toLowerCase(),
    };

    if (newAvatarFile) {
      const newAvatarSupabaseUrl = `avatar${Date.now()}`;

      const { error: uploadAvatarError } = await supabase.storage
        .from("avatars")
        .upload(newAvatarSupabaseUrl, newAvatarFile);

      if (uploadAvatarError) {
        toast.dismiss();
        toast.error("Failed to upload avatar");
      } else {
        profileUpdateForm.avatar_url = newAvatarSupabaseUrl;

        if (profile.avatar_url !== "default_avatar") {
          await supabase.storage.from("avatars").remove([profile.avatar_url]);
        }
      }
    }

    await handleUpdateLinks();

    const { error } = await updateProfile(profileUpdateForm, profile.id);
    if (error) {
      toast.dismiss();
      handleErrorMessage(error);
      setSaving(false);
      return;
    }

    toast.dismiss();
    toast.success("Profile updated");
    setSaving(false);
    refresh();
  };

  const getUserLinks = () => {
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
    return { addedLinks, updatedLinks, removedLinks };
  };

  const handleUpdateLinks = async () => {
    const { addedLinks, updatedLinks, removedLinks } = getUserLinks();
    const updateLinksPromise = [
      await createLinks(addedLinks, profile.id),
      await updateLinks(updatedLinks, profile.id),
      removedLinks && (await deleteLinks(removedLinks, profile.id)),
    ];
    await Promise.allSettled(updateLinksPromise);
  };

  const handleErrorMessage = (error: PostgrestError) => {
    if (error.message.includes("username")) {
      toast.error("Username already exists");
    } else {
      toast.error("Failed to update profile information");
    }
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl mb-4">My Profile</h2>
      <div className="space-y-4 flex flex-col md:flex-row-reverse">
        <div className="w-fit mx-auto">
          {profile.avatar_url && (
            <AvatarEdit
              avatarUrl={avatarUrl}
              setAvatarFile={setNewAvatarFile}
            />
          )}
        </div>
        <div className="flex flex-col space-y-6 flex-grow md:max-w-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-between h-full"
            >
              <div className="space-y-6 flex flex-col mb-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput label="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput label="Last Name" {...field} />
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
                        <FloatingLabelInput label="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput label="Business Name" {...field} />
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
                        <Textarea
                          id="bio"
                          rows={4}
                          placeholder="Share a little about yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
              <Button
                type="submit"
                disabled={saving}
                className="py-6 rounded-md w-60"
              >
                Update Profile
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
