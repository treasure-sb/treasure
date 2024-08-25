import { TicketIcon } from "lucide-react";

interface TicketInfoProps {
  type: string;
  price: number;
}

export const TicketInfo = ({ type, price }: TicketInfoProps) => {
  const isTicketFree = price === 0;
  return (
    <div className="flex space-x-4 dark:text-background">
      <TicketIcon className="stroke-2 dark:text-background" />
      <div className="flex font-bold">
        <p>{type}</p>{" "}
        <p className="ml-2">{isTicketFree ? "Free" : `$${price.toFixed(2)}`}</p>
      </div>
    </div>
  );
};
