import { Button } from "@/components/ui/button";
import { CurrentStep, useCreateEvent } from "../context/CreateEventContext";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../schema";

const ProgressCell = ({ active }: { active: boolean }) => {
  return <div className={`w-full ${active ? "bg-primary" : "bg-gray-300"}`} />;
};

const ProgressBar = ({ currentStep }: { currentStep: CurrentStep }) => {
  return (
    <div className="flex h-1.5">
      <ProgressCell active={currentStep >= 1} />
      <ProgressCell active={currentStep >= 2} />
    </div>
  );
};

export default function MenuBar() {
  const { currentStep, dispatch } = useCreateEvent();
  const form = useFormContext<CreateEvent>();

  const onSubmit = async (values: CreateEvent) => {
    console.log(values);
  };

  const handleContinue = async () => {
    if (currentStep === CurrentStep.STEP_ONE) {
      dispatch({
        type: "setCurrentStep",
        payload: CurrentStep.STEP_TWO,
      });

      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="-mx-4 sm:-mx-8 w-full bg-background fixed bottom-0">
      <ProgressBar currentStep={currentStep} />
      <div className="px-0 py-0 flex space-x-0 h-12">
        <Button
          type="button"
          variant={"tertiary"}
          onClick={() =>
            dispatch({ type: "setCurrentStep", payload: CurrentStep.STEP_ONE })
          }
          className="w-full h-full rounded-none"
        >
          Save Draft
        </Button>
        <Button
          type="button"
          variant={"default"}
          onClick={handleContinue}
          className={cn(
            "w-full h-full rounded-none relative overflow-hidden",
            currentStep === CurrentStep.STEP_TWO &&
              "bg-purple-400 hover:bg-purple-500"
          )}
        >
          <span className="relative z-10">
            {currentStep === CurrentStep.STEP_TWO ? "Create Event" : "Continue"}
          </span>
        </Button>
      </div>
    </div>
  );
}
