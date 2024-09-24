import { useCreateEvent } from "../context/CreateEventContext";
import { Form } from "@/components/ui/form";
import { type CreateEvent } from "../schema";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { sectionVariants } from "./CreateEventFormSections";
import { AnimatePresence } from "framer-motion";
import Exit from "./sections/Exit";
import CreateEventFormSections from "./CreateEventFormSections";
import PreviewEvent from "./preview/PreviewEvent";
import BackgroundImage from "./BackgroundImage";

export default function CreateEventOrPreview({
  form,
}: {
  form: UseFormReturn<CreateEvent>;
}) {
  const { preview } = useCreateEvent();

  return (
    <AnimatePresence mode="wait">
      {preview ? (
        <PreviewEvent />
      ) : (
        <Form {...form}>
          <form className="pb-14 md:pb-28">
            <div className="max-w-lg lg:max-w-6xl mx-auto space-y-4">
              <div className="h-1" />
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <Exit />
              </motion.div>
              <CreateEventFormSections />
            </div>
          </form>
          <BackgroundImage />
        </Form>
      )}
    </AnimatePresence>
  );
}
