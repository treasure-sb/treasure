"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signUpUser } from "@/lib/actions/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { validateEmail } from "@/lib/utils";
import { filterPhoneNumber } from "@/components/ui/custom/phone-input";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import VerifyCode from "./VerifyCode";
import PhoneInput from "@/components/ui/custom/phone-input";

export enum SubmitMethod {
  PHONE = "phone",
  EMAIL = "email",
}

interface LoginFlowProps {
  isDialog: boolean;
  heading?: string;
  subheading?: string;
  action?: () => void;
  redirect?: string;
}

export default function LoginFlow({
  isDialog,
  heading,
  subheading,
  action,
  redirect,
}: LoginFlowProps) {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState(SubmitMethod.PHONE);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [usePhone, setUsePhone] = useState(true);
  const signupInviteToken = "signup_invite_token";
  const countryCode = "+1";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (usePhone) {
      handlePhoneSubmit();
    } else {
      handleEmailSubmit();
    }
    setLoading(false);
  };

  const handlePhoneSubmit = async () => {
    const filteredPhoneNumber = filterPhoneNumber(phoneNumber);
    if (!filteredPhoneNumber || filteredPhoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    toast.loading("Sending...");
    const formattedPhoneNumber = `${countryCode}${filteredPhoneNumber}`;
    const signUpUserResult = await signUpUser({
      phone: formattedPhoneNumber,
      signupInviteToken,
    });

    signupCheck(signUpUserResult, SubmitMethod.PHONE);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    toast.loading("Sending...");
    const signUpUserResult = await signUpUser({ email, signupInviteToken });
    signupCheck(signUpUserResult, SubmitMethod.EMAIL);
  };

  const signupCheck = (signupResult: any, method: SubmitMethod) => {
    if (signupResult.success) {
      toast.dismiss();
      toast.success("Code sent");
      setMethod(method);
      setShowVerifyCode(true);
    } else {
      toast.dismiss();
      toast.error("Error sending code");
    }
  };

  const goBack = () => {
    setShowVerifyCode(false);
  };

  const handleUpdatePhoneNumber = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  };

  return (
    <AnimatePresence>
      {showVerifyCode ? (
        <VerifyCode
          phoneNumber={phoneNumber}
          countryCode={countryCode}
          email={email}
          method={method}
          goBack={goBack}
          isDialog={isDialog}
          action={action}
          redirect={redirect}
        />
      ) : (
        <motion.div
          key="signupForm"
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 mt-10 w-full flex-shrink-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-xl font-semibold">
              {heading || "Welcome to Treasure"}
            </h1>
            {subheading && <p className="text-lg">{subheading}</p>}
          </motion.div>
          <motion.form
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {usePhone ? (
              <div className="space-y-2">
                <PhoneInput
                  className="bg-transparent dark:bg-transparent"
                  phoneNumber={phoneNumber}
                  updatePhoneNumber={handleUpdatePhoneNumber}
                  placeholder="(555) 555-5555"
                />
                <p
                  onClick={() => setUsePhone(false)}
                  className="text-gray-400 text-sm hover:cursor-pointer hover:text-gray-300 transition duration-300 w-fit"
                >
                  Use email instead
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <InputWithLabel
                  className="bg-transparent dark:bg-transparent"
                  id="email"
                  label="Email"
                  placeholder="johnsmith@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <p
                  onClick={() => setUsePhone(true)}
                  className="text-gray-400 text-sm hover:cursor-pointer hover:text-gray-300 transition duration-300 w-fit"
                >
                  Use phone instead
                </p>
              </div>
            )}
            <Button
              className="w-full rounded-md"
              disabled={loading}
              type="submit"
            >
              Continue
            </Button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
