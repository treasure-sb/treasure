"use server";

import { Resend } from "resend";
import VendorAppAccepted, {
  VendorAppAcceptedEmailProps,
} from "@/emails/VendorAppAccepted";
import VendorAppRejected, {
  VendorAppRejectedEmailProps,
} from "@/emails/VendorAppRejected";
import QRCode from "qrcode";
import TicketPurchased from "@/emails/TicketPurchased";
import VendorAppReceived from "@/emails/VendorAppReceived";
import Welcome from "@/emails/Welcome";

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
  emailProps: VendorAppAcceptedEmailProps
) => {
  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: "You've been accepted!",
    react: VendorAppAccepted(emailProps),
  });
};

const sendVendorAppRejectedEmail = async (
  email: string,
  emailProps: VendorAppRejectedEmailProps
) => {
  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `Update on your ${emailProps.eventName} vendor application`,
    react: VendorAppRejected(emailProps),
  });
};

const sendTicketPurchasedEmail = async (
  email: string,
  eventName: string,
  posterUrl: string,
  ticketId: string,
  eventId: string
) => {
  const qrCodeUrl = await QRCode.toDataURL(
    `https://ontreasure.xyz/verify-tickets/?ticket_id=${ticketId}&event_id=${eventId}`
  );

  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `You've purchased a ticket to ${eventName}!`,
    attachments: [
      {
        filename: "qr-code.png",
        content: qrCodeUrl.split(",")[1],
      },
    ],
    react: TicketPurchased({ eventName, posterUrl }),
  });
};

export {
  sendWelcomeEmail,
  sendVendorAppReceivedEmail,
  sendVendorAppAcceptedEmail,
  sendVendorAppRejectedEmail,
  sendTicketPurchasedEmail,
};
