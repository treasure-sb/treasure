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
import { editPaymentMethods } from "@/lib/actions/vendors/vendor-payments";

const paymentsSchema = z.object({
  venmo: z.string().optional(),
  zelle: z.string().optional(),
  cashapp: z.string().optional(),
  paypal: z.string().optional(),
});

interface EventFormProps {
  payments: any;
}

export default function EditPaymentsForm({ payments }: EventFormProps) {
  //   Form Stuff
  const form = useForm<z.infer<typeof paymentsSchema>>({
    resolver: zodResolver(paymentsSchema),
    defaultValues: {
      venmo: payments.venmo === null ? "" : payments.venmo,
      zelle: payments.zelle === null ? "" : payments.zelle,
      cashapp: payments.cashapp === null ? "" : payments.cashapp,
      paypal: payments.paypal === null ? "" : payments.paypal,
    },
  });

  //Form submit
  const onSubmit = async () => {
    const newForm = {
      ...payments,
      ...form.getValues(),
    };
    await editPaymentMethods(newForm);
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
                name="venmo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="venmo" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zelle"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="zelle" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cashapp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="cashapp" {...field} />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paypal"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="paypal" {...field} />
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
