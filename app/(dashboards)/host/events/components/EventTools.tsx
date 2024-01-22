import { EventDisplayData } from "@/types/event";
import { motion } from "framer-motion";
import { MoveLeft, MoveLeftIcon } from "lucide-react";
import { useStore } from "../../store";
import EventPoster from "@/app/(main)/events/[id]/components/EventPoster";

export default function EventTools({ event }: { event: EventDisplayData }) {
  const { setCurrentEvent } = useStore();

  return (
    <div>
      <div>
        <div
          onClick={() => setCurrentEvent(null)}
          className="flex items-center mb-4 group cursor-pointer"
        >
          <MoveLeftIcon className="mr-2 stroke-1 group-hover:translate-x-[-0.25rem] transition duration-300" />
          <p className="md:text-lg">Back</p>
        </div>
        <div className="w-24 md:w-32">
          <EventPoster posterUrl={event.publicPosterUrl} />
        </div>
      </div>
    </div>
  );
}
