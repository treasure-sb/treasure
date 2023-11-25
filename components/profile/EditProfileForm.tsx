"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import createSupabaseServerClient from "@/utils/supabase/server";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Link from "next/link";
import validateUser from "@/lib/actions/auth";
import Avatar from "@/components/profile/Avatar";
import Image from "next/image";
import format from "date-fns/format";
import { editProfile } from "@/lib/actions/profile";
import { createClient } from "@/utils/supabase/client";
import { profileForm } from "@/types/profile";

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

interface eventFormProps {
  profileform: profileForm;
  profile: any;
}

export default function editProfileForm({
  profileform,
  profile,
}: eventFormProps) {
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
      ...profile.id,
      ...form.getValues(),
    };
    await editProfile(newForm);
  };

  return (
    <main className="m-auto max-w-lg">
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
