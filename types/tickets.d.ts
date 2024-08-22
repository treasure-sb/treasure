import { Database } from "./supabase";

export type PurchaseTicketResult =
  Database["public"]["Functions"]["purchase_tickets"]["Returns"][number];
