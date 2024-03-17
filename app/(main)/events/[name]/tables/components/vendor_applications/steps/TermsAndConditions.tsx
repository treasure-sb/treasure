"use client";
import { useVendorApplication } from "../../../context/VendorApplicationContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useVendorFlow } from "../../../context/VendorFlowContext";

export default function TermsAndConditions() {
  const { terms } = useVendorFlow();
  const { currentStep, termsAccepted, applicationDispatch } =
    useVendorApplication();

  const handleTermsAccepted = () => {
    applicationDispatch({ type: "setTermsAccepted", payload: !termsAccepted });
  };

  const handleContinue = () => {
    applicationDispatch({ type: "setCurrentStep", payload: currentStep + 1 });
  };

  const handleBack = () => {
    applicationDispatch({ type: "setCurrentStep", payload: currentStep - 1 });
  };

  return (
    <div className="h-full space-y-10">
      <div className="space-y-6">
        <h2 className="text-xl">Terms and Conditions</h2>
        <ul className="list-disc list-outside ml-5 flex flex-col gap-3">
          {terms.map((term) => (
            <li key={term.term} className="text-md sm:text-base">
              {term.term}
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={termsAccepted}
            id="terms"
            onClick={handleTermsAccepted}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept Terms and Conditions
          </label>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleBack} className="w-full" variant={"secondary"}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className={`${
            termsAccepted
              ? "bg-primary cursor-pointer"
              : "bg-primary/40 pointer-events-none"
          } w-full`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
