"use client";

import { QrCodeIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import QrCode from "react-qr-code";

export default function QRCode({ username }: { username: string }) {
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    setQrValue(`${window.location.origin}/${username}`);
  }, [username]);

  return (
    <Dialog>
      <DialogTrigger className="absolute bottom-1 right-1 h-[40px] w-[40px] flex items-center justify-center rounded-full bg-secondary hover:cursor-pointer hover:scale-110 transition duration-300 focus:outline-none">
        <QrCodeIcon />
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center w-fit focus:outline-none">
        <QrCode value={qrValue} />
      </DialogContent>
    </Dialog>
  );
}
