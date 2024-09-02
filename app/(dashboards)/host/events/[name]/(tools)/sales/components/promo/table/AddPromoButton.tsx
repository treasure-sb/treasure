"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPromoCode } from "@/lib/actions/promo";
import { useState } from "react";
import { PromoFormSchema } from "../../../types";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";

export default function AddPromoButton({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof PromoFormSchema>>({
    resolver: zodResolver(PromoFormSchema),
    defaultValues: {
      code: "",
      discount: "",
      usageLimit: undefined,
      status: "ACTIVE",
      promoType: "PERCENT",
    },
  });

  const { refresh } = useRouter();

  const onSubmit = async (values: z.infer<typeof PromoFormSchema>) => {
    toast.loading("Adding promo code...");

    const { error } = await createPromoCode(eventId, values);

    if (error) {
      toast.dismiss();
      toast.error("Failed to add promo code");
      return;
    }

    toast.dismiss();
    toast.success("Promo code added!");
    refresh();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"dotted"}>
          <PlusIcon size={14} />
          <p>Add Promo Code</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Add Promo Code</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Code"
                      placeholder="Enter promo code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end space-x-4">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        label="Discount"
                        placeholder="Enter discount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="h-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="promoType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="PERCENT"
                            checked={field.value === "PERCENT"}
                            onCheckedChange={(checked) =>
                              field.onChange("PERCENT")
                            }
                          />
                          <label
                            htmlFor="PERCENT"
                            className="text-sm font-medium leading-none"
                          >
                            %
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="DOLLAR"
                            checked={field.value === "DOLLAR"}
                            onCheckedChange={(checked) =>
                              field.onChange("DOLLAR")
                            }
                          />
                          <label
                            htmlFor="DOLLAR"
                            className="text-sm font-medium leading-none"
                          >
                            $
                          </label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="h-2" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Usage Limit"
                      placeholder="Enter usage limit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="h-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ACTIVE"
                          checked={field.value === "ACTIVE"}
                          onCheckedChange={(checked) =>
                            field.onChange("ACTIVE")
                          }
                        />
                        <label
                          htmlFor="ACTIVE"
                          className="text-sm leading-none bg-primary/10 text-green-600 rounded-[3px] font-semibold p-1 w-fit"
                        >
                          Active
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="DOLLAR"
                          checked={field.value === "INACTIVE"}
                          onCheckedChange={(checked) =>
                            field.onChange("INACTIVE")
                          }
                        />
                        <label
                          htmlFor="INACTIVE"
                          className="text-sm leading-none bg-destructive/10 text-red-600 rounded-[3px] font-semibold p-1 w-fit"
                        >
                          Inactive
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="h-2" />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button className="rounded-sm w-24">Add</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
