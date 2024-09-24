import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../../schema";

export default function TicketsPreview() {
  const { getValues } = useFormContext<CreateEvent>();
  const tickets = getValues("tickets");

  const minimumTicketPrice = tickets.reduce((acc, ticket) => {
    return Math.min(acc, parseFloat(ticket.price));
  }, Infinity);

  const isTicketFree = minimumTicketPrice === 0;

  return (
    <div className="w-full rounded-md items-center flex justify-between font-semibold space-x-4">
      <div className={isTicketFree ? "" : "flex flex-col sm:flex-row sm:gap-1"}>
        <p className="text-lg">
          {isTicketFree ? "Tickets FREE" : "Tickets from"}
        </p>
        {!isTicketFree && (
          <p className="text-lg">${minimumTicketPrice.toFixed(2)}</p>
        )}
      </div>
      <Button className="border-primary w-32 rounded-full">
        {isTicketFree ? "RSVP" : "Buy Now"}
      </Button>
    </div>
  );
}
