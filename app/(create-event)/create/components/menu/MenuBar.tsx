import { CurrentStep, useCreateEvent } from "../../context/CreateEventContext";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { customLandingEase } from "@/components/landing-page/Free";
import { validateUser } from "@/lib/actions/auth";
import { getProfile } from "@/lib/helpers/profiles";
import { DesktopProgresBar, MobileProgressBar } from "./Progress";
import SaveButton from "./SaveButton";
import ContinueSubmitButton from "./ContinueSubmitButton";
import PreviewButton from "./PreviewButton";
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

export default function MenuBar() {
  const { currentStep, user, dispatch } = useCreateEvent();
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLoggedIn = user !== null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
        trigger={ContinueSubmitButton({ isDesktop })}
        onLoginSuccess={onLoggedIn}
      />
    ) : (
      <ContinueSubmitButton isDesktop={isDesktop} />
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
            <SaveButton isDesktop={isDesktop} />
            <PreviewButton isDesktop={isDesktop} />
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
      <MobileProgressBar currentStep={currentStep} />
      <div className="px-0 py-0 flex space-x-0 h-12">
        <SaveButton isDesktop={isDesktop} />
        <PreviewButton isDesktop={isDesktop} />
        {LoggedMenuButton}
      </div>
    </motion.div>
  );

  return isDesktop ? desktopMenuBar : mobileMenuBar;
}
