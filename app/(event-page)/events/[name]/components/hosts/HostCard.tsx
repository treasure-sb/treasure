import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import { Host } from "./HostedBy";
import Link from "next/link";

export default function HostCard({ host }: { host: Host }) {
  return (
    <Link
      href={`/${host.username}${host.type === "HOST" ? "" : "?type=t"}`}
      className="flex space-x-4 items-center border-[1px] rounded-2xl w-full md:w-[28rem] p-4 pr-10 relative group bg-slate-500/5 group-hover:bg-slate-10 hover:bg-slate transition duration-300"
    >
      <Avatar className="h-24 md:h-28 w-24 md:w-28">
        <AvatarImage src={host.publicUrl} />
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col space-y-2">
        <div>
          <p className="font-semibold text-lg md:text-xl">
            {host.businessName
              ? host.businessName
              : host.firstName + " " + host.lastName}
          </p>
          <p className="text-xs text-gray-500">@{host.username}</p>
        </div>
      </div>
      <ArrowUpRight
        size={18}
        className="stroke-2 absolute right-3 top-3 text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 group-hover:text-foreground"
      />
    </Link>
  );
}
