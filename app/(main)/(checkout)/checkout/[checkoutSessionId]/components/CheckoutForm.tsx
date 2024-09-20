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
  PaymentRequestButtonElement,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import StripeInput from "./StripeInput";
import { createPaymentIntent } from "@/lib/actions/stripe";
import { PriceInfo } from "../page";
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";
import { validateUser } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const nameSchema = z.object({
  first_name: z.string().min(1, {
    message: "First Name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last Name is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export type CheckoutPriceInfo = PriceInfo & {
  priceToCharge: number;
};

type CheckoutFormProps = {
  checkoutSession: Tables<"checkout_sessions">;
  profile: Tables<"profiles"> | null;
  checkoutPriceInfo: CheckoutPriceInfo;
};

export default function CheckoutForm({
  checkoutSession,
  profile,
  checkoutPriceInfo,
}: CheckoutFormProps) {
  const { subtotal, promoCode, priceAfterPromo, fee, priceToCharge } =
    checkoutPriceInfo;
  const supabase = createClient();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isStripeComplete, setIsStripeComplete] = useState(false);
  const [isExpressReady, setIsExpressReady] = useState(false);

  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      first_name: !profile
        ? ""
        : profile.first_name === "Anonymous"
        ? ""
        : profile.first_name,
      last_name: !profile
        ? ""
        : profile.first_name === "Anonymous"
        ? ""
        : profile.last_name,
      email: (profile && profile.email) || "",
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
    if (!profile) return;

    const { first_name, last_name, email } = form.getValues();
    await supabase
      .from("profiles")
      .update({ first_name, last_name })
      .eq("id", profile.id);

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

    const paymentIntent = await createPaymentIntent(
      priceToCharge,
      subtotal,
      priceAfterPromo,
      checkoutSession.id,
      promoCode?.code || "",
      fee,
      first_name,
      last_name,
      profile.phone || "",
      email
    );
    const clientSecret = paymentIntent?.clientSecret || "";

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/${checkoutSession.id}/success`,
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

  const PurchaseButton = (
    <Button
      className={`rounded-sm ${isLoading && "bg-primary/60"}`}
      disabled={
        isLoading || !stripe || !elements || !isFormValid || !isStripeComplete
      }
      id="submit"
    >
      Purchase {checkoutSession.ticket_type === "TABLE" ? "Table" : "Ticket"}
      {checkoutSession.quantity > 1 ? "s" : ""}
    </Button>
  );

  const onLoginSuccess = async () => {
    const {
      data: { user },
    } = await validateUser();

    if (!user) return;

    await supabase
      .from("checkout_sessions")
      .update({ user_id: user.id })
      .eq("id", checkoutSession.id);
  };

  return (
    <Form {...form}>
      <form
        id="payment-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className={cn("space-y-2", isExpressReady && "mb-6")}>
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
        <div
          className={cn(
            "pointer-events-none opacity-70 transition duration-500",
            form.formState.isValid ? "opacity-100 pointer-events-auto" : ""
          )}
        >
          <ExpressCheckoutElement
            options={{
              paymentMethods: {
                applePay: "always",
                link: "auto",
                googlePay: "always",
              },
            }}
            onConfirm={async () => {
              await onSubmit();
            }}
            onReady={({ availablePaymentMethods }) => {
              setIsExpressReady(availablePaymentMethods !== undefined);
            }}
          />
        </div>
        {isExpressReady && (
          <div className="flex space-x-4 items-center">
            <Separator className="w-full shrink" />
            <p className="text-sm text-foreground/60 whitespace-nowrap">
              Or pay another way
            </p>
            <Separator className="w-full shrink" />
          </div>
        )}
        <PaymentElement id="payment-element" />
        <div className="w-full flex items-center justify-center">
          {profile ? (
            PurchaseButton
          ) : (
            <LoginFlowDialog
              trigger={PurchaseButton}
              onLoginSuccess={onLoginSuccess}
            />
          )}
        </div>
      </form>
    </Form>
  );
}
