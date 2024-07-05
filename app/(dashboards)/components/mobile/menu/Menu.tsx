import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, MenuIcon } from "lucide-react";
import { logoutUser } from "@/lib/actions/auth";
import { useQueryClient } from "@tanstack/react-query";
import HostMenuOptions from "./HostMenuOptions";
import VendorMenuOptions from "./VendorMenuOptions";
import Link from "next/link";
import AdminMenuOptions from "./AdminMenuOptions";
import Image from "next/image";

export default function Menu({ type }: { type: "host" | "vendor" | "admin" }) {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const handleLogout = async () => {
    await logoutUser();
    queryClient.clear();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <MenuIcon className="stroke-1" size={38} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader className="mt-6">
          <SheetTitle>
            <Link
              href="/home"
              className="font-semibold text-3xl space-x-1 flex items-center justify-center mr-6"
            >
              <Image
                src="/static/web_logo.png"
                alt="web logo"
                width={150}
                height={120}
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between h-[80%] mx-4 mt-10">
          <div className="flex flex-col space-y-4">
            {type === "host" ? (
              <HostMenuOptions setIsOpen={setIsOpen} />
            ) : type === "vendor" ? (
              <VendorMenuOptions setIsOpen={setIsOpen} />
            ) : (
              <AdminMenuOptions setIsOpen={setIsOpen} />
            )}
          </div>
          <Button
            variant={"ghost"}
            className="rounded-sm text-lg font-normal justify-start space-x-2 p-6"
            onClick={async () => await handleLogout()}
          >
            <LogOut className="stroke-1" size={28} /> <p>Log out</p>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
