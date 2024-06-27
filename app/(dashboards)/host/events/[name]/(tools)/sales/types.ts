import { Tables } from "@/types/supabase";

type CustomerData = Tables<"profiles"> & {
  publicAvatarUrl: string;
};
type PromoType = "PERCENT" | "DOLLAR";
type Status = "ACTIVE" | "INACTIVE";

export type { CustomerData, PromoType, Status };
