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

export default function VerifyCode({
  phoneNumber,
  countryCode,
  goBack,
}: {
  phoneNumber: string;
  countryCode: string;
  goBack: () => void;
}) {
  const { replace } = useRouter();
  const [code, setCode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const handleChange = (value: string) => setCode(value);

  const isCodeComplete = () => {
    return code.replace(" ", "").length === 6;
  };

  useEffect(() => {
    const verifyCode = async () => {
      if (isCodeComplete()) {
        setVerifying(true);
        const filteredPhoneNumber = filterPhoneNumber(phoneNumber);
        const formattedPhoneNumber = `${countryCode}${filteredPhoneNumber}`;

        toast.loading("Verifying code...");
        const verification = await verifyUser(formattedPhoneNumber, code);
        console.log(verification);
        toast.dismiss();
        if (verification.success) {
          toast.success("Code verified");
          if (!verification.profileExists) {
            setAdditionalInfo(true);
          } else {
            replace("/");
          }
        } else {
          toast.error("Verification Error");
        }
      }
      setVerifying(false);
    };
    verifyCode();
  }, [code]);

  return (
    <AnimatePresence>
      {additionalInfo ? (
        <AdditionalInfo />
      ) : (
        <motion.div
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
              <span className="font-semibold">{phoneNumber}</span>
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
