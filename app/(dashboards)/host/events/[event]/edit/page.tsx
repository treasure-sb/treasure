import { validateUser } from "@/lib/actions/auth";
import createSupabaseServerClient from "@/utils/supabase/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PromoCodes from "./components/PromoCodes";
import { Tables } from "@/types/supabase";

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data: eventID } = await supabase
    .from("events")
    .select("id")
    .eq("cleaned_name", event)
    .single();

  const { data: codesData } = await supabase
    .from("event_codes")
    .select("*")
    .eq("event_id", eventID && eventID["id"]);

  const codes = codesData as Tables<"event_codes">[];
  return (
    <main>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg text-left md:text-2xl py-6 md:py-8 decoration-background">
            Promo Codes
          </AccordionTrigger>
          <AccordionContent className="text-base md:text-xl">
            <PromoCodes codes={codes} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
