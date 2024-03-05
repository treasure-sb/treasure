"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { filterPhoneNumber } from "@/lib/utils";
import { MoveLeftIcon } from "lucide-react";
import { verifyUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/ui/otp-input";
import AdditionalInfo from "./AdditionalInfo";

export enum SubmitMethod {
  PHONE = "phone",
  EMAIL = "email",
}

export default function VerifyCode({
  phoneNumber,
  email,
  countryCode,
  method,
  goBack,
}: {
  phoneNumber?: string;
  email?: string;
  countryCode?: string;
  method: SubmitMethod;
  goBack: () => void;
}) {
  const { replace } = useRouter();
  const [code, setCode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const handleChange = (value: string) => setCode(value);

  useEffect(() => {
    const verifyCode = async () => {
      if (isCodeComplete()) {
        setVerifying(true);
        if (method === SubmitMethod.PHONE && phoneNumber) {
          await handlePhoneSubmit(phoneNumber);
        } else if (method === SubmitMethod.EMAIL && email) {
          await handleEmailSubmit(email);
        }
        setVerifying(false);
      }
    };
    verifyCode();
  }, [code]);

  const isCodeComplete = () => {
    return code.replace(" ", "").length === 6;
  };

  const verificationCheck = async (verfication: any) => {
    if (verfication.success) {
      toast.success("Code verified");
      verfication.profileExists ? replace("/") : setAdditionalInfo(true);
    } else {
      toast.error("Verification Error");
    }
  };

  const handlePhoneSubmit = async (phoneNumber: string) => {
    const filteredPhoneNumber = filterPhoneNumber(phoneNumber);
    const formattedPhoneNumber = `${countryCode}${filteredPhoneNumber}`;
    toast.loading("Verifying code...");
    const verification = await verifyUser({
      phone: formattedPhoneNumber,
      code,
    });
    toast.dismiss();
    verificationCheck(verification);
  };

  const handleEmailSubmit = async (email: string) => {
    toast.loading("Verifying code...");
    const verification = await verifyUser({
      email,
      code,
    });
    toast.dismiss();
    verificationCheck(verification);
  };

  return (
    <AnimatePresence>
      {additionalInfo ? (
        <AdditionalInfo />
      ) : (
        <motion.div
          className="mt-[-2rem]"
          key="verifyCode"
          initial={{ opacity: 0, y: 5 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.7 },
          }}
          exit={{
            opacity: 0,
            y: 5,
            transition: {
              duration: 0.5,
            },
          }}
        >
          <div
            onClick={goBack}
            className="flex space-x-2 mb-4 hover:cursor-pointer w-fit"
          >
            <MoveLeftIcon className="stroke-1" />
            <span>Back</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl text-left font-semibold">Enter code</h1>
            <p className="text-sm text-gray-400">
              Enter the code we sent to{" "}
              <span className="font-semibold">
                {method === SubmitMethod.PHONE ? phoneNumber : email}
              </span>
            </p>
          </div>
          <OTPInput
            verifying={verifying}
            value={code}
            valueLength={6}
            onChange={handleChange}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
