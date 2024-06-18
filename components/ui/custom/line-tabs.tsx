import { motion } from "framer-motion";

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={` ${
        selected
          ? "text-foreground"
          : "text-foreground/30 hover:text-foregrond/40"
      } relative rounded-md  px-2 py-1 text-sm font-medium transition-colors duration-500`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.div
          className="absolute left-0 top-0 flex size-full h-full w-full items-end justify-center"
          layoutId={"linetab"}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
        >
          <span className="z-0 h-[3px] w-[60%] rounded-full bg-primary"></span>
        </motion.div>
      )}
    </button>
  );
};

const LineTabs = ({
  tabs,
  active,
  onSelect,
}: {
  tabs: string[];
  active: string;
  onSelect: (select: string) => void;
}) => {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2 justify-center">
      {tabs.map((tab) => (
        <Tab
          text={tab}
          selected={active === tab}
          setSelected={onSelect}
          key={tab}
        />
      ))}
    </div>
  );
};

export default LineTabs;
