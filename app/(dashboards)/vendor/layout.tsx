"use client";

import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import { useStore } from "./store";
import { useQuery } from "@tanstack/react-query";
import { validateUser } from "@/lib/actions/auth";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useStore();
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await validateUser();
      return user || null;
    },
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  return (
    <div className="p-6 px-4 md:p-0 md:grid md:grid-cols-[360px_minmax(200px,1fr)] md:min-h-screen">
      <MobileHeader />
      <Sidebar />
      {children}
    </div>
  );
}
