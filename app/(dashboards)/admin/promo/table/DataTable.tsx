"use client";

import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import { Dialog } from "@/components/ui/dialog";
import Filters from "./Filters";
import AddPromoButton from "./AddPromoButton";
import EditPromoDialogContent from "../promo_dialog/EditPromoDialogContent";
import { PromoCode } from "./PromoDataColumns";
import { EventWithDates } from "@/types/event";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [promoClicked, setPromoClicked] = useState<PromoCode | null>(null);
  const [open, setOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  const typeFilter = table.getColumn("discount")?.getFilterValue();
  const updateTypeFilter = (type: string | undefined) => {
    table.getColumn("discount")?.setFilterValue(type);
  };

  const statusFilter = table.getColumn("status")?.getFilterValue();
  const updateStatusFilter = (status: string | undefined) => {
    table.getColumn("status")?.setFilterValue(status);
  };

  const showPromoInfo = (row: Row<TData>) => {
    setPromoClicked(row.original as PromoCode);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <Filters
          typeFilter={typeFilter}
          updateTypeFilter={updateTypeFilter}
          statusFilter={statusFilter}
          updateStatusFilter={updateStatusFilter}
        />
        <AddPromoButton />
      </div>
      <div className="rounded-md border w-full mx-auto">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    showPromoInfo(row);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No results.
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

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPromoClicked(null);
          setOpen(isOpen);
        }}
      >
        {promoClicked && (
          <EditPromoDialogContent
            promoCode={promoClicked}
            closeDialog={() => setOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
}
