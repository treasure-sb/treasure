"use server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);

const sendOTP = (phoneNumber: string) => {
  return client.verify.v2
    .services(serviceSid as string)
    .verifications.create({
      to: phoneNumber,
      channel: "sms",
    })
    .then(() => {
      return {
        success: true,
        message: "OTP sent",
      };
    })
    .catch(() => {
      return {
        success: false,
        message: "Error sending OTP",
      };
    });
};

const verifyOTP = async (phoneNumber: string, otp: string) => {
  return client.verify.v2
    .services(serviceSid as string)
    .verificationChecks.create({ to: phoneNumber, code: otp })
    .then((verification) => {
      if (verification.valid) {
        return {
          success: true,
          message: "OTP verified successfully.",
        };
      } else {
        return {
          success: false,
          message: "OTP verification failed.",
        };
      }
    })
    .catch((error) => {
      return {
        success: false,
        message: "Error verifying OTP.",
      };
    });
};

export { sendOTP, verifyOTP };
