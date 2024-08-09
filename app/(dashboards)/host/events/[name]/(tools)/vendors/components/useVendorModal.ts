import { useState, useCallback, useEffect } from "react";
import { Vendor } from "./vendor_applications/table/VendorDataColumns";
import { EventVendorData } from "../types";

export function useVendorModal(data: Vendor[], userParam: string | null) {
  const [selectedVendor, setSelectedVendor] = useState<EventVendorData | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const showVendorInfo = useCallback((vendorInfo: EventVendorData) => {
    setSelectedVendor(vendorInfo);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!hasInitialized && userParam) {
      const vendor = data.find((v) => v.username === userParam);
      if (vendor) {
        setSelectedVendor(vendor.vendor_info);
        setOpen(true);
      }
      setHasInitialized(true);
    }
  }, [userParam, data, hasInitialized]);

  return { selectedVendor, open, setOpen, showVendorInfo };
}
