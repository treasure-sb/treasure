"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signUp } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  confirmEmail: z.string().email({
    message: "Please enter a confirm email",
  }),
  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export default function Page({
  searchParams,
}: {
  searchParams: {
    signup_invite_token?: string;
    temporary_profile: string;
    invite_token: string;
    event: string;
  };
}) {
  const { replace } = useRouter();
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [emailsConfirmationError, setEmailConfirmationError] = useState(false);
  const signup_invite_token = searchParams.signup_invite_token;
  const invite_token = searchParams.invite_token || null;
  const event = searchParams.event || null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (formData.email !== formData.confirmEmail) {
      setEmailConfirmationError(true);
      return;
    }

    const { error, profileData } = await signUp(formData, signup_invite_token);
    if (error?.type === "email_taken") {
      setEmailExistsError(true);
    }

    if (profileData && invite_token && event) {
      replace(`/vendor-invite?invite_token=${invite_token}&event_id=${event}`);
    } else if (profileData && event) {
      replace(`/events/${event}`);
    } else if (profileData) {
      replace("/");
    }
  };

  return (
    <main className="px-4 mt-8 max-w-lg m-auto w-full">
      <h1 className="text-2xl text-center mb-4">Sign up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-2 w-full">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-grow">
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
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <div className="h-1">
                  <FormMessage>
                    {emailExistsError ? "Email already in use" : ""}
                  </FormMessage>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Confirm Email" {...field} />
                </FormControl>
                <div className="h-1">
                  <FormMessage>
                    {emailsConfirmationError ? "Emails don't match" : ""}
                  </FormMessage>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <div className="h-1">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Sign Up
          </Button>
          <h1 className="text-center text-sm">
            Already have an account?{" "}
            <Link
              className="text-primary"
              href={event ? `/login?event=${event}` : `/login`}
            >
              Log In
            </Link>
          </h1>
        </form>
      </Form>
    </main>
  );
}
