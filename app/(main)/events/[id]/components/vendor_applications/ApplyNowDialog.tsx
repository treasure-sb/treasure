"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useVendorApplicationStore, resetApplication } from "./store";
import { useState } from "react";
import VendorApplication from "./VendorApplication";

export default function ApplyNowDialog({
  event,
  table,
  user,
}: {
  event: Tables<"events">;
  table: Tables<"tables">;
  user: User | null;
}) {
  const { push } = useRouter();
  const { currentStep, applicationDialogOpen, setApplicationDialogOpen } =
    useVendorApplicationStore();
  const [exitDialog, setExitDialog] = useState(false);

  const handleOpenChange = () => {
    if (!user) {
      push(`/login?event=${event.cleaned_name}`);
      return;
    }

    // If user is on submitted page, toggle the application dialog and reset the application
    if (currentStep === 6) {
      setApplicationDialogOpen(!applicationDialogOpen);
      resetApplication();
      return;
    }

    if (applicationDialogOpen) {
      setExitDialog(true);
    } else {
      setApplicationDialogOpen(!applicationDialogOpen);
    }
  };

  const handleReturn = () => {
    setExitDialog(false);
  };

  const handleExit = () => {
    setExitDialog(false);
    setApplicationDialogOpen(false);
    resetApplication();
  };

  return (
    <>
      <Dialog open={applicationDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="font-normal text-sm p-2">
            Apply Now
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[90%] block">
          <DialogHeader className="my-4 space-y-4">
            <DialogTitle className="text-xl text-center">
              {event.name} Vendor Application
            </DialogTitle>
            <Separator />
          </DialogHeader>
          <VendorApplication event={event} table={table} />
        </DialogContent>
      </Dialog>
      {exitDialog && (
        <Dialog open={exitDialog} onOpenChange={setExitDialog}>
          <DialogContent className="text-center">
            <h1 className="mt-6">
              Are you sure you want to exit the application? All progress will
              be lost.
            </h1>
            <div className="w-[80%] mx-auto flex space-x-2 items-center">
              <Button
                onClick={() => handleReturn()}
                className="w-full"
                variant={"secondary"}
              >
                Return
              </Button>
              <Button
                onClick={() => handleExit()}
                className="w-full"
                variant={"destructive"}
              >
                Exit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
