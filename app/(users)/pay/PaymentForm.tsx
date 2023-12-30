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
import { submitPayment } from "@/lib/actions/vendors/submit-payments";
import { vendorTransactionForm } from "@/types/profile";
import Link from "next/link";

const formSchema = z.object({
  amount: z.string(),
  item_name: z.string(),
});

export default function PaymentForm({
  vendorID,
  paymentMethods,
  route,
}: {
  vendorID: any;
  paymentMethods: any[][];
  route: any;
}) {
  const [next, setNext] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "0",
      item_name: "",
    },
  });

  //this method never gets called but is necessary for the form not to redirect when we click a number
  const onSubmit = () => {};

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
  const getRoute = (method: string[]) => {
    let rte = "";
    switch (method[0]) {
      case "venmo":
        rte =
          "https://venmo.com/" +
          method[1].replaceAll(" ", "%20") +
          "?txn=pay&note=" +
          form.getValues().item_name.replaceAll(" ", "%20") +
          "&amount=" +
          form.getValues().amount;
        break;
      case "zelle":
        break;
      case "cashapp":
        rte = "https://cash.app/$" + method[1] + "/" + form.getValues().amount;
        break;
      case "paypal":
        break;
    }
    return rte;
  };

  const submit = async (type: string) => {
    let newForm: vendorTransactionForm = {
      ...form.getValues(),
      method: type,
      vendor_id: vendorID,
    };
    await submitPayment(newForm, route);
  };

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
              name="item_name"
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
            <Button
              className="w-[80%]"
              type="button"
              onClick={() => setNext(false)}
            >
              Back
            </Button>
            <div className="flex flex-col space-y-4">
              {paymentMethods.map((method: string[]) => (
                <Link
                  className="w-full"
                  target="_blank"
                  href={getRoute(method)}
                  onClick={() => submit(method[0])}
                >
                  <Button className="w-full" type="button">
                    Pay with {method[0]}
                  </Button>
                </Link>
              ))}
              <Link
                className="w-full"
                href={"/" + route}
                onClick={() => submit("in person")}
              >
                <Button className="w-full" type="button">
                  Pay in Person
                </Button>
              </Link>
            </div>
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
