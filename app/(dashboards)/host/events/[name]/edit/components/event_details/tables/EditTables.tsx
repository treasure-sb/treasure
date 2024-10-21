import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LiveTable } from "@/types/tables";
import EditTablesForm from "./EditTablesForm";

export default function EditTables({
  tables,
  eventId,
  setParentEdit,
}: {
  tables: LiveTable[];
  eventId: string;
  setParentEdit: (toggle: boolean) => void;
}) {
  const [edit, setEdit] = useState(false);
  const minimumTablePrice = tables.length > 0 ? tables[0].price : 0;

  const toggleEdit = () => {
    setParentEdit(!edit);
    setEdit(!edit);
  };

  const MotionButton = motion(Button);

  return (
    <motion.div>
      {edit ? (
        <EditTablesForm
          tables={tables}
          toggleEdit={toggleEdit}
          eventId={eventId}
        />
      ) : (
        <div className="items-center flex justify-between font-semibold space-x-4">
          <motion.p layout="position" className="text-lg">
            {`Tables from $${minimumTablePrice.toFixed(2)}`}
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
