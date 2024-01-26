"use server";

import { Resend } from "resend";
import Welcome from "@/emails/Welcome";
import VendorAppReceived from "@/emails/VendorAppReceived";
import VendorAppAccepted from "@/emails/VendorAppAccepted";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const sendWelcomeEmail = async (email: string, firstName: string) => {
  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: "Welcome to Treasure!",
    react: Welcome({ firstName }),
  });
};

const sendVendorAppReceivedEmail = async (
  email: string,
  posterUrl: string,
  eventName: string
) => {
  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: "You Recieved a Vendor Application!",
    react: VendorAppReceived({ posterUrl, eventName }),
  });
};

const sendVendorAppAcceptedEmail = async (
  email: string,
  eventName: string,
  posterUrl: string,
  stripePriceId: string,
  vendorId: string,
  eventId: string,
  tableId: string,
  quantity: string
) => {
  console.log(posterUrl);
  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: "You've been accepted!",
    react: VendorAppAccepted({
      eventName,
      posterUrl,
      stripePriceId,
      vendorId,
      eventId,
      tableId,
      quantity,
    }),
  });
};

export {
  sendWelcomeEmail,
  sendVendorAppReceivedEmail,
  sendVendorAppAcceptedEmail,
};
