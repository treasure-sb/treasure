"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { signUpUser } from "@/lib/actions/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { validateEmail } from "@/lib/utils";
import { filterPhoneNumber } from "@/components/ui/custom/phone-input";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
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
}

export default function LoginFlow({
  isDialog,
  heading,
  subheading,
  action,
}: LoginFlowProps) {
  const [method, setMethod] = useState(SubmitMethod.PHONE);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [usePhone, setUsePhone] = useState(true);
  const signupInviteToken = "signup_invite_token";
  const countryCode = "+1";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usePhone) {
      handlePhoneSubmit();
    } else {
      handleEmailSubmit();
    }
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
                  phoneNumber={phoneNumber}
                  updatePhoneNumber={handleUpdatePhoneNumber}
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
                <FloatingLabelInput
                  id="email"
                  label="Email"
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
            <Button className="w-full rounded-md" type="submit">
              Continue
            </Button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
