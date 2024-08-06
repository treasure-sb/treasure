"use client";
import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Attendee } from "./AttendeeDataColumns";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import AttendeeDialogContent from "../attendee_dialog/AttendeeDialogContent";
import Filters from "./Filters";
import { EventWithDates } from "@/types/event";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  event: EventWithDates;
  tickets: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  event,
  tickets,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const showAttendeeDialog = (row: Row<TData>) => {
    setSelectedAttendee(row.original as Attendee);
    setOpen(true);
  };

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

  const ticketFilter = table.getColumn("ticketNames")?.getFilterValue();
  const updateTicketFilter = (type: string | undefined) => {
    table.getColumn("ticketNames")?.setFilterValue(type);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Filters
          ticketNames={tickets}
          ticketFilter={ticketFilter}
          updateTicketFilter={updateTicketFilter}
        />
      </div>
      <div className="rounded-md border">
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
                    showAttendeeDialog(row);
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
          if (!isOpen) setSelectedAttendee(null);
          setOpen(isOpen);
        }}
      >
        {selectedAttendee && (
          <AttendeeDialogContent
            attendeeData={selectedAttendee}
            event={event}
          />
        )}
      </Dialog>
    </div>
  );
}
