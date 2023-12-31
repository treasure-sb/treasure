import { Heart } from "lucide-react";
import { CalendarCheck2Icon } from "lucide-react";
import { CrownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EventFilters({
  isLoggedInProfile,
}: {
  isLoggedInProfile?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [active, setActive] = useState(
    searchParams.get("events") || "Attending"
  );
  const { replace } = useRouter();

  const handleClick = (filter: string) => {
    if (filter === active) return;
    const params = new URLSearchParams(searchParams);

    if (filter === "Attending") {
      setActive("Attending");
      params.delete("events");
    } else {
      setActive(filter);
      params.set("events", filter);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const filterOptions = [
    { name: "Hosting", Icon: CrownIcon },
    { name: "Attending", Icon: CalendarCheck2Icon },
    { name: "Liked", Icon: Heart },
  ];

  const renderFilters = () => {
    return filterOptions.map(({ name, Icon }) => (
      <div
        onClick={() => handleClick(name)}
        key={name}
        className="relative w-[33%] hover:cursor-pointer"
      >
        <Icon
          className={`w-8 h-8 stroke-1 m-auto ${
            active === name ? "text-white" : ""
          }`}
        />
        {active === name && (
          <div className="absolute h-[1px] w-full bg-primary bottom-[-9px]" />
        )}
      </div>
    ));
  };

  return (
    <div className="w-full flex justify-between mt-4 text-secondary">
      {renderFilters()}
    </div>
  );
}
