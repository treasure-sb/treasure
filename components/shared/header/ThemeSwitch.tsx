"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <SunIcon />
      <Switch
        id="theme"
        checked={theme === "dark" ? true : false}
        onCheckedChange={(value) => setTheme(value ? "dark" : "light")}
      />
      <MoonIcon />
    </div>
  );
}
