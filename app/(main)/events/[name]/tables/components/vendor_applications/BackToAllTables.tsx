import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TableView } from "../../store";
import { useVendorFlow } from "../../context/VendorFlowContext";
import { useVendorApplicationStore } from "./store";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/custom/back-button";

export default function BackToAllTables() {
  const [openDialog, setOpenDialog] = useState(false);
  const { dispatch } = useVendorFlow();

  const handleLeaveApplication = () => {
    setOpenDialog(false);
    dispatch({ type: "setCurrentView", payload: TableView.Table });
    useVendorApplicationStore.getState().resetApplication();
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <BackButton label="All Tables" />
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="space-y-4">
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            All your progress will be lost if you leave.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleLeaveApplication()}
            className="w-full"
            variant={"destructive"}
          >
            Leave
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            variant={"secondary"}
            className="w-full"
          >
            Stay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
