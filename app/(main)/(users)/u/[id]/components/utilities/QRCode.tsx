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
      <DialogTrigger className="absolute bottom-1 right-1 w-11 h-11 p-2 rounded-full bg-background dark:bg-foreground border-2 border-foreground dark:border-background hover:cursor-pointer transition duration-500">
        <QrCodeIcon className="text-foreground dark:text-background" />
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="flex items-center justify-center w-fit focus:outline-none p-10"
      >
        <QrCode value={qrValue} />
      </DialogContent>
    </Dialog>
  );
}
