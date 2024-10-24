import { Button } from "@/components/ui/button";
import { useCreateEvent } from "../../context/CreateEventContext";
import { CurrentStep } from "../../context/CreateEventContext";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../../schema";
import { toast } from "sonner";
import { handleImagesUpload } from "./helper";
import { updatedCreateEvent } from "@/lib/actions/events";
import { EventCreatedProps } from "@/emails/EventCreated";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { sendEventCreatedEmail } from "@/lib/actions/emails";

export default function ContinueSubmitButton({
  isDesktop,
  className = "",
}: {
  isDesktop: boolean | undefined;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { currentStep, user, originalDraft, eventId, dispatch } =
    useCreateEvent();
  const { push } = useRouter();
  const form = useFormContext<CreateEvent>();
  const isLoggedIn = user !== null;

  const onSubmit = async (values: CreateEvent) => {
    try {
      toast.loading("Creating event...");

      setLoading(true);

      const updatedValues = await handleImagesUpload(values, originalDraft);
      const { data, error } = await updatedCreateEvent(updatedValues, eventId);
      if (error) {
        throw error;
      }
      const eventUrl: string = data;

      toast.dismiss();
      toast("Event created successfully");

      const eventCreatedEmailPayload: EventCreatedProps = {
        eventName: values.basicDetails.name,
        posterUrl: updatedValues.poster as string,
        cleanedEventName: eventUrl,
        hostName: user?.first_name || "",
        hostUsername: user?.username || "",
      };

      if (user?.email) {
        await sendEventCreatedEmail(user?.email, eventCreatedEmailPayload);
      }
      await sendEventCreatedEmail(
        "treasure20110@gmail.com",
        eventCreatedEmailPayload
      );

      push(`/events/${eventUrl}`);
    } catch (err) {
      toast.dismiss();
      console.log(err);
      toast("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (currentStep === CurrentStep.STEP_ONE) {
      dispatch({
        type: "setCurrentStep",
        payload: CurrentStep.STEP_TWO,
      });

      setTimeout(() => {
        window.scrollBy({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }, 100);
    } else {
      const onError = () => {
        if (isLoggedIn) {
          toast.error("Please fill in all required fields");
        }
      };

      form.handleSubmit(onSubmit, onError)();
    }
  };

  return (
    <Button
      type="button"
      variant={"default"}
      disabled={loading}
      onClick={handleContinue}
      className={cn(
        "w-full h-full rounded-none relative overflow-hidden",
        currentStep === CurrentStep.STEP_TWO &&
          "bg-purple-400 hover:bg-purple-500 disabled:bg-purple-400/80",
        className,
        isDesktop && "rounded-sm"
      )}
    >
      <span className="relative z-10">
        {currentStep === CurrentStep.STEP_TWO ? "Create Event" : "Continue"}
      </span>
    </Button>
  );
}
