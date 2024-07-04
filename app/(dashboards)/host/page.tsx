import Link from "next/link";
import { Calendar } from "lucide-react";

export default async function Page() {
  return (
    <div className="lg:grid grid-cols-5 gap-4 flex flex-col">
      <Link
        href={`/host/events`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            My Events
          </h3>
          <Calendar className="stroke-2" size={28} />
        </div>
      </Link>
    </div>
  );
}
