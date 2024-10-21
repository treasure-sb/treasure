import { CurrentStep } from "../../context/CreateEventContext";
import { cn } from "@/lib/utils";

const MobileProgressCell = ({ active }: { active: boolean }) => {
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

export const MobileProgressBar = ({
  currentStep,
}: {
  currentStep: CurrentStep;
}) => {
  return (
    <div className="flex h-1.5">
      <MobileProgressCell active={currentStep >= 1} />
      <MobileProgressCell active={currentStep >= 2} />
    </div>
  );
};

export const DesktopProgresBar = ({
  currentStep,
}: {
  currentStep: CurrentStep;
}) => {
  return (
    <div className="flex space-x-2">
      <DesktopProgressCell active={currentStep >= 1} />
      <DesktopProgressCell active={currentStep >= 2} />
    </div>
  );
};
