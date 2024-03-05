"use client";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions/auth";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const handleLogout = async () => {
    await logoutUser();
    queryClient.clear();
  };

  return (
    <Button
      onClick={async () => await handleLogout()}
      className="w-full"
      variant={"destructive"}
    >
      Logout
    </Button>
  );
}
