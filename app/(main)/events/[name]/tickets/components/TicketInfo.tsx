import { TicketIcon } from "lucide-react";

interface TicketInfoProps {
  type: string;
  price: number;
}

export const TicketInfo = ({ type, price }: TicketInfoProps) => {
  const isTicketFree = price === 0;
  return (
    <div className="flex space-x-4 text-background">
      <TicketIcon className="stroke-2 text-background" />
      <div className="flex">
        <p>{type}</p>{" "}
        <p className="ml-2 font-bold">
          {isTicketFree ? "Free" : `$${price.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
};
