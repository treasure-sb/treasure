"use client";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions/auth";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const handleLogout = async () => {
    await logoutUser();
    queryClient.clear();
  };

  return (
    <Button
      onClick={async () => await handleLogout()}
      className="w-full rounded-sm flex justify-start gap-4 py-7"
      variant={"destructive"}
    >
      <LogOut className="stroke-2" />
      <p className="font-semibold text-base">Logout</p>
    </Button>
  );
}
