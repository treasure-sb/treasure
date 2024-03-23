"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProfile } from "@/lib/actions/profile";
import { updateUserPhone, verifyPhoneChangeOTP } from "@/lib/actions/auth";
import OTPInput from "@/components/ui/custom/otp-input";
import PhoneInput, {
  filterPhoneNumber,
  formatPhoneNumber,
} from "@/components/ui/custom/phone-input";

export default function Phone({ profile }: { profile: Tables<"profiles"> }) {
  const phoneLength = profile.phone?.length || 0;
  const phoneNoCountryCode = profile.phone?.substring(phoneLength - 10);

  const [phoneNumber, setPhoneNumber] = useState(
    profile.phone ? formatPhoneNumber(phoneNoCountryCode as string) : ""
  );

  const [otp, setOTP] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const countryCode = "+1";

  useEffect(() => {
    const handleVerifyOTP = async () => {
      if (isOTPComplete()) {
        setVerifying(true);
        toast.loading("Verifying OTP...");
        const phoneWithCountryCode = `${countryCode}${filterPhoneNumber(
          phoneNumber
        )}`;

        const { error: verificationError } = await verifyPhoneChangeOTP(
          phoneWithCountryCode,
          otp
        );

        if (verificationError) {
          toast.dismiss();
          toast.error("Invalid OTP.");
          setVerifying(false);
          return;
        }

        const { error: userProfileUpdateError } = await updateProfile(
          { phone: phoneWithCountryCode },
          profile.id
        );

        if (userProfileUpdateError) {
          toast.dismiss();
          toast.error("Error updating phone number.");
          setVerifying(false);
          return;
        }

        toast.dismiss();
        toast.success("Phone number verified successfully.");
        setVerifying(false);
        setShowVerification(false);
      }
    };
    handleVerifyOTP();
  }, [otp]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Sending OTP...");

    const phoneWithCountryCode = `${countryCode}${filterPhoneNumber(
      phoneNumber
    )}`;

    const { error: updatePhoneError } = await updateUserPhone(
      phoneWithCountryCode
    );

    if (updatePhoneError) {
      toast.dismiss();
      toast.error(updatePhoneError.message);
      setLoading(false);
      return;
    }

    toast.dismiss();
    toast.success("OTP sent successfully.");
    setLoading(false);
    setShowVerification(true);
  };

  const isOTPComplete = () => {
    return otp.replace(" ", "").length === 6;
  };

  const handleUpdatePhone = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  };

  const handleUpdateOTP = (value: string) => {
    setOTP(value);
  };

  const updateButtonDisabled =
    loading ||
    filterPhoneNumber(phoneNumber) === phoneNoCountryCode ||
    !phoneNumber;

  return (
    <div className="max-w-xl md:max-w-6xl space-y-4">
      <h3 className="font-semibold text-xl mb-4">Phone Number</h3>
      <p>
        Manage the phone number you use to login to Treasure and receive SMS
        updates.
      </p>
      <form className="flex max-w-md" onSubmit={(e) => handleUpdate(e)}>
        <PhoneInput
          phoneNumber={phoneNumber}
          updatePhoneNumber={handleUpdatePhone}
        />
        <Button className="rounded-md" disabled={updateButtonDisabled}>
          Update
        </Button>
      </form>
      <p className="text-xs text-gray-400">
        We'll need to send you a code to verify your phone number.
      </p>
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogDescription>
              Please enter the code we sent to{" "}
              <span className="font-semibold">{phoneNumber}</span>.
            </DialogDescription>
          </DialogHeader>
          <OTPInput
            value={otp}
            verifying={verifying}
            onChange={handleUpdateOTP}
            valueLength={6}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
