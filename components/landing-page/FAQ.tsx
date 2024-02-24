import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    id: "item-1",
    question: "How does Treasure help promote my event?",
    answer: `Creating a page on Treasure is the easiest way to highlight everything about your event via one-link without building an expensive website. Our pages beautifully showcase vendors, special guests, celebrities, giveaways, and tournaments for your convention. This makes it easy for customers and vendors to browse for your event on the largest directory of card shows and book their attendance in just a few clicks. Additionally, we will create professional Instagram and TikTok posts to market your event at no cost to you.`,
  },
  {
    id: "item-2",
    question: "How do I create my event?",
    answer: `Treasure is currently in beta and free to list for our early partners. To create your event, please fill out this form and we will reach out within 24 hours to confirm more details like guest lists, autograph opportunities, sponsors, ticket prices, table prices, and vendor terms. We will work with you one-on-one to highlight the best aspects of your event for growing your brand.`,
  },
  {
    id: "item-3",
    question: "How do vendors book events?",
    answer: `Vendors can apply via our event pages to request a spot at the convention. Hosts will be notified instantly via a text message and email. Hosts can then review the vendors’ personal information, items being vended, social media, and the type + quantity of tables requested using the attached link. Once approved, vendors will receive a payment link via text message and email, requesting payment within 24 hours to reserve their spot at the show. Easy, quick, and clear communication for all parties.`,
  },
  {
    id: "item-4",
    question: "How do attendees and vendors get tickets?",
    answer: `After paying for their admission or table on the event page, attendees and vendors will receive a text message and email containing their QR ticket link and receipt. Their ticket will also be attached via PDF in the email.`,
  },
  {
    id: "item-5",
    question: "How do payouts work?",
    answer: `Powered by Stripe, Treasure is able to process payments from Apple Pay and any credit card merchant. Once you sign up for Treasure, you’ll go through a simple onboarding flow with our event success team to select your preferred payout method (PayPal, Bank Account, or Cash/Check). Treasure gives you access to your capital as soon as you sell your first ticket or table. Choose to receive daily payouts or a total payout immediately after your event ends.`,
  },
];

export default function FAQ() {
  return (
    <section className="mx-[-16px]">
      <div className="bg-[url('/static/faq_layer_2.svg')] w-full aspect-w-[960] aspect-h-[540] bg-no-repeat bg-center bg-cover" />
      <div className="bg-primary text-background px-4">
        <div className="max-w-6xl xl:max-w-7xl m-auto space-y-8">
          <h1 className="text-3xl md:text-5xl font-semibold">
            Frequently asked <i>questions</i>
          </h1>
          <Accordion type="single" collapsible>
            {faqItems.map(({ id, question, answer }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger className="text-lg text-left md:text-2xl py-6 md:py-8 decoration-background">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-xl">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
