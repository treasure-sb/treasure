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

export default function VendorInformation() {
  const {
    table,
    currentStep,
    inventory,
    comments,
    vendorsAtTable,
    setVendorsAtTable,
    setComments,
    setInventory,
    setCurrentStep,
  } = useVendorApplicationStore();
  const { profile } = useVendorFlowStore();

  const vendorsOptions = Array.from({
    length: table.number_vendors_allowed,
  }).map((_, i) => (
    <SelectItem key={i} value={`${i + 1}`}>
      {i + 1}
    </SelectItem>
  ));

  return (
    <div className="h-full flex flex-col justify-between space-y-10">
      <h2 className="text-xl">Vendor Information</h2>
      <div className="space-y-8 h-full mt-8">
        <FloatingLabelInput label="Phone" />
        <FloatingLabelInput label="Email" />
        <div className="flex space-x-4">
          <FloatingLabelInput
            defaultValue={profile?.first_name}
            label="First Name"
          />
          <FloatingLabelInput
            defaultValue={profile?.last_name}
            label="Last Name"
          />
        </div>
        <FloatingLabelInput
          defaultValue={profile?.business_name || ""}
          label="Business Name"
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
            className={`${
              inventory.length > 0
                ? "bg-primary cursor-pointer"
                : "bg-primary/40 pointer-events-none"
            } w-full`}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
