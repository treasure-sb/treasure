import { Tables } from "@/types/supabase";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AttendeesOptions({
  event,
}: {
  event: Tables<"events">;
}) {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Attendees Options</AccordionTrigger>
      <AccordionContent className="flex flex-col space-y-4 items-center">
        <Link
          className="w-[90%]"
          href={`/profile/events/organizer/${event.cleaned_name}/message`}
        >
          <Button className="w-full" variant={"ghost"}>
            Message Guests
          </Button>
        </Link>
        <Link className="w-[90%]" href="">
          <Button className="w-full" variant={"ghost"}>
            Guest List
          </Button>
        </Link>
        <Link
          className=" w-[90%] relative"
          href={`/profile/events/organizer/${event.cleaned_name}/vendor-list`}
        >
          <Button className="w-full" variant={"ghost"}>
            Vendor List
          </Button>
          <span className="absolute top-[-2px] right-[-2px] flex h-3 w-3">
            <span className="animate-ping absolute h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative rounded-full h-3 w-3 bg-red-600"></span>
          </span>
        </Link>
      </AccordionContent>
    </AccordionItem>
  );
}
