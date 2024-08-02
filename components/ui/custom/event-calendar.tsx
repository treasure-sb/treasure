import { cn } from "@/lib/utils";

export const months: { [key: number]: string } = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEP",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};

export default function EventCalendar({
  month,
  days,
}: {
  month: number;
  days: number[];
}) {
  const isMultiDay = days.length > 1;

  return (
    <div
      className={cn(
        "border-[1px] border-foreground/30 text-foreground/60 rounded-sm text-center",
        isMultiDay ? "w-12 pb-2" : "w-10"
      )}
    >
      <p className="border-b-[1px] border-foreground/30 px-2 text-xxs">
        {months[month]}
      </p>
      <p className="px-2 mx-auto text-md">
        {isMultiDay ? (
          <span className="text-[0.58rem]">{days.length} days</span>
        ) : (
          days[0]
        )}
      </p>
    </div>
  );
}
