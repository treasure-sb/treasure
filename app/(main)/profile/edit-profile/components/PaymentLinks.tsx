"use client";

import { paymentLinkData } from "@/lib/helpers/links";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { EditProfileFormReturn } from "@/types/profile";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/types/supabase";

export default function PaymentLinks({
  form,
  userPaymentLinks,
}: {
  form: EditProfileFormReturn;
  userPaymentLinks: Partial<Tables<"links">>[] | undefined;
}) {
  const [availablePaymentLinks, setAvailablePaymentLinks] = useState(
    Object.keys(paymentLinkData)
  );

  useEffect(() => {
    const userApplications = userPaymentLinks?.map((link) => link.application);
    const updatedLinks = Object.keys(paymentLinkData).filter(
      (link) => !userApplications?.includes(link)
    );
    setAvailablePaymentLinks(updatedLinks);
  }, userPaymentLinks);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "payment_links",
  });

  const addPaymentLink = (application: string) => {
    setTimeout(() => {
      append({
        username: "",
        application: application,
        type: "payment",
      });

      const updatedLinks = availablePaymentLinks.filter(
        (link) => link !== application
      );
      setAvailablePaymentLinks(updatedLinks);
    }, 0);
  };

  const removePaymentLink = (index: number) => {
    const removedLink = fields[index];
    remove(index);
    const updatedLinks = [...availablePaymentLinks, removedLink.application];
    setAvailablePaymentLinks(updatedLinks);
  };

  return (
    <>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="flex space-x-2 items-center">
            <div className="mr-2">
              {paymentLinkData[field.application].icon}
            </div>
            <FormField
              control={form.control}
              name={`payment_links.${index}.username`}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pl-6"
                          placeholder="Username"
                          {...field}
                        />
                        <p className="absolute top-2 text-lg">@</p>
                      </div>
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => removePaymentLink(index)}
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          </div>
        );
      })}
      {availablePaymentLinks.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-44 border-[1px] rounded-full py-2">
            Add Payment Link
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            {availablePaymentLinks.map((link) => (
              <DropdownMenuItem onClick={() => addPaymentLink(link)} key={link}>
                {link}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
