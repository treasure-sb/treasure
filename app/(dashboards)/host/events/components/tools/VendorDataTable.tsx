import { columns } from "./VendorDataColumns";
import { useEventVendorsTableData } from "../../../query";
import DataTable from "./DataTable";

export default function VendorDataTable() {
  const vendorsTableData = useEventVendorsTableData();

  return (
    <div className="max-w-7xl mx-auto py-10">
      {vendorsTableData ? (
        <DataTable columns={columns} data={vendorsTableData} />
      ) : (
        <h1>You have no event vendors</h1>
      )}
    </div>
  );
}
