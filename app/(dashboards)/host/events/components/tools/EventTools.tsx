import { motion } from "framer-motion";
import { MoveLeftIcon } from "lucide-react";
import { useStore } from "../../../store";
import EventPoster from "@/app/(main)/events/[id]/components/EventPoster";
import VendorDataTable from "./VendorDataTable";

export default function EventTools() {
  const { event, setEvent } = useStore();

  return (
    event && (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: "easeInOut" }}
      >
        <div
          onClick={() => setEvent(null)}
          className="flex items-center mb-4 group cursor-pointer"
        >
          <MoveLeftIcon className="mr-2 stroke-1 group-hover:translate-x-[-0.25rem] transition duration-300" />
          <p className="md:text-lg">Back</p>
        </div>
        <h1 className="my-2 text-xl">{event.name}</h1>
        <div className="w-24 md:w-32">
          <EventPoster posterUrl={event.publicPosterUrl} />
        </div>
        <VendorDataTable />
      </motion.div>
    )
  );
}
