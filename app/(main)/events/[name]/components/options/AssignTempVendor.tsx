"use client";

import { Tables } from "@/types/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { fetchTemporaryVendors } from "@/lib/helpers/profiles";
import { LucideUserPlus2 } from "lucide-react";
import { toast } from "sonner";
import { TagData } from "../../types";

type TemporaryVendor = Tables<"temporary_profiles"> & {
  temporary_vendors: {
    event_id: string;
  }[];
};

export default function AssignTempVendor({
  event,
  tags,
}: {
  event: Tables<"events">;
  tags: TagData[];
}) {
  const { refresh } = useRouter();
  const [search, setSearch] = useState("");
  const [tagId, setTagId] = useState("");
  const supabase = createClient();

  const { data, refetch } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      const profiles = await fetchTemporaryVendors(search);
      return profiles;
    },
    enabled: search.length > 0,
  });

  const temporaryVendors: TemporaryVendor[] = data || [];

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 300);

  const handleAddVendor = async (profileId: string) => {
    if (tagId === "") {
      toast.error("Please add a vendor tag");
      return;
    }

    const { error } = await supabase
      .from("temporary_vendors")
      .insert([{ vendor_id: profileId, event_id: event.id, tag_id: tagId }]);

    if (error) {
      toast.error("Error adding vendor");
      return;
    }
    refetch();
    refresh();
  };

  const handleRemoveVendor = async (profileId: string) => {
    const { error } = await supabase
      .from("temporary_vendors")
      .delete()
      .eq("event_id", event.id)
      .eq("vendor_id", profileId);

    if (error) {
      toast.error("Error removing vendor");
      return;
    }
    refetch();
    refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="hover:cursor-pointer opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
          <LucideUserPlus2 size={50} className="stroke-1 mx-auto" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add temporary vendor</DialogTitle>
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            autoComplete="off"
            id="search"
            placeholder="Search Profile"
            className="pl-0"
          />
          <Select onValueChange={(value) => setTagId(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              {tags.map(({ tags }) => (
                <SelectItem value={tags.id}>{tags.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogHeader>
        {data &&
          search.trim().length > 0 &&
          temporaryVendors.map((profile) => (
            <div key={profile.id} className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2 items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback />
                    <AvatarImage src={profile.avatar_url} />
                  </Avatar>
                  <p className="text-sm font-semibold">
                    {profile.business_name}
                  </p>
                </div>
                {profile.temporary_vendors
                  .map((event) => event.event_id)
                  .includes(event.id) ? (
                  <Button
                    variant={"destructive"}
                    onClick={() => handleRemoveVendor(profile.id)}
                    className="h-6 p-4 text-xs w-16"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    className="h-6 p-4 text-xs w-16"
                    onClick={() => handleAddVendor(profile.id)}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}
