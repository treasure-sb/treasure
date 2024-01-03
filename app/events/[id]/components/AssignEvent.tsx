"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { fetchTemporaryProfiles } from "@/lib/helpers/profiles";
import AssignEventIcon from "@/components/icons/AssignEventIcon";

export default function AssignEvent({ event }: { event: Tables<"events"> }) {
  const supabase = createClient();
  const { refresh } = useRouter();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      const profiles = await fetchTemporaryProfiles(search);
      return profiles;
    },
    enabled: search.length > 0,
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 300);

  const handleAssign = async (profileId: string) => {
    await supabase
      .from("events")
      .update({ organizer_id: profileId, organizer_type: "temporary_profile" })
      .eq("id", event.id);
    setIsOpen(false);
    refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="hover:cursor-pointer opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
          <AssignEventIcon />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign event to a temporary profile</DialogTitle>
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            autoComplete="off"
            id="search"
            placeholder="Search Profile"
            className="pl-0"
          />
        </DialogHeader>
        {data && search.trim().length > 0
          ? data?.map((profile) => (
              <div
                key={profile.id}
                className="flex justify-between items-center"
              >
                <div className="flex space-x-3 items-center">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback />
                    <AvatarImage src={profile.avatar_url} />
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">
                      {profile.business_name}
                    </p>
                    <p className="text-sm text-gray-400">@{profile.username}</p>
                  </div>
                </div>
                <Button onClick={() => handleAssign(profile.id)}>Assign</Button>
              </div>
            ))
          : null}
      </DialogContent>
    </Dialog>
  );
}
