import { MoveLeftIcon } from "lucide-react";
import { ArrowUpLeftIcon } from "lucide-react";

export default function BackButton({
  onClick,
  label,
}: {
  onClick?: () => void;
  label?: string;
}) {
  return (
    <div
      onClick={onClick}
      className="flex space-x-1 mb-4 hover:cursor-pointer w-fit group"
    >
      <ArrowUpLeftIcon className="stroke-1 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] transition duration-300" />
      <span>{label || "Back"}</span>
    </div>
  );
}
