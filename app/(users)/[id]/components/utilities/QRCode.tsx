import { QrCodeIcon } from "lucide-react";

export default function QRCode() {
  return (
    <div className="absolute bottom-1 right-1 w-fit p-2 rounded-full bg-secondary hover:cursor-pointer hover:scale-110 transition duration-300">
      <QrCodeIcon className="w-6 h-6 m-auto text-white" />
    </div>
  );
}
