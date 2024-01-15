import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-6xl m-auto flex flex-col items-center space-y-6">
      <h1 className="text-center text-xl">Thanks for purchasing a table!</h1>
      <Link href="/vendor/tables">
        <Button className="m-auto">View Tables</Button>
      </Link>
    </main>
  );
}
