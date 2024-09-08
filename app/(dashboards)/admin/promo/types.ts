import { Tables } from "@/types/supabase";
import { z } from "zod";

type CustomerData = Tables<"profiles"> & {
  publicAvatarUrl: string;
};
type PromoType = "PERCENT" | "DOLLAR";
type Status = "ACTIVE" | "INACTIVE";

export const PromoFormSchema = z.object({
  event: z.string(),
  id: z.string().optional(),
  code: z
    .string()
    .min(2, {
      message: "Code must be at least 2 characters",
    })
    .max(50, {
      message: "Code must be at most 50 characters",
    }),
  discount: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) >= 0;
    },
    {
      message: "Discount be a number",
    }
  ),
  usageLimit: z
    .string()
    .refine(
      (num) => {
        return !isNaN(Number(num)) && Number(num) >= 0 && Number(num) % 1 === 0;
      },
      {
        message: "Usage limit must be a positive integer",
      }
    )
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  promoType: z.enum(["PERCENT", "DOLLAR"]),
});

export type { CustomerData, PromoType, Status };
