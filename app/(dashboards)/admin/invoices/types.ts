import { Tables } from "@/types/supabase";

type CustomerData = Tables<"profiles"> & {
  publicAvatarUrl: string;
};

export type { CustomerData };
