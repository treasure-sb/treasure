import EventDates from "./sections/step_one/EventDates";
import EventDetails from "./sections/step_one/EventDetails";
import EventPoster from "./sections/step_one/EventPoster";
import EventTables from "./sections/step_one/EventTables";
import EventTickets from "./sections/step_one/EventTickets";
import EventVendorInfo from "./sections/step_two/EventVendorInfo";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateEvent } from "../context/CreateEventContext";
import { customLandingEase } from "@/components/landing-page/Free";
import EventVenueMap from "./sections/step_one/EventVenueMap";
import EventTags from "./sections/step_two/EventTags";

export const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.75, ease: customLandingEase },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.5 } },
};

export default function CreateEventFormSections() {
  const { currentStep } = useCreateEvent();

  return (
    <div className="w-full h-full flex flex-col space-y-4 lg:flex-row-reverse lg:space-y-0 lg:justify-between">
      <motion.div
        className="h-fit w-full lg:w-3/4 max-w-5xl mx-auto space-y-4 lg:space-y-10"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <EventPoster />
        <EventVenueMap />
      </motion.div>
      <div className="space-y-4 w-full lg:pr-10 lg:space-y-10">
        <AnimatePresence mode="wait">
          {currentStep >= 1 && (
            <motion.div
              className="space-y-4 lg:space-y-10"
              key="step1"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <EventDetails />
              <EventDates />
              <EventTickets />
              <EventTables />
            </motion.div>
          )}
          {currentStep >= 2 && (
            <motion.div
              key="step2"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 lg:space-y-10"
            >
              <EventVendorInfo />
              <EventTags />
              {/* <EventGuests />
              <EventHighlights /> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
