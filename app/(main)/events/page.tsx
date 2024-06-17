import TagFiltering from "./components/filtering/TagFiltering";
import FilteringOptions from "./components/filtering/FilteringOptions";
import Events from "./components/Events";
import { SearchParams } from "@/types/event";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Popular Events Near New York",
};

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
        <h2 className="font-bold text-muted-foreground">Near New York, NY</h2>
      </div>
      <Events searchParams={searchParams} />
    </main>
  );
}
