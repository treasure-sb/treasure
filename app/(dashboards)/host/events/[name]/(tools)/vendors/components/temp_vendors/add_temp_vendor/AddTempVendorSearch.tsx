import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchTemporaryVendors } from "@/lib/actions/vendors/temporary";
import { lineSpinner } from "ldrs";
import CreateTempVendor from "./CreateTempVendor";

lineSpinner.register();

type TemporaryVendor = Tables<"temporary_profiles_vendors"> & {
  temporary_vendors: {
    event_id: string;
  }[];
};

export default function AddTempVendorSearch({
  eventId,
  tags,
}: {
  eventId: string;
  tags: Tables<"tags">[];
}) {
  const [openSearch, setOpenSearch] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");

  const { refresh } = useRouter();
  const supabase = createClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      const profiles: TemporaryVendor[] = await fetchTemporaryVendors(search);
      return profiles;
    },
    enabled: search.length > 0,
  });

  const temporaryVendors: TemporaryVendor[] = data || [];

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 300);

  const handleAddVendor = async (profileId: string) => {
    setIsAdding(true);
    toast.loading("Adding vendor...");

    const { error } = await supabase.from("temporary_vendors").insert([
      {
        vendor_id: profileId,
        event_id: eventId,
        tag_id: tags ? tags[0].id : null,
      },
    ]);

    setIsAdding(false);
    toast.dismiss();

    if (error) {
      toast.error("Error adding vendor");
      return;
    }

    toast.success("Vendor added successfully");
    refetch();
    refresh();
  };

  const handleRemoveVendor = async (profileId: string) => {
    toast.loading("Removing vendor...");

    const { error } = await supabase
      .from("temporary_vendors")
      .delete()
      .eq("event_id", eventId)
      .eq("vendor_id", profileId);

    toast.dismiss();
    if (error) {
      toast.error("Error removing vendor");
      return;
    }

    toast.success("Vendor removed successfully");
    refetch();
    refresh();
  };

  const handleOpenCreate = () => {
    setOpenCreate(!openCreate);
    setOpenSearch(false);
  };

  const handleGoBackToSearch = () => {
    setOpenCreate(false);
    setOpenSearch(true);
  };

  const handleCloseSearchDialog = (open: boolean) => {
    setOpenSearch(open);
    if (!open) {
      setSearch("");
    }
  };

  return (
    <>
      <Dialog open={openSearch} onOpenChange={handleCloseSearchDialog}>
        <DialogTrigger asChild>
          <Button variant={"dotted"}>
            <PlusIcon size={14} />
            <p>Add Temporary Vendor</p>
          </Button>
        </DialogTrigger>
        <DialogContent hideCloseIcon={true} className="p-2 gap-3">
          <DialogHeader>
            <div className="relative">
              <SearchIcon
                size={20}
                className={cn(
                  "absolute left-4 top-[18px] text-muted-foreground"
                )}
              />
              <Input
                placeholder="Search for a vendor..."
                onChange={(e) => handleSearch(e.target.value)}
                className="border p-2 pl-12 rounded-md h-14 focus-within:border-primary"
              />
            </div>
          </DialogHeader>
          {temporaryVendors &&
            search.trim().length > 0 &&
            temporaryVendors.map((profile) => {
              const isVendorAdded = profile.temporary_vendors
                .map((event) => event.event_id)
                .includes(eventId);
              return (
                <div key={profile.id} className="flex space-x-2">
                  <Button
                    variant={"ghost"}
                    className="rounded-md h-10 p-2 py-8 justify-start text-left w-full"
                    onClick={() => handleAddVendor(profile.id)}
                    disabled={isAdding || isVendorAdded}
                  >
                    <div className="flex space-x-4 items-center w-full rounded-md p-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback />
                        <AvatarImage src={profile.avatar_url} />
                      </Avatar>
                      <div>
                        <p className="text-base">{profile.business_name}</p>
                        <p className="text-xs text-muted-foreground font-normal">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  </Button>
                  {isVendorAdded && (
                    <Button
                      variant={"destructive"}
                      onClick={() => handleRemoveVendor(profile.id)}
                      className="h-10 my-auto rounded-sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              );
            })}
          {isLoading && (
            <div className="flex justify-center">
              <l-line-spinner
                size="20"
                stroke="3"
                speed="1"
                color="white"
              ></l-line-spinner>
            </div>
          )}
          {!isLoading &&
            search.trim().length > 0 &&
            temporaryVendors.length === 0 && (
              <p className="text-center">No vendors found.</p>
            )}
          {search.trim().length === 0 && (
            <div className="absolute -bottom-[52px] w-full flex items-center justify-center space-x-2">
              <p className="text-muted-foreground">or</p>
              <Button className="rounded-sm" onClick={handleOpenCreate}>
                Create Temporary Vendor
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CreateTempVendor
        openCreate={openCreate}
        setOpenCreate={setOpenCreate}
        goBackToSearch={handleGoBackToSearch}
        eventId={eventId}
        tags={tags}
      />
    </>
  );
}
