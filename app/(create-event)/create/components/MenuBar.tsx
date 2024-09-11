import { Button } from "@/components/ui/button";
import { CurrentStep, useCreateEvent } from "../context/CreateEventContext";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../schema";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { customLandingEase } from "@/components/landing-page/Free";

const menuVariants = {
  hidden: {
    y: "100%",
  },
  visible: {
    y: 0,
    transition: {
      ease: customLandingEase,
      duration: 1.75,
      delay: 0.25,
    },
  },
};

const ProgressCell = ({ active }: { active: boolean }) => {
  return <div className={`w-full ${active ? "bg-primary" : "bg-gray-300"}`} />;
};

const DesktopProgressCell = ({ active }: { active: boolean }) => {
  return (
    <div
      className={cn(
        "rounded-full h-3 w-full",
        active ? "bg-primary" : "bg-gray-300"
      )}
    />
  );
};

const ProgressBar = ({ currentStep }: { currentStep: CurrentStep }) => {
  return (
    <div className="flex h-1.5">
      <ProgressCell active={currentStep >= 1} />
      <ProgressCell active={currentStep >= 2} />
    </div>
  );
};

const DesktopProgresBar = ({ currentStep }: { currentStep: CurrentStep }) => {
  return (
    <div className="flex space-x-2">
      <DesktopProgressCell active={currentStep >= 1} />
      <DesktopProgressCell active={currentStep >= 2} />
    </div>
  );
};

export default function MenuBar() {
  const { currentStep, dispatch } = useCreateEvent();
  const [isMounted, setIsMounted] = useState(false);
  const form = useFormContext<CreateEvent>();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) {
    return null;
  }

  const desktopMenuBar = (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 w-full -mx-8 flex items-center justify-center py-4"
    >
      <div className="rounded-lg bg-background w-full max-w-2xl lg:max-w-5xl p-4 border border-foreground h-24 flex items-center justify-center">
        <div className="flex-1 space-y-2">
          <DesktopProgresBar currentStep={currentStep} />
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={"tertiary"}
              onClick={() =>
                dispatch({
                  type: "setCurrentStep",
                  payload: CurrentStep.STEP_ONE,
                })
              }
              className="w-full h-10 rounded-md"
            >
              Save Draft
            </Button>
            <Button
              type="button"
              variant={"default"}
              onClick={handleContinue}
              className={cn(
                "w-full h-10 rounded-md relative overflow-hidden",
                currentStep === CurrentStep.STEP_TWO &&
                  "bg-purple-400 hover:bg-purple-500"
              )}
            >
              <span className="relative z-10">
                {currentStep === CurrentStep.STEP_TWO
                  ? "Create Event"
                  : "Continue"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const mobileMenuBar = (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      className="-mx-4 sm:-mx-8 w-full bg-background fixed bottom-0"
    >
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
    </motion.div>
  );

  return isDesktop ? desktopMenuBar : mobileMenuBar;
}
