import { NonNullableExcept } from "@/lib/utils";
import { Database, Tables } from "./supabase";

export type PurchaseTicketResult =
  Database["public"]["Functions"]["purchase_tickets"]["Returns"][number];

type DraftTicket = Tables<"tickets">;
type LiveTicket = NonNullableExcept<Tables<"tickets">, "description">;
