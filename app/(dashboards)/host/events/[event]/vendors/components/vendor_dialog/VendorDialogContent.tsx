import { EventVendorData } from "../../page";
import { DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventDisplayData } from "@/types/event";
import Link from "next/link";
import Pending from "./Pending";
import EmailIcon from "@/components/icons/applications/EmailIcon";
import PhoneIcon from "@/components/icons/applications/PhoneIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <DialogContent className="h-[80%] overflow-scroll sm:overflow-auto">
      <div className="flex flex-col justify-between h-full text-sm md:text-base overflow-scroll scrollbar-hidden">
        <div className="w-full flex flex-col align-middle text-center space-y-4">
          <h4 className="text-xl font-semibold">Review Information</h4>
          <div className="flex justify-between px-2 sm:px-4 text-sm sm:text-lg">
            <p>
              {table.section_name}, {vendors_at_table} vendors at table
            </p>
            <p>Qty: {table_quantity}</p>
          </div>
          <div className="relative flex w-full justify-start gap-3 bg-secondary px-2 md:px-4 pt-4 pb-6 rounded-sm items-center">
            <Avatar className="w-16 h-16 md:w-24 md:h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback />
            </Avatar>
            {profile.business_name ? (
              <div className="flex flex-col text-left gap-1 md:gap-2 ">
                <h1 className="text-base md:text-lg font-bold">
                  {profile.business_name}
                </h1>
                <p className="text-xs md:text-sm">
                  {profile.first_name + " " + profile.last_name}
                </p>
              </div>
            ) : (
              <h1 className="text-base md:text-lg font-semibold text-left">
                {profile.first_name + " " + profile.last_name}
              </h1>
            )}

            <Link
              target="_blank"
              href={`/${profile.username}`}
              className="absolute right-2 bottom-2 text-xs text-primary bg-secondary"
            >
              Full Profile →
            </Link>
          </div>
          {/* divs for desktop */}
          <div className="hidden sm:flex flex-col gap-3 px-4">
            <div className="flex w-full justify-start gap-4 items-center">
              <EmailIcon width={30} />
              <p className="text-sm md:text-lg">{application_email}</p>
            </div>
            <div className="flex w-full justify-start gap-4 items-center">
              <PhoneIcon width={30} />
              <p className="text-lg">{application_phone}</p>
            </div>
          </div>

          {/* divs for mobile */}
          <div className="flex flex-col sm:hidden gap-3 px-2">
            <div className="flex w-full justify-start gap-4 items-center">
              <EmailIcon width={20} />
              <p className="text-sm md:text-lg overflow-scroll">
                {application_email}
              </p>
            </div>
            <div className="flex w-full justify-start gap-4 items-center">
              <PhoneIcon width={20} />
              <p className="text-sm md:text-lg">{application_phone}</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="flex flex-col gap-3">
            <AccordionItem
              value="1"
              className="border px-2 sm:px-4 rounded-sm "
            >
              <AccordionTrigger className="w-full justify-between text-sm sm:text-lg text-primary">
                <p>Inventory</p>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-left">{inventory}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2" className="border px-2 sm:px-4 rounded-sm">
              <AccordionTrigger className="w-full justify-between text-sm sm:text-lg text-primary">
                <p>Comments</p>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-left">{comments}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {application_status === "PENDING" && (
          <Pending vendorData={vendorData} eventData={eventData} />
        )}
      </div>
    </DialogContent>
  );
}
