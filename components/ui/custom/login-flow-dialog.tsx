import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginFlow from "@/app/(login)/login/components/LoginFlow";

export default function LoginFlowDialog({
  trigger,
}: {
  trigger: React.JSX.Element;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="w-80 md:w-96 h-[22rem] flex items-center"
      >
        <div className="-mt-8 w-full">
          <LoginFlow isDialog={true} subheading="Sig up or Login" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
