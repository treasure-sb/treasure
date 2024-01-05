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
    event_id: string;
  };
}) {
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [emailsConfirmationError, setEmailConfirmationError] = useState(false);
  const { replace } = useRouter();
  const signup_invite_token = searchParams.signup_invite_token;
  const invite_token = searchParams.invite_token || null;
  const event_id = searchParams.event_id || null;

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

    try {
      const response = await signUp(formData, signup_invite_token);
      if (response?.error?.type === "email_taken") {
        setEmailExistsError(true);
      }

      if (response?.profileData && invite_token && event_id) {
        replace(
          `/vendor-invite?invite_token=${invite_token}&event_id=${event_id}`
        );
      } else if (response?.profileData) {
        replace("/");
      }
    } catch (err) {
      console.log(err);
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
            <Link className="text-primary" href="/login">
              Log In
            </Link>
          </h1>
        </form>
      </Form>
    </main>
  );
}
