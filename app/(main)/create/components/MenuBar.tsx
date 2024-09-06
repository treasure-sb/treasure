import { Button } from "@/components/ui/button";
import { CurrentStep, useCreateEvent } from "../context/CreateEventContext";

const ProgressCell = ({ active }: { active: boolean }) => {
  return (
    <div
      className={`w-full transition duration-300 ${
        active ? "bg-primary" : "bg-gray-300"
      }`}
    />
  );
};

const ProgressBar = ({ currentStep }: { currentStep: CurrentStep }) => {
  return (
    <div className="flex h-1.5">
      <ProgressCell active={currentStep >= 1} />
      <ProgressCell active={currentStep >= 2} />
      <ProgressCell active={currentStep >= 3} />
    </div>
  );
};

export default function MenuBar() {
  const { currentStep, dispatch } = useCreateEvent();

  const handleContinue = () => {
    dispatch({
      type: "setCurrentStep",
      payload:
        currentStep === CurrentStep.STEP_ONE
          ? CurrentStep.STEP_TWO
          : CurrentStep.STEP_THREE,
    });
  };

  return (
    <div className="-mx-4 sm:-mx-8 w-full bg-background fixed bottom-0">
      <ProgressBar currentStep={currentStep} />
      <div className="px-0 py-0 flex space-x-0 h-12">
        <Button
          type="button"
          variant={"tertiary"}
          className="w-full h-full rounded-none"
        >
          Save Draft
        </Button>
        <Button
          type="button"
          variant={"default"}
          onClick={handleContinue}
          className="w-full h-full rounded-none"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
