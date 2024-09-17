"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StripeInput from "./StripeInput";
import { createPaymentIntent } from "@/lib/actions/stripe";
import { PriceInfo } from "../page";
import { createClient } from "@/utils/supabase/client";
import PhoneInput, {
  filterPhoneNumber,
  formatPhoneNumber,
} from "@/components/ui/custom/phone-input";

const nameSchema = z.object({
  first_name: z.string().min(1, {
    message: "First Name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last Name is required",
  }),
  phone: z.string().min(10, { message: "Invalid phone number" }),
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export type CheckoutPriceInfo = PriceInfo & {
  priceToCharge: number;
};

type CheckoutFormProps = {
  checkoutSession: Tables<"checkout_sessions">;
  checkoutPriceInfo: CheckoutPriceInfo;
};

export default function CheckoutForm({
  checkoutSession,
  checkoutPriceInfo,
}: CheckoutFormProps) {
  const { subtotal, promoCode, priceAfterPromo, fee, priceToCharge } =
    checkoutPriceInfo;
  const supabase = createClient();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isStripeComplete, setIsStripeComplete] = useState(false);

  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!elements) return;

    const element = elements.getElement("payment");
    if (!element) return;

    element.on("change", (event) => {
      setIsStripeComplete(event.complete);
    });

    return () => {
      element.off("change");
    };
  }, [elements]);

  const onSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    toast.loading("Processing payment...");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.dismiss();
      toast.error(submitError.message);
      setIsLoading(false);
      return;
    }

    const { first_name, last_name, phone, email } = form.getValues();

    const phoneWithCountryCode = `+1${phone}`;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .or(`phone.eq.${phoneWithCountryCode}, email.eq.${email}`)
      .limit(1)
      .single();

    if (profile) {
      await supabase
        .from("checkout_sessions")
        .update({ user_id: profile.id })
        .eq("id", checkoutSession.id);
    }

    const paymentIntent = await createPaymentIntent(
      priceToCharge,
      subtotal,
      priceAfterPromo,
      checkoutSession.id,
      promoCode?.code || "",
      fee,
      first_name,
      last_name,
      phoneWithCountryCode,
      email
    );
    const clientSecret = paymentIntent?.clientSecret || "";

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/embed-checkout/${checkoutSession.id}/success`,
      },
    });

    if (
      error &&
      (error.type === "card_error" || error.type === "validation_error")
    ) {
      toast.dismiss();
      toast.error(error.message);
    } else {
      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  const isFormValid = form.formState.isValid;

  const setPhone = (phoneNumber: string) => {
    form.setValue("phone", filterPhoneNumber(phoneNumber));
  };

  return (
    <Form {...form}>
      <form
        id="payment-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <StripeInput placeholder="John" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <StripeInput placeholder="Doe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <PhoneInput
                    className="shadow-[0px_2px_4px_rgba(0,0,0,0.5),0px_1px_6px_rgba(0,0,0,0.2)] border-[1px] rounded-[5px] p-3 bg-[#fafaf5] dark:bg-[#0c0a09] placeholder:text-[#808080] placeholder:text-sm border-[#f1f1e5] dark:border-[#28211e] focus-visible:border-primary/30"
                    phoneNumber={formatPhoneNumber(field.value)}
                    updatePhoneNumber={setPhone}
                    placeholder="(555) 555-5555"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <StripeInput placeholder="john@gmail.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <PaymentElement id="payment-element" />
        <div className="w-full flex items-center justify-center">
          <Button
            className={`rounded-sm ${isLoading && "bg-primary/60"}`}
            disabled={
              isLoading ||
              !stripe ||
              !elements ||
              !isFormValid ||
              !isStripeComplete
            }
            id="submit"
          >
            Purchase Ticket
            {checkoutSession.quantity > 1 ? "s" : ""}
          </Button>
        </div>
      </form>
    </Form>
  );
}
