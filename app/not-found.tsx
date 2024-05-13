import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid h-screen place-content-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-200 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-400">We can't find that page.</p>

        <Link href="/home" className="w-fit mt-6 inline-block">
          <Button className="p-6 rounded-md">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
