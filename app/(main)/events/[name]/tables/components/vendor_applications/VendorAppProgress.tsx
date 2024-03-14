"use client";
import { useVendorApplicationStore } from "./store";
import { cn } from "@/lib/utils";

export default function VendorAppProgress() {
  const { currentStep } = useVendorApplicationStore();

  const steps = Array.from({ length: 3 }, (_, i) => {
    return (
      <div
        className={cn(
          "h-3 w-3 rounded-full transition-all duration-500",
          currentStep >= i + 1 ? "bg-primary" : "bg-secondary"
        )}
      />
    );
  });

  return <div className="mt-4 mb-6 flex justify-between mx-6">{steps}</div>;
}
