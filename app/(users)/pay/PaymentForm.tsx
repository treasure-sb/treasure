"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  amount: z.string(),
  itemName: z.string(),
});

export default function PaymentForm() {
  const [next, setNext] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "0",
      itemName: "",
    },
  });

  const onSubmit = () => {
    console.log(form.getValues());
  };
  const handleNumberClick = (number: string) => {
    const currentAmount = form.getValues().amount;
    if (currentAmount.length > 5) {
      return;
    }

    const newAmount =
      currentAmount === "0" ? number : `${currentAmount}${number}`;
    form.setValue("amount", newAmount);
  };

  const handleNumberDelete = () => {
    const currentAmount = form.getValues().amount;
    const newAmount =
      currentAmount.length === 1 ? "0" : currentAmount.slice(0, -1);
    form.setValue("amount", newAmount);
  };

  const buttonConfigs = [
    ...Array.from({ length: 9 }, (_, i) => ({
      label: (i + 1).toString(),
      onClick: () => handleNumberClick((i + 1).toString()),
    })),
    { label: ".", onClick: () => {} },
    { label: "0", onClick: () => handleNumberClick("0") },
    { label: "<", onClick: handleNumberDelete },
  ];

  const buttons = buttonConfigs.map((config, index) => (
    <Button
      className="text-2xl hover:bg-transparent md:hover:bg-secondary"
      variant={"ghost"}
      key={index}
      onClick={config.onClick}
    >
      {config.label}
    </Button>
  ));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4 max-w-xl m-auto"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field: { value, ...rest } }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="border-none text-center my-6 text-4xl font-semibold"
                  readOnly
                  value={`$${value}`}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {next ? (
          <div className="w-[80%] m-auto space-y-4">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Item Name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Pay with Paypal
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 h-60 w-full">{buttons}</div>
            <Button
              className="w-[80%]"
              type="button"
              onClick={() => setNext(true)}
            >
              Next
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
