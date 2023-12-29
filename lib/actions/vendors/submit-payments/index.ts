"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { vendorTransactionForm } from "@/types/profile";

const submitPayment = async (values: vendorTransactionForm, route: string) => {
  const supabase = await createSupabaseServerClient();

  const { data: del, error: deleteError } = await supabase
    .from("vendor_transactions")
    .insert([values]);

  redirect("/" + route);
};

export { submitPayment };
