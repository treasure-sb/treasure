import { Column } from "@react-email/components";

export default function ColumnLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Column className="text-left text-foreground/50">{children}</Column>;
}
