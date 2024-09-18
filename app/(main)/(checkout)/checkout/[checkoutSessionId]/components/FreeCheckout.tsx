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
import { PurchaseTableResult } from "@/types/tables";
import * as z from "zod";
import StripeInput from "./StripeInput";
import {
  sendTablePurchasedEmail,
  sendTicketPurchasedEmail,
} from "@/lib/actions/emails";
import {
  sendAttendeeTicketPurchasedSMS,
  sendVendorTablePurchasedSMS,
} from "@/lib/sms";
import { formatEmailDate } from "@/lib/utils";
import { TablePurchasedProps } from "@/emails/TablePurchased";
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";
import { validateUser } from "@/lib/actions/auth";
import { TicketPurchasedProps } from "@/emails/TicketPurchased";

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
  profile,
}: {
  checkoutSession: Tables<"checkout_sessions">;
  profile: Tables<"profiles"> | null;
}) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

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

  const onSubmit = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      const { quantity, ticket_type } = checkoutSession;
      await updateProfile();

      toast.loading(
        `Getting ${ticket_type === "TABLE" ? "table" : "ticket"}${
          quantity > 1 ? "s" : ""
        }...`
      );

      if (ticket_type === "TABLE") {
        await handleFreeTablePurchase();
      } else {
        await handleFreeTicketPurchase();
      }

      toast.dismiss();
      toast.success(
        `${checkoutSession.ticket_type === "TABLE" ? `Table` : "Ticket"}${
          quantity > 1 ? "s" : ""
        } added successfully!`
      );
      push(`/checkout/${checkoutSession.id}/success`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile) return;

    const { first_name, last_name } = form.getValues();
    await supabase
      .from("profiles")
      .update({ first_name, last_name })
      .eq("id", profile.id);
  };

  const handleFreeTicketPurchase = async () => {
    if (!profile) return;

    const { email, first_name, last_name } = form.getValues();
    const { ticket_id, quantity, user_id, event_id, promo_id } =
      checkoutSession;

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

    const ticketPurchaseEmailProps: TicketPurchasedProps = {
      eventName: event_name,
      posterUrl: publicUrl,
      ticketType: ticket_name,
      quantity: quantity,
      location: event_address,
      date: formattedEventDate,
      guestName: `${first_name} ${last_name}`,
      totalPrice: `Free`,
      eventInfo: event_description,
      isGuestCheckout: false,
    };

    if (profile.email) {
      await sendTicketPurchasedEmail(
        profile.email,
        purchasedTicketId,
        event_id,
        ticketPurchaseEmailProps
      );
    }

    if (profile.phone) {
      await sendAttendeeTicketPurchasedSMS(
        profile.phone,
        event_name,
        formattedEventDate,
        false
      );
    }
  };

  const handleFreeTablePurchase = async () => {
    const { ticket_id, quantity, user_id, event_id, promo_id } =
      checkoutSession;
    const { data, error } = await supabase
      .rpc("purchase_table", {
        table_id: ticket_id,
        event_id,
        user_id,
        purchase_quantity: quantity,
        amount_paid: 0,
        promo_id,
      })
      .returns<PurchaseTableResult[]>();

    if (error) {
      throw new Error("Failed to complete order");
    }

    const {
      event_name,
      event_address,
      event_max_date,
      event_min_date,
      event_description,
      event_poster_url,
      table_section_name,
      vendor_table_quantity,
      vendor_first_name,
      vendor_last_name,
      vendor_inventory,
      vendor_vendors_at_table,
      vendor_business_name,
      vendor_application_email,
      vendor_application_phone,
    } = data[0];

    const event_dates = [event_min_date, event_max_date];

    if (event_min_date === event_max_date) {
      event_dates.pop();
    }

    const formattedEventDate = formatEmailDate(event_dates);

    const {
      data: { publicUrl },
    } = await supabase.storage.from("posters").getPublicUrl(event_poster_url, {
      transform: {
        width: 400,
        height: 400,
      },
    });

    const tablePurchasedEmailPayload: TablePurchasedProps = {
      eventName: event_name,
      posterUrl: publicUrl,
      tableType: table_section_name,
      quantity: vendor_table_quantity,
      location: event_address,
      date: formattedEventDate,
      guestName: `${vendor_first_name} ${vendor_last_name}`,
      businessName: vendor_business_name,
      itemInventory: vendor_inventory,
      totalPrice: `Free`,
      numberOfVendors: vendor_vendors_at_table,
      eventInfo: event_description,
    };

    await sendTablePurchasedEmail(
      vendor_application_email,
      tablePurchasedEmailPayload
    );

    await sendVendorTablePurchasedSMS(
      vendor_application_phone,
      event_name,
      formattedEventDate
    );
  };

  const isValid = form.formState.isValid;

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

  const RSVPButton = (
    <Button
      className={`rounded-sm ${isLoading && "bg-primary/60"}`}
      disabled={isLoading || !isValid}
      id="submit"
    >
      Get {checkoutSession.ticket_type === "TABLE" ? `Table` : "Ticket"}
      {checkoutSession.quantity > 1 && "s"}
    </Button>
  );

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
          {profile ? (
            RSVPButton
          ) : (
            <LoginFlowDialog
              trigger={RSVPButton}
              onLoginSuccess={onLoginSuccess}
            />
          )}
        </div>
      </form>
    </Form>
  );
}
