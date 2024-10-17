import Link from "next/link";
import {
  UsersIcon,
  BadgeDollarSign,
  Star,
  MessageCircle,
  AppWindowIcon,
} from "lucide-react";

export default async function Page() {
  return (
    <div className="lg:grid grid-cols-5 gap-4 flex flex-col">
      <Link
        href={`/admin/invoices`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Invoices
          </h3>
          <UsersIcon size={28} className="flex-shrink-0" />
        </div>
      </Link>
      <Link
        href={`/admin/likes`}
        className="bg-secondary rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Likes
          </h3>
          <BadgeDollarSign size={28} className="flex-shrink-0" />
        </div>
      </Link>
      <Link
        href={`/admin/promo`}
        className="bg-secondary rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Promo
          </h3>
          <BadgeDollarSign size={28} className="flex-shrink-0" />
        </div>
      </Link>
    </div>
  );
}
