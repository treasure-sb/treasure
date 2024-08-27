import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginFlow from "@/app/(login)/login/components/LoginFlow";
import { useRouter } from "next/navigation";

export default function LoginFlowDialog({
  trigger,
  onLoginSuccess,
}: {
  trigger: React.JSX.Element;
  onLoginSuccess?: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = async () => {
    if (onLoginSuccess) {
      await onLoginSuccess();
    }
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="w-80 md:w-96 h-[22rem] flex items-center pb-12"
      >
        <LoginFlow
          isDialog={true}
          subheading="Sign up or Login"
          action={handleLoginSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
