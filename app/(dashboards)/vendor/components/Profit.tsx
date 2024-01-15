import { useUser } from "../../query";

export default function Profit() {
  const user = useUser();

  return (
    <div className="bg-primary text-black border-[1px] p-6 rounded-3xl my-4 md:my-0">
      <h1 className="text-2xl font-semibold text-left mb-6">Profit</h1>
    </div>
  );
}
