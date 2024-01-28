"use client";

import { Tables } from "@/types/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function MessageTables({
  tables,
}: {
  tables: Tables<"tables">[];
}) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleClickGroup = (tableName: string) => {
    if (selectedGroups.includes(tableName)) {
      setSelectedGroups(selectedGroups.filter((name) => name !== tableName));
    } else {
      setSelectedGroups([...selectedGroups, tableName]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      <h1>Select Table(s) to Message:</h1>
      <div className="flex mt-2 space-x-2">
        {tables.map((table) => {
          return (
            <Button
              type="button"
              variant={
                selectedGroups.includes(table.section_name)
                  ? "default"
                  : "secondary"
              }
              className="h-10"
              key={table.id}
              onClick={() => handleClickGroup(table.section_name)}
            >
              <h1>{table.section_name}</h1>
            </Button>
          );
        })}
      </div>
      <Textarea rows={15} className="my-10" placeholder="Your message..." />
      <div className="flex justify-end">
        <Button variant={"tertiary"} className="w-40" type="button">
          Send Message
        </Button>
      </div>
    </motion.div>
  );
}
