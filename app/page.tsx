import Link from "next/link";
import validateUser from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { data } = await validateUser();
  console.log(data);
  if (!data.user) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl">Treasure</h1>
        <Link href="/profile">My Profile</Link>
      </div>

      {/* Events */}
      <div>
        <h1>Popular Events</h1>
      </div>
    </main>
  );
}
