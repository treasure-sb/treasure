"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signUpUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterPhoneNumber, validateEmail } from "@/lib/utils";
import VerifyCode from "./components/VerifyCode";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { SubmitMethod } from "./components/VerifyCode";

export default function Page({
  searchParams,
}: {
  searchParams: {
    signup_invite_token?: string;
    temporary_profile: string;
    invite_token: string;
    event: string;
  };
}) {
  const { replace } = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [usePhone, setUsePhone] = useState(true);
  const [method, setMethod] = useState(SubmitMethod.PHONE);
  const [countryCode, setCountryCode] = useState("+1");
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const signupInviteToken = searchParams.signup_invite_token;
  const inviteToken = searchParams.invite_token || null;
  const event = searchParams.event || null;

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
    <main className="px-4 mt-20 w-80 md:w-96 m-auto space-y-10 relative">
      <AnimatePresence>
        {showVerifyCode ? (
          <VerifyCode
            phoneNumber={phoneNumber}
            countryCode={countryCode}
            email={email}
            method={method}
            goBack={goBack}
          />
        ) : (
          <motion.div
            key="signupForm"
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 mt-10 h-full"
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
                    <Select
                      value={countryCode}
                      onValueChange={(value) => setCountryCode(value)}
                    >
                      <SelectTrigger className="w-20 absolute">
                        <SelectValue placeholder="+1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+52">+52</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="pl-24"
                      placeholder="Phone Number"
                      type="tel"
                      onChange={(e) => handlePhoneInputChange(e)}
                      value={phoneNumber}
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
      <div className="fixed md:absolute top-0 md:top-[-100px] left-[-100px] h-80 w-80 bg-primary rounded-full z-[-10] blur-2xl md:blur-3xl opacity-[0.05]" />
      <div className="fixed md:absolute bottom-[200px] md:bottom-[-200px] left-0 md:left-[100px] h-80 w-80 bg-primary rounded-full z-[-10] blur-2xl md:blur-3xl opacity-[0.05]" />
    </main>
  );
}
