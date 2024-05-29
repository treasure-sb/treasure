"use server";

import { roundPrice } from "@/lib/utils";
import createSupabaseServerClient from "@/utils/supabase/server";

type FormTable = {
  section_name: string;
  price: string;
  quantity: string;
  table_provided: boolean;
  space_allocated: string;
  event_id?: string;
  id?: string;
};

const createTables = async (tables: FormTable[]) => {
  const supabase = await createSupabaseServerClient();
  const roundedTables = tables.map((table) => ({
    ...table,
    price: roundPrice(table.price),
  }));
  const { error } = await supabase.from("tables").insert(roundedTables);
  return { error };
};

const updateTables = async (tables: FormTable[]) => {
  const supabase = await createSupabaseServerClient();
  for (const table of tables) {
    const { error } = await supabase
      .from("tables")
      .update({
        price: roundPrice(table.price),
        quantity: table.quantity,
        section_name: table.section_name,
        space_allocated: table.space_allocated,
        table_provided: table.table_provided,
      })
      .eq("id", table.id);

    if (error) {
      return { error };
    }
  }
  return { error: null };
};

export { createTables, updateTables, type FormTable };
