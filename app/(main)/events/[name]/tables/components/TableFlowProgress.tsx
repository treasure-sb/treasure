"use client";
import { motion } from "framer-motion";
import { StepValue, useVendorFlowStore } from "../store";
import { ArrowRight } from "lucide-react";

const Step = ({ step }: { step: StepValue }) => {
  const { currentStep } = useVendorFlowStore();
  let status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <div className="flex space-x-2">
      <motion.div
        initial={false}
        animate={status}
        variants={{
          active: { borderColor: "#71d08c" },
          inactive: { borderColor: "#fff" },
          complete: { borderColor: "#71d08c", backgroundColor: "#71d08c" },
        }}
        className="rounded-full w-5 h-5 border-[1px] flex items-center justify-center"
      >
        {status === "complete" && <CheckMark />}
      </motion.div>
      <p>{StepValue[step]}</p>
    </div>
  );
};

const CheckMark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
        }}
        d="M3.95121 8.71896L5.18273 9.9538C5.58553 10.3577 6.24404 10.3434 6.62889 9.92233L11.3934 4.7099"
        stroke="#0D0F0E"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default function TableFlowProgress() {
  const { currentStep } = useVendorFlowStore();

  return (
    <motion.div
      animate={{
        y: currentStep === StepValue.Application ? -6 : 0,
        opacity: currentStep === StepValue.Application ? 0.1 : 1,
      }}
      transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
      className="flex justify-between m-auto"
    >
      <Step step={StepValue.Table} />
      <ArrowRight className="stroke-1" />
      <Step step={StepValue.Application} />
      <ArrowRight className="stroke-1" />
      <Step step={StepValue.Complete} />
    </motion.div>
  );
}
