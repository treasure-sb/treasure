import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { sectionVariants } from "../../CreateEventFormSections";
import { motion } from "framer-motion";
import CreateEventCard from "../../CreateEventCard";
import { PlusIcon } from "lucide-react";

export default function EventHighlights() {
  const [showHighlights, setShowHighlights] = useState(false);

  const handleSwitch = () => {
    setShowHighlights((prev) => !prev);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="guests">Do you have any images to highlight?</Label>
        <Switch id="guests" onCheckedChange={handleSwitch} />
      </div>
      {showHighlights && (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CreateEventCard
            title="Add Images To Highlight Your Event"
            className="bg-purple-300 border-purple-500 hover:bg-opacity-30 transition duration-300 hover:cursor-pointer"
          >
            <div className="text-foreground text-base flex items-center justify-center space-x-2 pb-4">
              <PlusIcon size={18} />
              <span>Add an Image</span>
            </div>
          </CreateEventCard>
        </motion.div>
      )}
    </div>
  );
}
