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
  tables,
  prebooked,
}: {
  event: Tables<"events">;
  table: Tables<"tables">;
  user: User | null;
  tables: Tables<"tables">[];
  prebooked: boolean;
}) {
  const { push } = useRouter();
  const { currentStep } = useVendorApplicationStore();
  const [exitDialog, setExitDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenChange = () => {
    if (!user) {
      push(`/login?event=${event.cleaned_name}`);
      return;
    }

    // If user is on submitted page, toggle the application dialog and reset the application
    if (currentStep === 6) {
      setDialogOpen(!dialogOpen);
      resetApplication();
      return;
    }

    if (dialogOpen) {
      setExitDialog(true);
    } else {
      setDialogOpen(!dialogOpen);
    }
  };

  const handleReturn = () => {
    setExitDialog(false);
  };

  const handleExit = () => {
    setExitDialog(false);
    setDialogOpen(false);
    resetApplication();
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="font-normal text-sm p-2">
            {prebooked ? "Click Here" : "Apply Now"}
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[90%] block">
          <DialogHeader className="my-4 space-y-4">
            <DialogTitle className="text-xl text-center">
              <span className="font-bold text-primary">{event.name}</span>
              {" - "}
              {prebooked ? "Vendor Info" : "Vendor Application"}
            </DialogTitle>
            <Separator />
          </DialogHeader>
          <VendorApplication
            event={event}
            table={table}
            handleOpenChange={handleOpenChange}
            tables={tables}
            prebooked={prebooked}
          />
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
