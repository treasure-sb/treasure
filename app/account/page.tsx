"use client";
import { createClient } from "@/utils/supabase/client";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
import { useRouter } from "next/navigation";
const supabase = createClient();

export default function Page() {
  const router = useRouter();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      router.push("/");
      router.refresh();
    }
  });
console.log("hello")
  return (
    <main className="p-10 max-w-lg m-auto w-full">
      <Auth
        theme="dark"
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
      />
    </main>
  );
}
