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
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";
import { validateUser } from "@/lib/actions/auth";
import { sendEventCreatedEmail } from "@/lib/actions/emails";

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
  const { currentStep, user, dispatch } = useCreateEvent();
  const [isMounted, setIsMounted] = useState(false);
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (values: CreateEvent) => {
    try {
      toast.loading("Creating event...");

      setLoading(true);
      let updatedValues = { ...values };
      updatedValues.venueMap = "venue_map_coming_soon";
      updatedValues.poster = "poster_coming_soon";

      if (values.poster instanceof File) {
        const posterPath = await uploadFileToBucket(values.poster, "posters");
        updatedValues.poster = posterPath || "poster_coming_soon";
      }

      if (values.venueMap instanceof File) {
        const venueMapPath = await uploadFileToBucket(
          values.venueMap,
          "venue_maps"
        );
        updatedValues.venueMap = venueMapPath || "venue_map_coming_soon";
      }
      const { data, error } = await updatedCreateEvent(updatedValues);
      if (error) {
        throw error;
      }
      const eventUrl: string = data;

      toast.dismiss();
      toast("Event created successfully");
      const log = await sendEventCreatedEmail(values.basicDetails.name);
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

  const MenuButton = ({ className = "" }: { className?: string } = {}) => {
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

  const onLoggedIn = async () => {
    const {
      data: { user },
    } = await validateUser();

    dispatch({
      type: "setUser",
      payload: user,
    });
  };

  const LoggedMenuButton =
    !isLoggedIn && currentStep === CurrentStep.STEP_TWO ? (
      <LoginFlowDialog trigger={MenuButton()} onLoginSuccess={onLoggedIn} />
    ) : (
      <MenuButton />
    );

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
          <div className="flex space-x-2">{LoggedMenuButton}</div>
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
      <div className="px-0 py-0 flex space-x-0 h-12">{LoggedMenuButton}</div>
    </motion.div>
  );

  return isDesktop ? desktopMenuBar : mobileMenuBar;
}
