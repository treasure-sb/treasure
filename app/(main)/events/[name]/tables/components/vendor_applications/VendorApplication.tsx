"use client";
import { useVendorApplicationStore } from "./store";
import { TableView, useVendorFlowStore } from "../../store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BackButton from "@/components/ui/custom/back-button";
import Login from "./steps/Login";
import VendorInformation from "./steps/VendorInformation";
import TermsAndConditions from "./steps/TermsAndConditions";
import ReviewInformation from "./steps/ReviewInformation";

export default function VendorApplication() {
  const { currentStep, profile } = useVendorApplicationStore();
  const { setCurrentView } = useVendorFlowStore();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLeaveApplication = () => {
    setOpenDialog(false);
    setCurrentView(TableView.ALL_TABLES);
    useVendorApplicationStore.getState().resetApplication();
  };

  return (
    <div className="h-[calc(100vh-280px)]">
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
      <h2 className="text-2xl font-semibold mb-4">Vendor Application</h2>
      {!profile && <Login />}
      {profile && currentStep === 1 && <VendorInformation />}
      {profile && currentStep === 2 && <TermsAndConditions />}
      {profile && currentStep === 3 && <ReviewInformation />}
    </div>
  );
}
