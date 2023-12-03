"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { addSubscriber } from "@/lib/actions/mailchimp";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
});

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async () => {
    await addSubscriber(form.getValues().email);
    setSubscribed(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full my-20 space-y-6 max-w-4xl m-auto flex flex-col justify-center"
      >
        <h1 className="text-center text-3xl font-bold underline leading-relaxed md:text-5xl">
          THE TRI-STATE’S TOP COLLECTOR EVENTS SENT STRAIGHT TO YOUR INBOX
        </h1>
        <h1 className="text-center">
          One message a week on Sunday - so you never miss an event near you.
        </h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full md:w-[32rem] m-auto">
              <FormControl>
                <Input
                  className="max-w-lg m-auto"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {subscribed ? (
          <Button
            disabled
            type="submit"
            className="landing-page-button border-primary w-full max-w-xl m-auto"
            variant={"default"}
          >
            Subscribed
          </Button>
        ) : (
          <Button
            type="submit"
            className="landing-page-button border-primary w-full max-w-xl m-auto"
            variant={"outline"}
          >
            Subscribe
          </Button>
        )}
      </form>
    </Form>
  );
}
