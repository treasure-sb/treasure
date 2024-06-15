import { sendSMS } from "./actions/twilio";
import moment from "moment";

type HostSoldPayload = {
  phone: string;
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  eventName: string;
  eventDate: string;
  eventCleanedName: string;
};

const sendAttendeeTicketPurchasedSMS = async (
  phone: string,
  eventName: string,
  eventDate: string
) => {
  return await sendSMS(
    phone,
    `🙌 You’re going to ${eventName} on ${moment(eventDate).format(
      "dddd, MMM Do"
    )}!\n\nView details and your tickets\n\n🎟️ontreasure.com/profile/tickets`
  );
};

const sendVendorTablePurchasedSMS = async (
  phone: string,
  eventName: string,
  eventDate: string
) => {
  return await sendSMS(
    phone,
    `🙌 Success! Your vendor payment has been received! You are now confirmed to be a vendor at ${eventName} on ${moment(
      eventDate
    ).format(
      "dddd, MMM Do"
    )}. We look forward to seeing you there!\n\nView details and your tickets\n\n🎟️ontreasure.com/profile/tickets`
  );
};

const sendVendorAppAcceptedSMS = async (
  phone: string,
  checkoutSessionId: string,
  message: string,
  eventName: string
) => {
  const checkoutUrl = `https://www.ontreasure.com/checkout/${checkoutSessionId}`;
  const smsMessage = message
    ? `💵 [Action Required] Congrats! Your application for ${eventName} has been accepted!\n\nMessage from the host: ${message}\n\nPurchase your table here: ${checkoutUrl}`
    : `💵 [Action Required] Congrats! Your application for ${eventName} has been accepted!\n\nPurchase your table here: ${checkoutUrl}`;
  return await sendSMS(phone, smsMessage);
};

const sendReminderVendorAppAcceptedSMS = async (
  phone: string,
  checkoutSessionId: string,
  message: string,
  eventName: string
) => {
  const checkoutUrl = `https://www.ontreasure.com/checkout/${checkoutSessionId}`;
  const smsMessage = message
    ? `💵 [Action Required (Reminder)] Congrats! Your application for ${eventName} has been accepted!\n\nMessage from the host: ${message}\n\nPurchase your table here: ${checkoutUrl}`
    : `💵 [Action Required (Reminder)] Congrats! Your application for ${eventName} has been accepted!\n\nPurchase your table here: ${checkoutUrl}`;
  return await sendSMS(phone, smsMessage);
};

const sendVendorAppWaitlistedSMS = async (
  phone: string,
  message: string,
  eventName: string
) => {
  const smsMessage = message
    ? `🚨 Thanks for your interest in being a vendor at ${eventName}! Currently at this time you've been placed on the waitlist.\n\nMessage from the host: ${message}`
    : `🚨 Thanks for your interest in being a vendor at ${eventName}! Currently at this time you've been placed on the waitlist.`;

  return await sendSMS(phone, smsMessage);
};

const sendVendorAppSubmittedSMS = async (
  phone: string,
  firstName: string,
  eventName: string
) => {
  return await sendSMS(
    phone,
    `🚨 ${firstName}, thank you for applying to ${eventName}! We will message you once you are approved by the host!`
  );
};

const sendHostTicketSoldSMS = async (ticketSMSPayload: HostSoldPayload) => {
  const {
    phone,
    businessName,
    firstName,
    lastName,
    eventName,
    eventDate,
    eventCleanedName,
  } = ticketSMSPayload;
  return await sendSMS(
    phone,
    `🎉 ${
      !businessName ? `${firstName} ${lastName}` : businessName
    } just bought a ticket to ${eventName} on ${moment(eventDate).format(
      "dddd, MMM Do"
    )}!\n\nView details\n\nontreasure.com/host/events/${eventCleanedName}`
  );
};

const sendHostTableSoldSMS = async (tableSMSPayload: HostSoldPayload) => {
  const {
    phone,
    businessName,
    firstName,
    lastName,
    eventName,
    eventDate,
    eventCleanedName,
  } = tableSMSPayload;
  await sendSMS(
    phone,
    `💰Congrats! You received payment from ${
      !businessName ? `${firstName} ${lastName}` : businessName
    } Their table(s) are confirmed for ${eventName} on ${moment(
      eventDate
    ).format(
      "dddd, MMM Do"
    )}!\n\nView details\n\nontreasure.com/host/events/${eventCleanedName}`
  );
};

const sendHostVendorAppReceievedSMS = async (
  vendorAppSMSPayload: HostSoldPayload
) => {
  const {
    phone,
    eventName,
    eventDate,
    eventCleanedName,
    businessName,
    firstName,
    lastName,
  } = vendorAppSMSPayload;
  return await sendSMS(
    phone,
    `🚨 You just received a new vendor application for ${eventName} on ${moment(
      eventDate
    ).format("dddd, MMM Do")} from ${
      !businessName ? `${firstName} ${lastName}` : businessName
    }! Please review their application: ontreasure.com/host/events/${eventCleanedName}/vendors`
  );
};

export {
  sendAttendeeTicketPurchasedSMS,
  sendVendorTablePurchasedSMS,
  sendVendorAppAcceptedSMS,
  sendVendorAppWaitlistedSMS,
  sendVendorAppSubmittedSMS,
  sendHostTableSoldSMS,
  sendReminderVendorAppAcceptedSMS,
  sendHostTicketSoldSMS,
  sendHostVendorAppReceievedSMS,
  type HostSoldPayload,
};
