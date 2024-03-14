"use client";
import { useVendorApplicationStore } from "../store";
import { useVendorFlowStore } from "../../../store";
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

export default function VendorInformation() {
  const {
    table,
    currentStep,
    inventory,
    comments,
    vendorsAtTable,
    tableQuantity,
    setVendorsAtTable,
    setComments,
    setInventory,
    setCurrentStep,
  } = useVendorApplicationStore();
  const { profile } = useVendorFlowStore();
  const { vendorInfo, setVendorInfo } = useVendorApplicationStore();

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
          <FloatingLabelInput readOnly label="Phone" value={profile?.phone} />
        ) : (
          <FloatingLabelInput
            label="Phone"
            value={vendorInfo.phone || ""}
            onChange={(e) =>
              setVendorInfo({ ...vendorInfo, phone: e.target.value })
            }
          />
        )}
        {profile?.email ? (
          <FloatingLabelInput readOnly label="Email" value={profile?.email} />
        ) : (
          <FloatingLabelInput
            label="Email"
            value={vendorInfo.email || ""}
            onChange={(e) =>
              setVendorInfo({ ...vendorInfo, email: e.target.value })
            }
          />
        )}
        <div className="flex space-x-4">
          <FloatingLabelInput
            value={vendorInfo.firstName || ""}
            onChange={(e) => {
              setVendorInfo({ ...vendorInfo, firstName: e.target.value });
            }}
            label="First Name"
          />
          <FloatingLabelInput
            value={vendorInfo.lastName || ""}
            onChange={(e) => {
              setVendorInfo({ ...vendorInfo, lastName: e.target.value });
            }}
            label="Last Name"
          />
        </div>
        <FloatingLabelInput
          value={vendorInfo.businessName || ""}
          onChange={(e) =>
            setVendorInfo({ ...vendorInfo, businessName: e.target.value })
          }
          label="Business Name (Optional)"
        />
        <div className="flex items-center justify-between">
          <p>Vendors at Table</p>
          <Select
            value={vendorsAtTable > 0 ? vendorsAtTable.toString() : undefined}
            onValueChange={(value) => setVendorsAtTable(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>{vendorsOptions}</SelectContent>
          </Select>
        </div>
        <Textarea
          value={inventory}
          onChange={(e) => setInventory(e.target.value)}
          placeholder="Tell us a little bit more about your inventory. (Required)"
        />
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Do you have any additional comments?"
        />
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
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
