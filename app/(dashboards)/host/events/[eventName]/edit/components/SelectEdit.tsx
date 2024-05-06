import { useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, TicketIcon, Calendar } from "lucide-react";

const tabs = [
  { title: "Event", icon: <Calendar /> },
  { title: "Tickets", icon: <TicketIcon /> },
  { title: "Vendors", icon: <Users /> },
];

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (selected: boolean) => ({
    gap: selected ? ".5rem" : 0,
    paddingLeft: selected ? "1rem" : ".5rem",
    paddingRight: selected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0, type: "spring", bounce: 0, duration: 0.45 };

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (selected: string) => void;
  children: ReactNode;
  index: number;
}

const Tab = ({ text, selected, setSelected, index, children }: TabProps) => {
  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      custom={selected}
      onClick={() => setSelected(text)}
      transition={transition}
      className={`${
        selected ? "bg-primary text-background" : "hover:text-foreground/60"
      } relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300`}
    >
      {children}
      <AnimatePresence>
        {selected && (
          <motion.span
            variants={spanVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="overflow-hidden font-semibold"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default function SelectEdit({
  center,
  active,
  onSelect,
}: {
  center?: boolean;
  active: string;
  onSelect: (selected: string) => void;
}) {
  return (
    <div
      className={` ${
        center ? "justify-center " : ""
      } border-black-500/25 mb-8 flex flex-wrap items-center gap-2 border-b pb-2`}
    >
      {tabs.map((tab, index) => (
        <Tab
          text={tab.title}
          selected={active === tab.title}
          setSelected={onSelect}
          index={index}
          key={tab.title}
        >
          {tab.icon}
        </Tab>
      ))}
    </div>
  );
}
