"use server";

import VendorAppAccepted, {
  VendorAppAcceptedEmailProps,
} from "@/emails/VendorAppAccepted";
import VendorAppRejected, {
  VendorAppRejectedEmailProps,
} from "@/emails/VendorAppRejected";
import TicketPurchased, {
  TicketPurchasedProps,
} from "@/emails/TicketPurchased";
import VendorAppSubmitted, {
  VendorAppSubmittedEmailProps,
} from "@/emails/VendorAppSubmitted";
import VendorAppReceived from "@/emails/VendorAppReceived";
import { Resend } from "resend";
import { generateTicketReceipt } from "@/pdfs/tickets";
import { to } from "@/lib/utils";
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
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `${emailProps.eventName} - You've Been Accepted`,
    react: VendorAppAccepted(emailProps),
  });
  return await to(sendEmailPromise);
};

const sendVendorAppRejectedEmail = async (
  email: string,
  emailProps: VendorAppRejectedEmailProps
) => {
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `Update on your ${emailProps.eventName} vendor application`,
    react: VendorAppRejected(emailProps),
  });
  return await to(sendEmailPromise);
};

const sendVendorAppSubmittedEmail = async (
  email: string,
  emailProps: VendorAppSubmittedEmailProps
) => {
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: "Your Vendor Application has been submitted",
    react: VendorAppSubmitted(emailProps),
  });
  return await to(sendEmailPromise);
};

const sendTicketPurchasedEmail = async (
  email: string,
  ticketId: string,
  eventId: string,
  emailProps: TicketPurchasedProps
) => {
  try {
    const ticketReceipt = await generateTicketReceipt(
      ticketId,
      eventId,
      emailProps
    );
    const ticketReceiptBuffer = Buffer.from(ticketReceipt);
    await resend.emails.send({
      from: "Treasure <noreply@ontreasure.xyz>",
      to: email,
      subject: `You're going to ${emailProps.eventName}!`,
      attachments: [
        {
          filename: `${emailProps.eventName}_ticket_receipt.pdf`,
          content: ticketReceiptBuffer,
        },
      ],
      react: TicketPurchased(emailProps),
    });
  } catch (error) {
    console.error(error);
  }
};

export {
  sendWelcomeEmail,
  sendVendorAppReceivedEmail,
  sendVendorAppAcceptedEmail,
  sendVendorAppRejectedEmail,
  sendTicketPurchasedEmail,
  sendVendorAppSubmittedEmail,
};
