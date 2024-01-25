import { Button } from "@/components/ui/button";
import { useVendorApplicationStore } from "../store";
import { Checkbox } from "@/components/ui/checkbox";
import { useTermsAndConditions } from "../query";

export default function TermsAndConditions() {
  const { currentStep, event, termsChecked, setTermsChecked, setCurrentStep } =
    useVendorApplicationStore();
  const terms = useTermsAndConditions(event);

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Terms and Conditions</h1>
        <ul className="list-disc list-outside ml-5 flex flex-col gap-3">
          {terms?.map((term) => (
            <li key={term} className="text-sm sm:text-base">
              {term}
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={termsChecked}
            id="terms"
            onClick={() => setTermsChecked(!termsChecked)}
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
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="w-full"
          variant={"secondary"}
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          className={`${
            termsChecked
              ? "bg-primary cursor-pointer"
              : "bg-primary/40 pointer-events-none"
          } w-full`}
        >
          Continue
        </Button>
      </div>
    </>
  );
}
