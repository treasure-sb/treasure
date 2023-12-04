"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteEventButton({
  handleDelete,
}: {
  handleDelete: () => Promise<void>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Delete</Button>
      </DialogTrigger>
      <DialogContent className="rounded-md w-[80%]">
        <DialogHeader>
          <DialogTitle className="mb-10">
            Are you sure absolutely sure?
          </DialogTitle>
          <Button
            onClick={async () => await handleDelete()}
            className="w-[50%] m-auto"
            type="submit"
            variant={"destructive"}
          >
            Yes
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
