import { EditIcon } from "lucide-react";
import Link from "next/link";

export default function AdminEditButton({ username }: { username: string }) {
  return (
    <div className="fixed right-6 bottom-6 flex flex-col space-y-4 items-end z-20">
      <Link href={`/${username}/admin/edit`}>
        <div className="opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300 bg-primary p-6 rounded-full">
          <EditIcon size={28} />
        </div>
      </Link>
    </div>
  );
}
