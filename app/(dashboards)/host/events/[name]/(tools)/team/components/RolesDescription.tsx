import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RolesDescription() {
  return (
    <Table className="w-fit mx-auto">
      <TableCaption>Event Roles Descriptions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Role</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Host</TableCell>
          <TableCell>Has admin privileges.</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Co-Host</TableCell>
          <TableCell>
            Has admin privileges except cannot delete event. Appears on the
            event page.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Staff</TableCell>
          <TableCell>
            Has admin priviles except cannot delete event. Does not appear on
            the event page.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Scanner</TableCell>
          <TableCell>Only has access to the Attendees event tool.</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
