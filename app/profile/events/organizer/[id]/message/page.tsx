"use client";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const event_cleaned_name = params.id;
  const [ticketGroups, setTicketGroups] = useState<Tables<"tickets">[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  useEffect(() => {
    const fetchTicketGroups = async () => {
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("cleaned_name", event_cleaned_name)
        .single();

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", event.id);

      if (data) {
        setTicketGroups(data);
      }
    };

    if (!ticketGroups.length) {
      fetchTicketGroups();
    }
  }, []);

  const handleClickGroup = (groupName: string) => {
    if (selectedGroups.includes(groupName)) {
      setSelectedGroups(selectedGroups.filter((group) => group !== groupName));
    } else {
      setSelectedGroups([...selectedGroups, groupName]);
    }
  };

  return (
    <main className="w-full m-auto max-w-xl">
      <h1>Select Group(s) to Message:</h1>
      <div className="flex mt-2 space-x-2">
        {ticketGroups.map((ticket) => {
          return (
            <Button
              type="button"
              variant={
                selectedGroups.includes(ticket.name) ? "default" : "secondary"
              }
              className="h-10"
              key={ticket.id}
              onClick={() => handleClickGroup(ticket.name)}
            >
              <h1>{ticket.name}</h1>
            </Button>
          );
        })}
        {/* Additional button for "Vendor" */}
        <Button
          type="button"
          variant={selectedGroups.includes("Vendor") ? "default" : "secondary"}
          className="h-10"
          onClick={() => handleClickGroup("Vendor")}
        >
          <h1>Vendor</h1>
        </Button>
      </div>
      <Textarea rows={15} className="my-10" placeholder="Your message..." />
      <Button className="w-full" type="button">
        Send Message
      </Button>
    </main>
  );
}
