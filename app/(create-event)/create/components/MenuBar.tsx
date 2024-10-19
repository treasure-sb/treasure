import { Button } from "@/components/ui/button";
import { CurrentStep, useCreateEvent } from "../context/CreateEventContext";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../schema";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { customLandingEase } from "@/components/landing-page/Free";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { updatedCreateEvent } from "@/lib/actions/events";
import { useRouter } from "next/navigation";
import { validateUser } from "@/lib/actions/auth";
import { getProfile } from "@/lib/helpers/profiles";
import { EventCreatedProps } from "@/emails/EventCreated";
import { Eye, EyeOff } from "lucide-react";
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";

const menuVariants = {
  hidden: {
    y: "100%",
  },
  visible: {
    y: 0,
    transition: {
      ease: customLandingEase,
      duration: 1,
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
  const { currentStep, user, preview, eventId, originalDraft, dispatch } =
    useCreateEvent();
  const [isMounted, setIsMounted] = useState(false);
  const { push, refresh } = useRouter();
  const [loading, setLoading] = useState(false);
  const { getValues } = useFormContext<CreateEvent>();
  const supabase = createClient();
  const form = useFormContext<CreateEvent>();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLoggedIn = user !== null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uploadFileToBucket = async (file: File, storageFolder: string) => {
    if (file) {
      const fileExtension = file.name.split(".").pop();
      const { data } = await supabase.storage
        .from(storageFolder)
        .upload(`${storageFolder}${Date.now()}.${fileExtension}`, file);

      if (data) {
        return data.path;
      }
    }
    return null;
  };

  const deleteFileFromBucket = async (filePath: string) => {
    if (filePath) {
      await supabase.storage.from("posters").remove([filePath]);
    }
  };

  const handlePosterUpload = async (values: CreateEvent) => {
    let updatedValues = { ...values };

    updatedValues.venueMap = values.venueMap
      ? values.venueMap
      : "venue_map_coming_soon";
    updatedValues.poster = values.poster ? values.poster : "poster_coming_soon";

    if (values.poster instanceof File) {
      const posterPath = await uploadFileToBucket(values.poster, "posters");
      if (
        originalDraft?.poster_url &&
        originalDraft?.poster_url !== "poster_coming_soon"
      ) {
        await deleteFileFromBucket(originalDraft?.poster_url);
      }
      updatedValues.poster = posterPath || "poster_coming_soon";
    }

    if (values.venueMap instanceof File) {
      const venueMapPath = await uploadFileToBucket(
        values.venueMap,
        "venue_maps"
      );
      if (
        originalDraft?.venue_map_url &&
        originalDraft?.venue_map_url !== "venue_map_coming_soon"
      ) {
        await deleteFileFromBucket(originalDraft?.venue_map_url);
      }
      updatedValues.venueMap = venueMapPath || "venue_map_coming_soon";
    }

    return updatedValues;
  };

  const onSubmit = async (values: CreateEvent) => {
    try {
      toast.loading("Creating event...");

      setLoading(true);

      const updatedValues = await handlePosterUpload(values);
      const { data, error } = await updatedCreateEvent(updatedValues);
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

      // if (user?.email) {
      //   await sendEventCreatedEmail(user?.email, eventCreatedEmailPayload);
      // }
      // await sendEventCreatedEmail(
      //   "treasure20110@gmail.com",
      //   eventCreatedEmailPayload
      // );

      push(`/events/${eventUrl}`);
    } catch (err) {
      toast.dismiss();
      console.log(err);
      toast("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    try {
      toast.loading("Saving event...");
      const values = getValues();

      const updatedValues = await handlePosterUpload(values);

      if (eventId) {
        const { error } = await supabase.rpc("save_draft", {
          event_data: updatedValues,
          user_id: user!.id,
          p_event_id: eventId,
        });

        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase.rpc("save_draft", {
          event_data: updatedValues,
          user_id: user!.id,
        });

        if (error) {
          throw error;
        }

        const draftEventId = data;
        dispatch({ type: "setEventId", payload: draftEventId });
      }

      refresh();
      toast.dismiss();
      toast.success("Event saved successfully");
    } catch (err: any) {
      console.log(err);
      toast.dismiss();
      if ((err.message as string).includes("events_name_check")) {
        toast.error("Please include a name for your event");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
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
      form.handleSubmit(onSubmit, () => {
        if (isLoggedIn) {
          toast.error("Please fill in all required fields");
        }
      })();
    }
  };

  if (!isMounted) {
    return null;
  }

  const ContinueSubmitButton = ({
    className = "",
  }: { className?: string } = {}) => {
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
  };

  const PreviewButton = () => {
    return (
      <Button
        type="button"
        variant={"ghost"}
        onClick={() => {
          dispatch({
            type: "setPreview",
            payload: preview ? false : true,
          });
        }}
        className={cn(
          "w-fit h-full rounded-none relative overflow-hidden",
          isDesktop && "rounded-sm"
        )}
      >
        {preview ? <EyeOff width={60} /> : <Eye width={60} />}
      </Button>
    );
  };

  const SaveButton = () => {
    return (
      <Button
        type="button"
        variant={"tertiary"}
        onClick={onSave}
        className={cn(
          "w-full h-full rounded-none relative overflow-hidden",
          isDesktop && "rounded-sm"
        )}
      >
        <span className="relative z-10">Save</span>
      </Button>
    );
  };

  const onLoggedIn = async () => {
    const {
      data: { user },
    } = await validateUser();

    const { profile } = await getProfile(user?.id);

    dispatch({
      type: "setUser",
      payload: profile,
    });
  };

  const LoggedMenuButton =
    !isLoggedIn && currentStep === CurrentStep.STEP_TWO ? (
      <LoginFlowDialog
        trigger={ContinueSubmitButton()}
        onLoginSuccess={onLoggedIn}
      />
    ) : (
      <ContinueSubmitButton />
    );

  const desktopMenuBar = (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 w-full -mx-8 flex items-center justify-center py-4 z-50"
    >
      <div className="rounded-full bg-white dark:bg-black bg-opacity-70 w-full max-w-2xl lg:max-w-5xl p-8 border border-foreground h-24 flex items-center justify-center">
        <div className="flex-1 space-y-2">
          <DesktopProgresBar currentStep={currentStep} />
          <div className="flex space-x-2">
            <SaveButton />
            <PreviewButton />
            {LoggedMenuButton}
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
      className="-mx-4 sm:-mx-8 w-full bg-background fixed bottom-0 z-50"
    >
      <ProgressBar currentStep={currentStep} />
      <div className="px-0 py-0 flex space-x-0 h-12">
        <SaveButton />
        <PreviewButton />
        {LoggedMenuButton}
      </div>
    </motion.div>
  );

  return isDesktop ? desktopMenuBar : mobileMenuBar;
}
