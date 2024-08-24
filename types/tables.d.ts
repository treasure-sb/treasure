import { Database } from "./supabase";

export type PurchaseTableResult =
  Database["public"]["Functions"]["purchase_table"]["Returns"][number];
