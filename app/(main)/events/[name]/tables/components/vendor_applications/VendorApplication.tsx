"use client";
import { useVendorFlow } from "../../context/VendorFlowContext";
import Login from "./steps/Login";
import VendorInformation from "./steps/VendorInformation";
import TermsAndConditions from "./steps/TermsAndConditions";
import ReviewInformation from "./steps/ReviewInformation";
import BackToAllTables from "./BackToAllTables";
import VendorAppProgress from "./VendorAppProgress";
import { useVendorApplication } from "../../context/VendorApplicationContext";

export default function VendorApplication() {
  const { profile } = useVendorFlow();
  const { currentStep } = useVendorApplication();

  return (
    <div className="h-[calc(100vh-300px)]">
      <VendorAppProgress />
      <BackToAllTables />
      <h2 className="text-2xl font-semibold mb-4">Vendor Application</h2>
      {!profile && <Login />}
      {profile && currentStep === 1 && <VendorInformation />}
      {profile && currentStep === 2 && <TermsAndConditions />}
      {profile && currentStep === 3 && <ReviewInformation />}
    </div>
  );
}
