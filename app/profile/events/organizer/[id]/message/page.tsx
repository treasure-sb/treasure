"use client";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const event_id = params.id;
  const [ticketGroups, setTicketGroups] = useState<Tables<"tickets">[]>([]);

  useEffect(() => {
    const fetchTicketGroups = async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", event_id);

      if (data) {
        setTicketGroups(data);
      }
    };

    fetchTicketGroups();
  }, []);

  return (
    <main className="w-full m-auto max-w-xl">
      <h1>Select Group(s) to Message:</h1>
      <div className="flex mt-2 space-x-2">
        {ticketGroups.map((ticket) => {
          return (
            <Button
              type="button"
              variant={"secondary"}
              className="h-10"
              key={ticket.id}
            >
              <h1>{ticket.name}</h1>
            </Button>
          );
        })}
        {/* Additional button for "Vendor" */}
        <Button type="button" variant={"secondary"} className="h-10">
          <h1>Vendor</h1>
        </Button>
      </div>
      <Textarea rows={15} className="my-10" placeholder="Your message..." />
      <Button className="w-full" type="submit">
        Send Message
      </Button>
    </main>
  );
}
