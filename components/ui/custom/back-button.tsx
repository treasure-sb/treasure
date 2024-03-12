import { MoveLeftIcon } from "lucide-react";

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex space-x-2 mb-4 hover:cursor-pointer w-fit"
    >
      <MoveLeftIcon className="stroke-1" />
      <span>Back</span>
    </div>
  );
}
