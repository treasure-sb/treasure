import TagFiltering from "./components/filtering/TagFiltering";
import FilteringOptions from "./components/filtering/FilteringOptions";
import Events from "./components/Events";
import { SearchParams } from "@/types/event";

export default function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const tag = searchParams?.tag || null;

  return (
    <main className="max-w-full md:max-w-7xl m-auto">
      <FilteringOptions />
      <TagFiltering />
      <div className="my-4">
        {tag ? (
          <h1 className="font-semibold text-2xl">Popular {tag} Events</h1>
        ) : (
          <h1 className="font-semibold text-2xl">Popular Events</h1>
        )}
        <h2 className="font-bold text-gray-500">In New York, NY</h2>
      </div>
      <Events searchParams={searchParams} />
    </main>
  );
}
