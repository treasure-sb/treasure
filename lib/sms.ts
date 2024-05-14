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
    )}!\n\nView details and your tickets\n\n🎟️ ontreasure.xyz/tickets`
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
    )}. We look forward to seeing you there!\n\nView details and your tickets\n\n🎟️ ontreasure.xyz/tickets`
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
    )}!\n\nView details\n\nontreasure.xyz/host/events/${eventCleanedName}`
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
    )}!\n\nView details\n\nontreasure.xyz/host/events/${eventCleanedName}`
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
    }! Please review their application: ontreasure.xyz/host/events/${eventCleanedName}/vendors`
  );
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

export {
  sendAttendeeTicketPurchasedSMS,
  sendVendorTablePurchasedSMS,
  sendVendorAppSubmittedSMS,
  sendHostTableSoldSMS,
  sendHostTicketSoldSMS,
  sendHostVendorAppReceievedSMS,
  type HostSoldPayload,
};
