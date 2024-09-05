"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import BackButton from "@/components/ui/custom/back-button";
import Link from "next/link";

export default function Exit() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent hideCloseIcon={true}>
          <DialogHeader>
            <DialogTitle>Are you sure you want to exit?</DialogTitle>
            <DialogDescription>
              Any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between">
            <div className="flex flex-col md:flex-row space-y-2 mt-2 md:mt-0 md:space-y-0 md:space-x-2">
              <Button
                onClick={() => setIsOpen(false)}
                variant={"accent"}
                className="w-full"
              >
                Cancel
              </Button>
              <Button asChild variant={"destructive"} className="w-full">
                <Link href="/home">Exit</Link>
              </Button>
            </div>
            <Button>Save and Exit</Button>
          </div>
        </DialogContent>
      </Dialog>
      <BackButton label="Exit Create Event" onClick={() => setIsOpen(true)} />
    </>
  );
}
