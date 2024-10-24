import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useTables } from "../query";
import Link from "next/link";

export default function Tables() {
  return (
    <Link
      className="border p-6 rounded-3xl my-4 sm:my-0 sm:hover:opacity-70 transition duration-500 overflow-hidden"
      href="/vendor/tables"
    >
      <h1 className="text-2xl font-semibold text-left mb-6">Tables</h1>
    </Link>
  );
}
