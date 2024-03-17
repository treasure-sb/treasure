"use client";

import { Tables } from "@/types/supabase";

export default function TablesInfo({ tables }: { tables: Tables<"tables">[] }) {
  return (
    <div className="flex flex-col gap-10">
      {tables.length > 0 ? (
        tables?.map((table) => (
          <div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">section name :</p>
              <p className="font-semibold text-primary">
                {" "}
                {table.section_name}
              </p>
            </div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">price :</p>
              <p className="font-semibold text-primary"> ${table.price}</p>
            </div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">quantity :</p>
              <p className="font-semibold text-primary">{table.quantity}</p>
            </div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">tables provided?</p>
              <p className="font-semibold text-primary">
                {table.table_provided ? "Yes" : "No"}
              </p>
            </div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">space allocated :</p>
              <p className="font-semibold text-primary">
                {table.space_allocated}ft
              </p>
            </div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52"># vendors allowed :</p>
              <p className="font-semibold text-primary">
                {table.number_vendors_allowed}
              </p>
            </div>
          </div>
        ))
      ) : (
        <>No Tables</>
      )}
    </div>
  );
}
