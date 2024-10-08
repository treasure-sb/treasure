import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchIcon } from "lucide-react";
import Cancel from "@/components/icons/Cancel";

export default function SearchFiltering() {
  const [clickedSearch, setClickedSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  useEffect(() => {
    if (inputRef.current && clickedSearch) {
      inputRef.current.focus();
    }
  }, [clickedSearch]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCancel = () => {
    setClickedSearch(false);
    handleSearch("");
  };

  return clickedSearch || searchParams.get("search") ? (
    <div className="w-full flex space-x-1 items-center md:h-8">
      <Input
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full md:w-[50%]"
        placeholder="Search for Events"
        ref={inputRef}
      />
      <Cancel handleCancel={handleCancel} />
    </div>
  ) : (
    <Button
      onClick={() => setClickedSearch(true)}
      variant={"ghost"}
      className="rounded-full px-2"
    >
      <SearchIcon className="text-foreground" />
    </Button>
  );
}
