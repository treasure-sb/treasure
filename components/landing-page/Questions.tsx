import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Questions() {
  return (
    <section className="space-y-12">
      <h1 className="text-3xl md:text-5xl font-semibold">
        Frequently asked <i>questions</i>
      </h1>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg text-left md:text-2xl py-6 md:py-8 decoration-primary">
            How do I create an event and accept payments?
          </AccordionTrigger>
          <AccordionContent>
            You can quickly create an event via our website. Once your event is
            created, you can add ticket options, table options, and guests.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg text-left md:text-2xl py-6 md:py-8 decoration-primary">
            How do I create an event and accept payments?
          </AccordionTrigger>
          <AccordionContent>
            You can quickly create an event via our website. Once your event is
            created, you can add ticket options, table options, and guests.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg text-left md:text-2xl py-6 md:py-8 decoration-primary">
            How do I create an event and accept payments?
          </AccordionTrigger>
          <AccordionContent>
            You can quickly create an event via our website. Once your event is
            created, you can add ticket options, table options, and guests.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-14">
          <AccordionTrigger className="text-lg text-left md:text-2xl py-6 md:py-8 decoration-primary">
            How do I create an event and accept payments?
          </AccordionTrigger>
          <AccordionContent>
            You can quickly create an event via our website. Once your event is
            created, you can add ticket options, table options, and guests.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
