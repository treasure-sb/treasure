"use client";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button } from "@/components/ui/button";
import ExportIcon from "@/components/icons/ExportIcon";

export default function ExportButton({
  soldTicketsData,
}: {
  soldTicketsData: any[];
}) {
  const exporting = () => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    let exportData = [
      { name: "", ticket: "", number_of_tickets: "", contact: "" },
    ];

    let userArr: string[] = [];

    console.log(soldTicketsData);

    soldTicketsData.map((ticket: any, i: number) => {
      if (i === 0) {
        exportData[0] = {
          name: ticket.user_info.first_name + " " + ticket.user_info.last_name,
          ticket: ticket.ticket_info.name,
          number_of_tickets: "1",
          contact:
            (ticket.user_info.phone === null
              ? ""
              : ticket.user_info.phone.toString()) +
            " " +
            (ticket.user_info.email === null ? "" : ticket.user_info.email),
        };
        userArr.push(ticket.user_info.id);
      } else {
        let user = userArr.indexOf(ticket.user_info.id);
        if (user >= 0) {
          exportData[user].number_of_tickets = (
            parseInt(exportData[user].number_of_tickets) + 1
          ).toString();
        } else {
          exportData.push({
            name:
              ticket.user_info.first_name + " " + ticket.user_info.last_name,
            ticket: ticket.ticket_info.name,
            number_of_tickets: "1",
            contact:
              (ticket.user_info.phone === null
                ? ""
                : ticket.user_info.phone.toString()) +
              " " +
              (ticket.user_info.email === null ? "" : ticket.user_info.email),
          });
          userArr.push(ticket.user_info.id);
        }
      }
    });

    // Converts your Array<Object> to a CsvOutput string based on the configs
    const csv = generateCsv(csvConfig)(exportData);

    download(csvConfig)(csv);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Event Vendors</h1>
        {soldTicketsData && soldTicketsData.length > 0 && (
          <Button
            onClick={exporting}
            variant={"outline"}
            className="flex gap-2"
          >
            <ExportIcon />
            Export
          </Button>
        )}
      </div>
    </>
  );
}