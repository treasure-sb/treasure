import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StyledCardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function CreateEventCard({
  title,
  children,
  footer,
  className,
}: StyledCardProps) {
  return (
    <Card
      className={cn(
        "border-2 border-primary p-0 bg-[#80A193] bg-opacity-20 w-full max-w-2xl",
        className
      )}
    >
      {title && (
        <CardHeader className="p-4">
          <CardDescription className="text-base font-semibold text-foreground">
            {title}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="p-4 pt-0">{children}</CardContent>
      {footer && <CardFooter className="p-4">{footer}</CardFooter>}
    </Card>
  );
}
