"use server";

import { Resend } from "resend";
import Welcome from "@/emails/Welcome";
import VendorAppReceived from "@/emails/VendorAppReceived";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const sendWelcomeEmail = async (email: string, firstName: string) => {
  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: "Welcome to Treasure",
    react: Welcome({ firstName }),
  });
};

const sendVendorAppReceivedEmail = async (email: string) => {
  await resend.emails.send({
    from: "Treasure <noreply@ontreasure.xyz>",
    to: email,
    subject: "You Recieved a Vendor Application!",
    react: VendorAppReceived(),
  });
};

export { sendWelcomeEmail, sendVendorAppReceivedEmail };
