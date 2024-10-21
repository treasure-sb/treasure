"use client";
import { Tables } from "@/types/supabase";
import { useVendorApplication } from "../../context/VendorApplicationContext";
import { Button } from "@/components/ui/button";
import { TableView, useVendorFlow } from "../../context/VendorFlowContext";
import { formatPhoneNumber } from "@/components/ui/custom/phone-input";
import { VendorInfo } from "../../types";
import { LiveTable } from "@/types/tables";

export default function ContinueButton({
  table,
  tableCount,
}: {
  table: LiveTable;
  tableCount: number;
}) {
  const { profile, event, tags, flowDispatch } = useVendorFlow();
  const { applicationDispatch } = useVendorApplication();

  const areApplicationsOpen =
    event.vendor_exclusivity === "APPLICATIONS" ||
    event.vendor_exclusivity === "APPLICATIONS_NO_PAYMENT" ||
    event.vendor_exclusivity === "PUBLIC";

  const isSoldOut = table.quantity === 0;

  const autofillVendorInfo = () => {
    let vendorInfo: VendorInfo = {} as VendorInfo;
    let inventory = "";
    let autoFillTags: Tables<"tags">[] = [];
    if (profile) {
      vendorInfo = {
        phone: formatPhoneNumber(
          profile.phone?.slice(profile?.phone.length - 10) || ""
        ),
        email: profile.email,
        businessName: profile.business_name,
        firstName: profile.first_name,
        lastName: profile.last_name,
        instagram: profile.instagram,
      };
      inventory = profile.inventory || "";

      profile.tags?.forEach((pTag) => {
        tags.forEach((eTag) => {
          if (pTag.id === eTag.id) autoFillTags.push(eTag);
        });
      });
    }

    applicationDispatch({ type: "setVendorInfo", payload: vendorInfo });
    applicationDispatch({ type: "setInventory", payload: inventory });
    applicationDispatch({ type: "setVendorTags", payload: autoFillTags });
  };

  const handleCheckout = async () => {
    if (areApplicationsOpen) {
      applicationDispatch({ type: "setTable", payload: table });
      applicationDispatch({ type: "setTableQuantity", payload: tableCount });
      autofillVendorInfo();
      flowDispatch({ type: "setCurrentView", payload: TableView.Application });
    }
  };

  return (
    <Button
      disabled={!areApplicationsOpen || isSoldOut}
      onClick={async () => await handleCheckout()}
      className="w-full rounded-full p-6 relative"
    >
      {areApplicationsOpen ? (
        <p>Continue to Registration</p>
      ) : (
        <p>Not Accepting Applications</p>
      )}
      {isSoldOut && (
        <div className="absolute -rotate-12 bg-red-500 p-2 w-36">Sold Out</div>
      )}
    </Button>
  );
}
