"use client";
import { motion } from "framer-motion";
import { TableView } from "../context/VendorFlowContext";
import { ArrowRight } from "lucide-react";
import { useVendorFlow } from "../context/VendorFlowContext";
import { useTheme } from "next-themes";

const Step = ({ step }: { step: TableView }) => {
  const { currentView } = useVendorFlow();
  const { theme } = useTheme();

  let status =
    currentView === step
      ? "active"
      : currentView < step
      ? "inactive"
      : "complete";

  return (
    <div className="flex space-x-2 items-center">
      <motion.div
        initial={false}
        animate={status}
        variants={{
          active: { borderColor: theme === "light" ? "#2AAA88" : "#71d08c" },
          inactive: { borderColor: theme === "light" ? "#000" : "#fff" },
          complete: {
            borderColor: theme === "light" ? "#2AAA88" : "#71d08c",
            backgroundColor: theme === "light" ? "#2AAA88" : "#71d08c",
          },
        }}
        className="rounded-full w-4 h-4 border-[1px] flex items-center justify-center"
      >
        {status === "complete" && <CheckMark />}
      </motion.div>
      <p>{TableView[step]}</p>
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
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function TableFlowProgress() {
  const { currentView } = useVendorFlow();

  const AnimateOpacity = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={false}
      animate={{
        opacity: currentView === TableView.Application ? 0.25 : 1,
      }}
      transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      initial={false}
      animate={{ y: currentView === TableView.Application ? -8 : 0 }}
      transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
      className="flex justify-between m-auto"
    >
      <AnimateOpacity>
        <Step step={TableView.Table} />
      </AnimateOpacity>
      <AnimateOpacity>
        <ArrowRight className="stroke-1" />
      </AnimateOpacity>
      <Step step={TableView.Application} />
      <AnimateOpacity>
        <ArrowRight className="stroke-1" />
      </AnimateOpacity>
      <AnimateOpacity>
        <Step step={TableView.Complete} />
      </AnimateOpacity>
    </motion.div>
  );
}
