import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";

export default async function VendorTables({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await validateUser();
  const user = userData.user;

  let applicantData = null;
  if (user) {
    const { data, error } = await supabase
      .from("vendor_applications")
      .select("*")
      .eq("event_id", event.id)
      .eq("vendor_id", user.id)
      .single();
    applicantData = data;
  }

  const handleApply = async () => {
    "use server";
    const {
      data: { user },
    } = await validateUser();
    if (!user) {
      redirect("/signup");
    }

    const supabase = await createSupabaseServerClient();
    const { data: applicationData, error } = await supabase
      .from("vendor_applications")
      .insert([
        {
          event_id: event.id,
          vendor_id: user.id,
        },
      ]);
    if (!error) {
      redirect("/profile/events");
    }
  };

  return (
    <>
      <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-5 font-bold">
        <h1 className="text-lg">Tables from $80</h1>
        {applicantData ? (
          <Button
            disabled
            className="w-24 h-[70%] rounded-md text-background text-md font-bold bg-tertiary hover:bg-tertiary"
          >
            Applied!
          </Button>
        ) : (
          <form className="h-[70%]" action={handleApply}>
            <Button className="h-full w-24 rounded-md text-background text-md font-bold">
              Apply Now
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
