"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { signUpUser } from "@/lib/actions/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { filterPhoneNumber, validateEmail } from "@/lib/utils";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import VerifyCode from "./VerifyCode";

export enum SubmitMethod {
  PHONE = "phone",
  EMAIL = "email",
}

export default function LoginFlow({
  isDialog,
  closeDialog,
}: {
  isDialog: boolean;
  closeDialog?: () => void;
}) {
  const phoneInputRef = useRef<HTMLInputElement>(null);
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

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let filteredValue = filterPhoneNumber(e.target.value);
    if (filteredValue.length > 10) {
      filteredValue = filteredValue.substring(0, 10);
    }

    if (filteredValue.length > 6) {
      filteredValue = `(${filteredValue.substring(
        0,
        3
      )}) ${filteredValue.substring(3, 6)}-${filteredValue.substring(6)}`;
    } else if (filteredValue.length > 3) {
      filteredValue = `(${filteredValue.substring(
        0,
        3
      )}) ${filteredValue.substring(3)}`;
    }
    setPhoneNumber(filteredValue);
  };

  const goBack = () => {
    setShowVerifyCode(false);
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
          closeDialog={closeDialog}
        />
      ) : (
        <motion.div
          key="signupForm"
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 mt-10 w-full h-full flex-shrink-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-xl font-semibold">Welcome to Treasure</h1>
            <p className="text-lg">Sign up or login</p>
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
                <div className="relative">
                  <FloatingLabelInput
                    ref={phoneInputRef}
                    id="phone"
                    type="tel"
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneInputChange(e)}
                  />
                </div>
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
