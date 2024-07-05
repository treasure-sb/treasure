import { DataTable } from "./table/DataTable";
import { TempVendor, columns } from "./table/Columns";
import { EventDisplayData } from "@/types/event";

export default function TempVendors({ event }: { event: EventDisplayData }) {
  return (
    <div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          Temporary Vendors <span className="text-muted-foreground">0</span>
        </h2>
      </div>
      <DataTable columns={columns} data={[]} event={event} />
    </div>
  );
}
