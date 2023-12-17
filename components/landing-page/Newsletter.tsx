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
        className="w-full my-20 justify-between flex flex-col md:flex-row"
      >
        <h1 className="text-3xl font-semibold">Get the latest from Treasure</h1>
        <div className="flex space-x-4 w-full md:max-w-md items-end">
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
              className="border-primary w-24 m-auto rounded-3xl"
              variant={"outline"}
            >
              Subscribe
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
