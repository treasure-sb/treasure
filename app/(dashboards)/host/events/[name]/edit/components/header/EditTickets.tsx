import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { useState } from "react";
import EditTicketsForm from "./EditTicketsForm";

export default function EditTickets({
  tickets,
  eventId,
  setParentEdit,
}: {
  tickets: Tables<"tickets">[];
  eventId: string;
  setParentEdit: (toggle: boolean) => void;
}) {
  const [edit, setEdit] = useState(false);
  const minimumTicketPrice = tickets[0].price;
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
            className="w-24"
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
