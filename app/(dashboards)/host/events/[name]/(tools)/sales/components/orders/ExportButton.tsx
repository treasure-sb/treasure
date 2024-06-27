"use client";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button } from "@/components/ui/button";
import { Order } from "./OrderDataColumns";
import ExportIcon from "@/components/icons/ExportIcon";

export default function ExportButton({
  salesData,
  eventName,
}: {
  salesData: Order[];
  eventName: string;
}) {
  const exporting = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "orders-" + eventName,
    });

    const exportData = salesData.map((item, i) => {
      const customer = item.customer;
      return {
        "Order ID": item.orderID.toString(),
        Type: item.type === "TICKET" ? "Ticket" : "Table",
        Quantity: item.quantity.toString(),
        "Customer Name": `${customer.first_name} ${customer.last_name}`,
        Email: customer.email || "N/A",
        Phone: customer.phone || "N/A",
        "Amount Paid": `$${item.amountPaid.toFixed(2)}`,
        "Purchase Date": item.purchaseDate.toLocaleDateString(),
      };
    });

    const csv = generateCsv(csvConfig)(exportData);
    download(csvConfig)(csv);
  };

  return (
    <>
      {salesData && salesData.length > 0 && (
        <Button onClick={exporting} variant={"dotted"}>
          <ExportIcon />
          <span>Export</span>
        </Button>
      )}
    </>
  );
}
