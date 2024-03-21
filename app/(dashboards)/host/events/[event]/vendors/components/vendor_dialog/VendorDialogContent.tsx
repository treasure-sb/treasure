import { EventVendorData } from "../../page";
import { DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EventDisplayData } from "@/types/event";
import Link from "next/link";
import Pending from "./Pending";

const LabeledText = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <p className="text-md">
      <span className="text-primary font-semibold">{label}:</span> {children}
    </p>
  );
};

export default function VendorDialogContent({
  avatarUrl,
  vendorData,
  eventData,
}: {
  avatarUrl: string;
  vendorData: EventVendorData;
  eventData: EventDisplayData;
}) {
  const profile = vendorData.vendor;
  const table = vendorData.table;
  const {
    inventory,
    comments,
    table_quantity,
    vendors_at_table,
    application_status,
    application_email,
    application_phone,
  } = vendorData;

  return (
    <DialogContent className="h-[70%]">
      <div className="flex flex-col justify-between h-full text-sm md:text-base overflow-scroll scrollbar-hidden">
        <div>
          <div className="flex justify-between">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Review Information</h4>
              <LabeledText label="First Name">{profile.first_name}</LabeledText>
              <LabeledText label="Last Name">{profile.last_name}</LabeledText>
              <LabeledText label="Email">{application_email}</LabeledText>
              <LabeledText label="Phone">{application_phone}</LabeledText>
              <LabeledText label="Business Name">
                {profile.business_name || "N/A"}
              </LabeledText>
              <LabeledText label="Inventory">{inventory}</LabeledText>
              <LabeledText label="Comments">{comments}</LabeledText>
            </div>
            <div className="flex flex-col space-y-2 items-center">
              <Avatar className="w-12 h-12 md:w-24 md:h-24 mt-8">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback />
              </Avatar>
              <Link target="_blank" href={`/${profile.username}`}>
                <Button variant={"ghost"}>View Profile</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <p>
              {table.section_name}, {vendors_at_table} vendors at table
            </p>
            <p>Qty: {table_quantity}</p>
          </div>
          <Separator className="my-2" />
        </div>

        {application_status === "PENDING" && (
          <Pending vendorData={vendorData} eventData={eventData} />
        )}
      </div>
    </DialogContent>
  );
}
