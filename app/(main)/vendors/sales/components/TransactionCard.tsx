"use client";
import CashappIcon from "@/components/icons/applications/CashappIcon";
import VenmoIcon from "@/components/icons/applications/VenmoIcon";
import CashIcon from "@/components/icons/CashIcon";

export default function TransactionCard({
  transaction,
  formattedDate,
}: {
  transaction: any;
  formattedDate: string;
}) {
  return (
    <div className="group w-full overflow-hidden">
      <div className="flex space-x-4">
        {(() => {
          switch (transaction.method) {
            case "Cashapp":
              return <CashappIcon />;
            case "Venmo":
              return <VenmoIcon />;
            default:
              return <CashIcon />;
          }
        })()}
        <div className="flex flex-col align-middle w-full my-auto">
          <div className="text-base">
            {transaction.item_name.length > 0
              ? transaction.item_name
              : "No Comment"}
          </div>
          <div className="text-gray-400 text-sm">
            {formattedDate + " • " + transaction.method}
          </div>
        </div>
        <div className="text-base whitespace-nowrap my-auto">
          {"+ $" + transaction.amount}
        </div>
      </div>
    </div>
  );
}
