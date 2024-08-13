"use client";

import { ThemeProvider } from "@/utils/providers/ThemeProvider";
import { usePathname } from "next/navigation";
import { path } from "pdfkit";
import { useEffect, useState } from "react";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    const isHome = pathname?.includes("/home") || false;
    if (isHome !== isHomePage) {
      setIsHomePage(isHome);
      document.body.classList.toggle("light", isHome);
      document.body.classList.toggle("dark", !isHome);
    }
  }, [pathname, isHomePage]);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={isHomePage ? "light" : "dark"}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
