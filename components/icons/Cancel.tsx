import { Button } from "@/components/ui/button";

export default function Cancel({ handleCancel }: { handleCancel: () => void }) {
  return (
    <Button className="p-2 h-6" variant={"ghost"} onClick={handleCancel}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        version="1.1"
        viewBox="200 150 800 1000"
        fill="red"
      >
        <g>
          <path d="m100 1125c-6.3984 0-12.801-2.4492-17.699-7.3008-9.75-9.75-9.75-25.602 0-35.352l1e3 -1e3c9.75-9.75 25.602-9.75 35.352 0s9.75 25.602 0 35.352l-1e3 1e3c-4.8516 4.8516-11.254 7.3008-17.652 7.3008z" />
          <path d="m1100 1125c-6.3984 0-12.801-2.4492-17.699-7.3008l-1e3 -1e3c-9.75-9.75-9.75-25.602 0-35.352s25.602-9.75 35.352 0l1e3 1e3c9.75 9.75 9.75 25.602 0 35.352-4.8516 4.8516-11.254 7.3008-17.652 7.3008z" />
        </g>
      </svg>
    </Button>
  );
}
