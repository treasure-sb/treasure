"use client";

import { Tables } from "@/types/supabase";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
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
import { updatePhone, updateProfile } from "@/lib/actions/profile";
import { updateUserPhone, verifyPhoneChangeOTP } from "@/lib/actions/auth";
import OTPInput from "@/components/ui/custom/otp-input";

export default function Phone({ profile }: { profile: Tables<"profiles"> }) {
  const [phone, setPhone] = useState(profile.phone || "");
  const [otp, setOTP] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const handleVerifyOTP = async () => {
      if (isOTPComplete()) {
        setVerifying(true);
        toast.loading("Verifying OTP...");

        const { error: verificationError } = await verifyPhoneChangeOTP(
          phone,
          otp
        );

        if (verificationError) {
          toast.dismiss();
          toast.error("Invalid OTP.");
          setVerifying(false);
          return;
        }

        const { error: userProfileUpdateError } = await updateProfile(
          { phone },
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
      }
    };
    handleVerifyOTP();
  }, [otp]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    toast.loading("Sending OTP...");
    setLoading(true);

    const { error: updatePhoneError } = await updateUserPhone(phone);
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

  const handleUpdateOTP = (value: string) => {
    setOTP(value);
  };

  const isOTPComplete = () => {
    return otp.replace(" ", "").length === 6;
  };

  const updateButtonDisabled = loading || phone === profile.phone;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl mt-10">Phone Number</h2>
      <p>
        Manage the phone number you use to login to Treasure and receive SMS
        updates.
      </p>
      <form className="flex" onSubmit={(e) => handleUpdate(e)}>
        <FloatingLabelInput
          label="Phone Number"
          type="tel"
          defaultValue={profile.phone || ""}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button className="rounded-md" disabled={updateButtonDisabled}>
          Update
        </Button>
      </form>
      <p className="text-xs">
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
              Please enter the code we sent to your phone number.
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
