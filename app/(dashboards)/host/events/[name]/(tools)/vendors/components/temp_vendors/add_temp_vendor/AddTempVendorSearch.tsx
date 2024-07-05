import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

type TemporaryVendor = Tables<"temporary_profiles">;

export default function AddTempVendorSearch() {
  const [openSearch, setOpenSearch] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
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

  return (
    <>
      <Dialog open={openSearch} onOpenChange={setOpenSearch}>
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
            temporaryVendors.map((profile) => (
              <div key={profile.id} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 items-center hover:bg-secondary/20 w-full rounded-md p-2 hover:cursor-pointer">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback />
                      <AvatarImage src={profile.avatar_url} />
                    </Avatar>
                    <p className="text-base">{profile.business_name}</p>
                  </div>
                </div>
              </div>
            ))}
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
      />
    </>
  );
}
