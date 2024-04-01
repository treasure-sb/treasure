"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useVendorFlow } from "../../../context/VendorFlowContext";
import {
  VendorInfo,
  useVendorApplication,
} from "../../../context/VendorApplicationContext";
import PhoneInput from "@/components/ui/custom/phone-input";

export default function VendorInformation() {
  const { profile } = useVendorFlow();
  const {
    table,
    currentStep,
    inventory,
    comments,
    vendorsAtTable,
    tableQuantity,
    vendorInfo,
    applicationDispatch,
  } = useVendorApplication();

  const handleSetVendorsAtTable = (value: string) => {
    applicationDispatch({
      type: "setVendorsAtTable",
      payload: parseInt(value),
    });
  };

  const handleSetComments = (value: string) => {
    applicationDispatch({ type: "setComments", payload: value });
  };

  const handleSetInventory = (value: string) => {
    applicationDispatch({ type: "setInventory", payload: value });
  };

  const handleSetVendorInfo = (value: string, key: keyof VendorInfo) => {
    applicationDispatch({
      type: "setVendorInfo",
      payload: { ...vendorInfo, [key]: value },
    });
  };

  const handleContinue = () => {
    applicationDispatch({ type: "setCurrentStep", payload: currentStep + 1 });
  };

  const vendorsOptions = Array.from({
    length: table.number_vendors_allowed * tableQuantity,
  }).map((_, i) => (
    <SelectItem key={i} value={`${i + 1}`}>
      {i + 1}
    </SelectItem>
  ));

  const canContinue =
    inventory.length > 0 &&
    vendorsAtTable > 0 &&
    vendorInfo.email &&
    vendorInfo.firstName &&
    vendorInfo.lastName &&
    vendorInfo.phone;

  return (
    <div className="h-full flex flex-col justify-between space-y-10">
      <div className="space-y-6 h-full">
        <h2 className="text-xl">Vendor Information</h2>
        {profile?.phone ? (
          <PhoneInput
            readOnly
            phoneNumber={vendorInfo.phone as string}
            updatePhoneNumber={() => {}}
          />
        ) : (
          <PhoneInput
            phoneNumber={vendorInfo.phone || ""}
            updatePhoneNumber={(value) => handleSetVendorInfo(value, "phone")}
          />
        )}
        {profile?.email ? (
          <FloatingLabelInput
            readOnly
            label="Email"
            value={vendorInfo.email as string}
          />
        ) : (
          <FloatingLabelInput
            label="Email"
            type="email"
            value={vendorInfo.email || ""}
            onChange={(e) => handleSetVendorInfo(e.target.value, "email")}
          />
        )}
        <div className="flex space-x-4">
          <FloatingLabelInput
            value={vendorInfo.firstName || ""}
            onChange={(e) => handleSetVendorInfo(e.target.value, "firstName")}
            label="First Name"
          />
          <FloatingLabelInput
            value={vendorInfo.lastName || ""}
            onChange={(e) => handleSetVendorInfo(e.target.value, "lastName")}
            label="Last Name"
          />
        </div>
        <FloatingLabelInput
          value={vendorInfo.businessName || ""}
          onChange={(e) => handleSetVendorInfo(e.target.value, "businessName")}
          label="Business Name (Optional)"
        />
        <FloatingLabelInput
          value={vendorInfo.instagram || ""}
          onChange={(e) => handleSetVendorInfo(e.target.value, "instagram")}
          label="Instagram (Optional)"
        />
        <div className="flex items-center justify-between">
          <p>Vendors at Table</p>
          <Select
            value={vendorsAtTable > 0 ? vendorsAtTable.toString() : undefined}
            onValueChange={(value) => handleSetVendorsAtTable(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>{vendorsOptions}</SelectContent>
          </Select>
        </div>
        <Textarea
          value={inventory}
          onChange={(e) => handleSetInventory(e.target.value)}
          placeholder="Tell us a little bit more about your inventory. (Required)"
        />
        <Textarea
          value={comments}
          onChange={(e) => handleSetComments(e.target.value)}
          placeholder="Do you have any additional comments?"
        />
        <div className="flex space-x-2">
          <Button
            onClick={handleContinue}
            className={cn(
              "w-full",
              canContinue
                ? "bg-primary cursor-pointer"
                : "bg-primary/40 pointer-events-none"
            )}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
