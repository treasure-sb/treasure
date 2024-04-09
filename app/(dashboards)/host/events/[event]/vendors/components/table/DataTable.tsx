"use client";

import VendorDialogContent from "../vendor_dialog/VendorDialogContent";
import { motion } from "framer-motion";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EventDisplayData } from "@/types/event";
import Filters from "./Filters";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  eventData: EventDisplayData;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  eventData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const showVendorInfo = (vendor_info: any, avatar_url: string | null) => {
    setSelectedVendor(vendor_info);
    setSelectedAvatar(avatar_url);
    setOpen(true);
  };

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

  const updateApplicationFilter = (value: string | undefined) => {
    table.getColumn("application_status")?.setFilterValue(value);
  };
  const updatePaymentFilter = (value: string | undefined) => {
    table.getColumn("payment_status")?.setFilterValue(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      <h1 className="text-2xl mb-4 font-semibold">Event Vendors</h1>
      <Filters
        paymentFilter={paymentFilter}
        applicationFilter={applicationFilter}
        updateApplicationFilter={updateApplicationFilter}
        updatePaymentFilter={updatePaymentFilter}
      />
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
              table.getRowModel().rows.map((row) => (
                <Dialog open={open} onOpenChange={setOpen}>
                  <TableRow
                    className="relative"
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() =>
                      showVendorInfo(
                        row.getValue("vendor_info"),
                        row.getValue("avatar_url")
                      )
                    }
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <TableCell key={cell.id} className="py-8">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <VendorDialogContent
                    vendorData={
                      selectedVendor
                        ? selectedVendor
                        : row.getValue("vendor_info")
                    }
                    avatarUrl={
                      selectedAvatar
                        ? selectedAvatar
                        : row.getValue("avatar_url")
                    }
                    eventData={eventData}
                  />
                </Dialog>
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
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
