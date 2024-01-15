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
import { login } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export default function Page({
  searchParams,
}: {
  searchParams: {
    event: string;
  };
}) {
  const event = searchParams.event || null;
  const { replace } = useRouter();
  const [loginError, setLoginError] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const { data, error } = await login(formData);
    if (error) {
      setLoginError(true);
    }

    if (data && event) {
      replace(`/events/${event}`);
    } else if (!error) {
      replace("/");
    }
  };

  return (
    <main className="px-4 mt-8 max-w-lg m-auto w-full">
      <h1 className="text-2xl text-center mb-4">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <div className="h-1">
                  <FormMessage />
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
                  <FormMessage>
                    {loginError ? "Invalid Login Credentials" : ""}
                  </FormMessage>
                </div>
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Login
          </Button>
          <h1 className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              className="text-primary"
              href={event ? `/signup?event=${event}` : "/signup"}
            >
              Sign up
            </Link>
          </h1>
        </form>
      </Form>
    </main>
  );
}
