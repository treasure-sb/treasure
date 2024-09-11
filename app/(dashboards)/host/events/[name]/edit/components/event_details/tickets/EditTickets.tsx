import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { useState } from "react";
import EditTicketsForm from "./EditTicketsForm";
import { TicketDetails } from "../EditEventDetails";

export default function EditTickets({
  tickets,
  eventDates,
  eventId,
  setParentEdit,
}: {
  tickets: TicketDetails[];
  eventDates: Tables<"event_dates">[];
  eventId: string;
  setParentEdit: (toggle: boolean) => void;
}) {
  const [edit, setEdit] = useState(false);
  const minimumTicketPrice = tickets.length > 0 ? tickets[0].price : 0;
  const isTicketFree = minimumTicketPrice === 0;

  const toggleEdit = () => {
    setParentEdit(!edit);
    setEdit(!edit);
  };

  const MotionButton = motion(Button);

  return (
    <motion.div>
      {edit ? (
        <EditTicketsForm
          tickets={tickets}
          eventDates={eventDates}
          toggleEdit={toggleEdit}
          eventId={eventId}
        />
      ) : (
        <div className="items-center flex justify-between font-semibold space-x-4">
          <motion.p layout="position" className="text-lg">
            {isTicketFree
              ? "Tickets FREE"
              : `Tickets from $${minimumTicketPrice.toFixed(2)}`}
          </motion.p>
          <MotionButton
            layout="position"
            className="w-24 rounded-full"
            type="button"
            onClick={toggleEdit}
          >
            Edit
          </MotionButton>
        </div>
      )}
    </motion.div>
  );
}
