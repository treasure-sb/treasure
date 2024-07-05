import { DataTable } from "./table/DataTable";
import { TempVendor, columns } from "./table/Columns";

export default function TempVendors() {
  return (
    <div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          Temporary Vendors <span className="text-muted-foreground">0</span>
        </h2>
      </div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
}
