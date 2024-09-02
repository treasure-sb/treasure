"use client";

import VendorDialogContent from "../vendor_dialog/VendorDialogContent";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  useReactTable,
  getSortedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  Table as T,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { EventDisplayData } from "@/types/event";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { VendorModalProps } from "../../TabState";
import { DownloadIcon } from "lucide-react";
import ExportIcon from "@/components/icons/ExportIcon";
import Filters from "./Filters";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  eventData: EventDisplayData;
  tags: string[];
  modalProps: VendorModalProps;
}

interface exportInfo {
  name: string;
  payment_status: string;
  assignment: string;
  number_of_tables: string;
  contact: string;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  eventData,
  tags,
  modalProps,
}: DataTableProps<TData, TValue>) {
  const { selectedVendor, open, setOpen, showVendorInfo } = modalProps;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  const applicationFilter = table
    .getColumn("application_status")
    ?.getFilterValue();
  const paymentFilter = table.getColumn("payment_status")?.getFilterValue();
  const tagFilter = table.getColumn("tags")?.getFilterValue() as string[];

  const updateApplicationFilter = (value: string | undefined) => {
    table.getColumn("application_status")?.setFilterValue(value);
  };

  const updatePaymentFilter = (value: string | undefined) => {
    table.getColumn("payment_status")?.setFilterValue(value);
  };

  const updateTagFilter = (value: string) => {
    const currentFilter =
      (table.getColumn("tags")?.getFilterValue() as string[]) || [];

    if (currentFilter.includes(value)) {
      const newFilter = currentFilter.filter((tag) => tag !== value);
      table.getColumn("tags")?.setFilterValue(newFilter);
    } else {
      const newFilter = [...currentFilter, value];
      table.getColumn("tags")?.setFilterValue(newFilter);
    }
  };

  const resetTagFilter = () => {
    table.getColumn("tags")?.setFilterValue([]);
  };

  const exportFunction = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "vendors-" + eventData.cleaned_name,
    });

    let exportData = [
      {
        name: "",
        payment_status: "",
        assignment: "",
        number_of_tables: "",
        contact: "",
      },
    ];

    table.getRowModel().rows?.map((row, i) => {
      if (i === 0) {
        exportData[0] = {
          name: row.getValue("name"),
          payment_status: (row.getValue("vendor_info") as any).payment_status,
          assignment:
            (row.getValue("vendor_info") as any).assignment === null
              ? "none"
              : (row.getValue("vendor_info") as any).assignment,
          number_of_tables: (row.getValue("vendor_info") as any).table_quantity,
          contact:
            (row.getValue("vendor_info") as any).application_email +
            " , " +
            (row.getValue("vendor_info") as any).application_phone,
        };
      } else {
        let temp: exportInfo = {
          name: row.getValue("name"),
          payment_status: (row.getValue("vendor_info") as any).payment_status,
          assignment:
            (row.getValue("vendor_info") as any).assignment === null
              ? "none"
              : (row.getValue("vendor_info") as any).assignment,
          number_of_tables: (row.getValue("vendor_info") as any).table_quantity,
          contact:
            (row.getValue("vendor_info") as any).application_email +
            " , " +
            (row.getValue("vendor_info") as any).application_phone,
        };
        exportData.push(temp);
      }
    });

    // Converts your Array<Object> to a CsvOutput string based on the configs
    const csv = generateCsv(csvConfig)(exportData);

    download(csvConfig)(csv);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Filters
          paymentFilter={paymentFilter}
          applicationFilter={applicationFilter}
          tagFilter={tagFilter}
          updateApplicationFilter={updateApplicationFilter}
          updatePaymentFilter={updatePaymentFilter}
          updateTagFilter={updateTagFilter}
          resetTagFilter={resetTagFilter}
          tags={tags}
        />
        <Button
          onClick={exportFunction}
          variant={"dotted"}
          className="rounded-sm flex items-center space-x-2"
        >
          <DownloadIcon />
          <p>Export</p>
        </Button>
      </div>
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className="relative"
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    showVendorInfo &&
                    showVendorInfo(row.getValue("vendor_info"))
                  }
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No vendors.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant={"dotted"}
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant={"dotted"}
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        {selectedVendor && (
          <VendorDialogContent
            closeDialog={() => setOpen && setOpen(false)}
            vendorData={selectedVendor}
            eventData={eventData}
          />
        )}
      </Dialog>
    </div>
  );
}
