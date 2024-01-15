import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import format from "date-fns/format";

export default function SalesDateFiltering() {
  const today = new Date();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace, refresh } = useRouter();

  const updateUrlParams = (from: Date, until: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set("from", format(from, "yyyy-MM-dd"));
    params.set("until", format(until, "yyyy-MM-dd"));
    replace(`${pathname}?${params.toString()}`);
    refresh();
  };

  const handleThisWeek = () => {
    const beginningOfWeek = new Date(today);
    const endOfWeek = new Date(today);
    const daysUntilSunday = 6 - today.getDay();
    endOfWeek.setDate(today.getDate() + daysUntilSunday + 1);
    beginningOfWeek.setDate(today.getDate() - today.getDay() + 1);
    updateUrlParams(beginningOfWeek, endOfWeek);
  };

  const handleThisMonth = () => {
    const beginngingOfMonth = new Date(today.getFullYear(), today.getMonth());
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    updateUrlParams(beginngingOfMonth, endOfMonth);
  };

  const handleLastWeek = () => {
    const beginningOfLastWeek = new Date(today);
    const endOfLastWeek = new Date(today);
    const daysUntilSunday = 6 - today.getDay();
    beginningOfLastWeek.setDate(today.getDate() - today.getDay() - 6);
    endOfLastWeek.setDate(today.getDate() - 6 + daysUntilSunday);
    updateUrlParams(beginningOfLastWeek, endOfLastWeek);
  };

  const handleAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("from");
    params.delete("until");
    replace(`${pathname}?${params.toString()}`);
    refresh();
  };

  const handleSelect = (value: string) => {
    switch (value) {
      case "all-time":
        handleAll();
        break;
      case "this-week":
        handleThisWeek();
        break;
      case "this-month":
        handleThisMonth();
        break;
      case "last-week":
        handleLastWeek();
        break;
      default:
        return;
    }
  };

  return (
    <Select onValueChange={(value) => handleSelect(value)}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="All Time" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all-time">All Time</SelectItem>
        <SelectItem value="this-week">This Week</SelectItem>
        <SelectItem value="this-month">This Month</SelectItem>
        <SelectItem value="last-week">Last Week</SelectItem>
      </SelectContent>
    </Select>
  );
}
