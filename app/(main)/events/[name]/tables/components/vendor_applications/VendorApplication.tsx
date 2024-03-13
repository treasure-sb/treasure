"use client";
import { useVendorApplicationStore } from "./store";
import { useVendorFlowStore } from "../../store";
import Login from "./steps/Login";
import VendorInformation from "./steps/VendorInformation";
import TermsAndConditions from "./steps/TermsAndConditions";
import ReviewInformation from "./steps/ReviewInformation";
import BackToAllTables from "./BackToAllTables";

export default function VendorApplication() {
  const { currentStep } = useVendorApplicationStore();
  const { profile } = useVendorFlowStore();

  return (
    <div className="h-[calc(100vh-280px)]">
      <BackToAllTables />
      <h2 className="text-2xl font-semibold mb-4">Vendor Application</h2>
      {!profile && <Login />}
      {profile && currentStep === 1 && <VendorInformation />}
      {profile && currentStep === 2 && <TermsAndConditions />}
      {profile && currentStep === 3 && <ReviewInformation />}
    </div>
  );
}
