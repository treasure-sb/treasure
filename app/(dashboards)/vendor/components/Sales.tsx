import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../../query";
import TransactionCard from "@/app/(dashboards)/vendor/sales/components/TransactionCard";
import Link from "next/link";

export default function Sales() {
  return (
    <Link
      className="border p-6 rounded-3xl my-4 sm:my-0 sm:hover:opacity-70 transition duration-500 overflow-hidden"
      href="/vendor/sales"
    >
      <h1 className="text-2xl font-semibold text-left mb-6">Sales</h1>
    </Link>
  );
}
