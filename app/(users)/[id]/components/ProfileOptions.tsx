import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function ProfileOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings className="w-8 h-8 hover:cursor-pointer stroke-1 mr-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 mr-4">
        <DropdownMenuItem asChild>
          <Link href="/profile/edit-profile">Edit Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/portfolio" className="">
            Edit Photos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">Settings</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
