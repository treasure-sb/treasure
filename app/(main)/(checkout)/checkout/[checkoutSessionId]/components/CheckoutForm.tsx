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
import { useRouter } from "next/navigation";
import PhoneInput, {
  filterPhoneNumber,
  formatPhoneNumber,
} from "@/components/ui/custom/phone-input";
import { getProfile } from "@/lib/helpers/profiles";

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
  const { refresh } = useRouter();
  let latestProfile = profile;

  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      first_name: !latestProfile
        ? ""
        : latestProfile.first_name === "Anonymous"
        ? ""
        : latestProfile.first_name,
      last_name: !latestProfile
        ? ""
        : latestProfile.first_name === "Anonymous"
        ? ""
        : latestProfile.last_name,
      phone: !latestProfile ? "" : latestProfile.phone?.replace("+1", "") || "",
      email: (latestProfile && latestProfile.email) || "",
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
    const { first_name, last_name, email, phone } = form.getValues();
    const phoneWithCountryCode = `+1${phone}`;
    if (!latestProfile) {
      const { data: foundProfile } = await supabase
        .from("profiles")
        .select("*")
        .or(`phone.eq.${phoneWithCountryCode}, email.eq.${email}`)
        .limit(1)
        .single();

      latestProfile = foundProfile;

      if (foundProfile) {
        await supabase
          .from("checkout_sessions")
          .update({ user_id: foundProfile.id })
          .eq("id", checkoutSession.id);
      } else {
        await supabase
          .from("checkout_sessions")
          .update({ user_id: "735d404d-ba70-4084-9967-5f778a8e1403" })
          .eq("id", checkoutSession.id);
      }
    }
    if (latestProfile) {
      await supabase
        .from("profiles")
        .update({ first_name, last_name })
        .eq("id", latestProfile.id);
    }

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
      phoneWithCountryCode || "",
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

  const onLoginSuccess = async () => {
    const {
      data: { user },
    } = await validateUser();

    if (!user) return;

    const { profile: updatedProfile } = await getProfile(user.id);

    await supabase
      .from("checkout_sessions")
      .update({ user_id: user.id })
      .eq("id", checkoutSession.id);

    latestProfile = updatedProfile;

    // Set all form values here
    if (!latestProfile) return;
    form.setValue("first_name", latestProfile.first_name || "", {
      shouldValidate: true,
    });
    form.setValue("last_name", latestProfile.last_name, {
      shouldValidate: true,
    });
    form.setValue("phone", latestProfile.phone?.replace("+1", "") || "", {
      shouldValidate: true,
    });
    form.setValue("email", latestProfile.email || "", { shouldValidate: true });
    refresh();
  };

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
        {!profile && (
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <h2 className="w-full text-center text-lg border-t pt-4">
                Already have an account?
              </h2>
              <p className="text-muted-foreground text-sm text-center">
                or try our one-click sign up
              </p>
            </div>
            <LoginFlowDialog
              trigger={<Button>Login / Sign Up</Button>}
              onLoginSuccess={onLoginSuccess}
            />
            <h2 className="w-full text-center text-lg border-t pt-4 mt-4">
              Guest Checkout
            </h2>
          </div>
        )}
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
            Purchase{" "}
            {checkoutSession.ticket_type === "TABLE" ? "Table" : "Ticket"}
            {checkoutSession.quantity > 1 ? "s" : ""}
          </Button>
        </div>
      </form>
    </Form>
  );
}
