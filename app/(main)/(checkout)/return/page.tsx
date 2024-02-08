import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-6xl m-auto flex flex-col items-center space-y-6">
      <h1 className="text-center text-xl">Have fun at your event!</h1>
      <Link href="/events">
        <Button className="m-auto">Events</Button>
      </Link>
    </main>
  );
}
