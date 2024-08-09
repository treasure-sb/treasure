"use client";

import LineTabs from "@/components/ui/custom/line-tabs";
import React, { useState } from "react";
import { useVendorModal } from "./useVendorModal";
import { Vendor } from "./vendor_applications/table/VendorDataColumns";
import { useSearchParams } from "next/navigation";
import { EventVendorData } from "../types";
import { EventDisplayData } from "@/types/event";

export interface VendorModalProps {
  selectedVendor?: EventVendorData | null;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  showVendorInfo?: (vendor_info: EventVendorData) => void;
}

interface TabStateProps {
  children: React.ReactNode[];
  vendorData: Vendor[];
}

export interface TabChildProps extends VendorModalProps {
  event: EventDisplayData;
}

export default function TabState({ children, vendorData }: TabStateProps) {
  const [active, setActive] = useState("Applications");
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");
  const modalProps = useVendorModal(vendorData, userParam);

  const tabs = ["Applications", "Temporary Vendors", "Assignments"];

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, modalProps as VendorModalProps);
    }
    return child;
  });

  return (
    <div>
      <LineTabs tabs={tabs} active={active} onSelect={handleSelect} />
      <div className="mt-8">
        {active === "Applications" && childrenWithProps![0]}
        {active === "Temporary Vendors" && childrenWithProps![1]}
        {active === "Assignments" && childrenWithProps![2]}
      </div>
    </div>
  );
}
