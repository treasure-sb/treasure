"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { PurchaseTicketResult } from "@/types/tickets";
import * as z from "zod";
import StripeInput from "./StripeInput";
import { sendTicketPurchasedEmail } from "@/lib/actions/emails";
import { sendAttendeeTicketPurchasedSMS } from "@/lib/sms";
import { formatEmailDate } from "@/lib/utils";

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

export default function FreeCheckout({
  checkoutSession,
}: {
  checkoutSession: Tables<"checkout_sessions">;
}) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const { quantity } = checkoutSession;

      toast.loading(`Getting ticket${quantity > 1 ? "s" : ""}...`);

      await handleFreeTicketPurchase();

      toast.dismiss();
      toast.success(`Ticket${quantity > 1 ? "s" : ""} added successfully!`);
      push(`/embed-checkout/${checkoutSession.id}/success`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeTicketPurchase = async () => {
    const { first_name, last_name, email } = form.getValues();
    const { ticket_id, quantity, event_id, promo_id } = checkoutSession;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .limit(1)
      .single();

    // prod dummy account id: "735d404d-ba70-4084-9967-5f778a8e1403"
    const user_id = profile?.id || "18a31b64-1b75-4c8b-b663-0dc6e4a01988";

    if (profile) {
      await supabase
        .from("checkout_sessions")
        .update({ user_id: user_id })
        .eq("id", checkoutSession.id);
    }

    const { data, error } = await supabase
      .rpc("purchase_tickets_new", {
        ticket_id,
        event_id,
        user_id,
        purchase_quantity: quantity,
        amount_paid: 0,
        promo_id,
        fees_paid: 0,
        first_name,
        last_name,
        phone: null,
        email,
      })
      .returns<PurchaseTicketResult[]>();

    if (error) {
      throw new Error("Failed to complete order");
    }

    const {
      event_address,
      event_dates,
      event_description,
      event_name,
      event_poster_url,
      event_ticket_ids,
      ticket_name,
    } = data[0];

    const formattedEventDate = formatEmailDate(event_dates);
    const purchasedTicketId =
      event_ticket_ids.length > 1 ? event_ticket_ids : event_ticket_ids[0];

    const {
      data: { publicUrl },
    } = await supabase.storage.from("posters").getPublicUrl(event_poster_url, {
      transform: {
        width: 400,
        height: 400,
      },
    });

    const ticketPurchaseEmailProps = {
      eventName: event_name,
      posterUrl: publicUrl,
      ticketType: ticket_name,
      quantity: quantity,
      location: event_address,
      date: formattedEventDate,
      guestName: `${first_name} ${last_name}`,
      totalPrice: `Free`,
      eventInfo: event_description,
    };

    if (email) {
      await sendTicketPurchasedEmail(
        email,
        purchasedTicketId,
        event_id,
        ticketPurchaseEmailProps
      );
    }
  };

  const isValid = form.formState.isValid;

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
        <div className="w-full flex items-center justify-center">
          <Button
            className={`rounded-sm ${isLoading && "bg-primary/60"}`}
            disabled={isLoading || !isValid}
            id="submit"
          >
            Get Ticket
            {checkoutSession.quantity > 1 && "s"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
