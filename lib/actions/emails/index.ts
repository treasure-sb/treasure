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
import TablePurchased, { TablePurchasedProps } from "@/emails/TablePurchased";
import { Resend } from "resend";
import { generateTicketReceipt } from "@/lib/pdfs/tickets";
import { to, toMany } from "@/lib/utils";
import HostMessage, { HostMessageProps } from "@/emails/HostMessage";
import VendorAppReceived from "@/emails/VendorAppReceived";
import Welcome from "@/emails/Welcome";
import VendorAppWaitlisted, {
  VendorAppWaitlistedEmailProps,
} from "@/emails/VendorAppWaitlisted";
import TeamInvite, { TeamInviteProps } from "@/emails/TeamInvite";

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
  emails: string[],
  posterUrl: string,
  eventName: string,
  cleanedEventName: string
) => {
  const batchEmails = emails.map((email) => {
    return {
      from: "Treasure <noreply@ontreasure.xyz>",
      to: email,
      subject: "You Recieved a Vendor Application!",
      react: VendorAppReceived({ posterUrl, eventName, cleanedEventName }),
    };
  });
  const sendEmailPromise = resend.batch.send(batchEmails);
  return await to(sendEmailPromise);
};

const sendVendorAppAcceptedEmail = async (
  email: string,
  emailProps: VendorAppAcceptedEmailProps
) => {
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `[Action Required] You've Been Accepted!: ${emailProps.eventName}`,
    react: VendorAppAccepted(emailProps),
  });
  return await to(sendEmailPromise);
};

const sendReminderVendorAppAcceptedEmail = async (
  email: string,
  emailProps: VendorAppAcceptedEmailProps
) => {
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `[Action Required (Reminder)] You've Been Accepted!: ${emailProps.eventName}`,
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

const sendVendorAppWaitlistedEmail = async (
  email: string,
  emailProps: VendorAppWaitlistedEmailProps
) => {
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `Update on your ${emailProps.eventName} vendor application`,
    react: VendorAppWaitlisted(emailProps),
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
    subject: `Registration received: ${emailProps.eventName}`,
    react: VendorAppSubmitted(emailProps),
  });
  return await to(sendEmailPromise);
};

const sendTablePurchasedEmail = async (
  email: string,
  emailProps: TablePurchasedProps
) => {
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `Table confirmed: ${emailProps.eventName}`,
    react: TablePurchased(emailProps),
  });
  return await to(sendEmailPromise);
};

const sendTeamInviteEmail = async (
  email: string,
  emailProps: TeamInviteProps
) => {
  const sendEmailPromise = resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: `You've been invited to join ${emailProps.eventName}'s team!`,
    react: TeamInvite(emailProps),
  });
  return await to(sendEmailPromise);
};

const chunkEmails = (emails: string[], batchSize: number) => {
  const chunks = [];
  for (let i = 0; i < emails.length; i += batchSize) {
    const chunk = emails.slice(i, i + batchSize);
    chunks.push(chunk);
  }
  return chunks;
};

const sendHostMessageEmail = async (
  emails: string[],
  emailProps: HostMessageProps
) => {
  const emailChunks = chunkEmails(emails, 100);

  const sendEmailPromises = emailChunks.map(async (chunk) => {
    const batch = chunk.map((email) => {
      return {
        from: "Treasure <noreply@ontreasure.xyz>",
        to: email,
        subject: `${emailProps.hostName} sent you a message`,
        react: HostMessage(emailProps),
      };
    });
    return resend.batch.send(batch);
  });

  return await toMany(sendEmailPromises);
};

const sendTicketPurchasedEmail = async (
  email: string,
  ticketId: string | string[],
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

const sendEventCreatedEmail = async (eventName: string) => {
  try {
    await resend.emails.send({
      from: "Treasure <noreply@ontreasure.xyz>",
      to: "treasure20110@gmail.com",
      subject: `Event Created: ${eventName}`,
      html: `<p>Event Created: ${eventName}<p>`,
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
  sendVendorAppWaitlistedEmail,
  sendTicketPurchasedEmail,
  sendTeamInviteEmail,
  sendVendorAppSubmittedEmail,
  sendTablePurchasedEmail,
  sendReminderVendorAppAcceptedEmail,
  sendHostMessageEmail,
  sendEventCreatedEmail,
};
