import { NonNullableExcept } from "@/lib/utils";
import { Database, Tables } from "./supabase";

export type PurchaseTableResult =
  Database["public"]["Functions"]["purchase_table"]["Returns"][number];

type DraftTable = Tables<"tables">;
type LiveTable = NonNullableExcept<Tables<"tables">, "additional_information">;
