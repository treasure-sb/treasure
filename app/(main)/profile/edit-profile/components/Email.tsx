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
import { updateUserEmail, verifyEmailChangeOTP } from "@/lib/actions/auth";
import { validateEmail } from "@/lib/utils";
import OTPInput from "@/components/ui/custom/otp-input";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";

export default function Phone({ profile }: { profile: Tables<"profiles"> }) {
  const [email, setEmail] = useState(profile.email || "");
  const [otp, setOTP] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const handleVerifyOTP = async () => {
      if (isOTPComplete()) {
        setVerifying(true);
        toast.loading("Verifying OTP...");

        const { error: verificationError } = await verifyEmailChangeOTP(
          email,
          otp
        );

        if (verificationError) {
          toast.dismiss();
          toast.error("Invalid OTP.");
          setVerifying(false);
          return;
        }

        const { error: userProfileUpdateError } = await updateProfile(
          { email },
          profile.id
        );

        if (userProfileUpdateError) {
          toast.dismiss();
          toast.error("Error updating email.");
          setVerifying(false);
          return;
        }

        toast.dismiss();
        toast.success("Email verified successfully.");
        setVerifying(false);
        setShowVerification(false);
      }
    };
    handleVerifyOTP();
  }, [otp]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    toast.loading("Sending OTP...");

    const { error: updateEmailError } = await updateUserEmail(email);

    if (updateEmailError) {
      toast.dismiss();
      toast.error(updateEmailError.message);
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

  const handleUpdateOTP = (value: string) => {
    setOTP(value);
  };

  const updateButtonDisabled = loading || !email || profile.email === email;

  return (
    <div className="max-w-xl md:max-w-6xl space-y-4">
      <h3 className="font-semibold text-xl mb-4">Email</h3>
      <p>Manage the email you use to login to Treasure and receive updates.</p>
      <form
        className="flex max-w-md items-end space-x-2"
        onSubmit={(e) => handleUpdate(e)}
      >
        <InputWithLabel
          id="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Button className="rounded-md" disabled={updateButtonDisabled}>
          Update
        </Button>
      </form>
      <p className="text-xs text-gray-400">
        We'll need to send you a code to verify your email.
      </p>
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Verify Email</DialogTitle>
            <DialogDescription>
              Please enter the code we sent to{" "}
              <span className="font-semibold">{email}</span>
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
