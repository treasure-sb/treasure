import TagFiltering from "./components/filtering/TagFiltering";
import FilteringOptions from "./components/filtering/FilteringOptions";
import Events from "./components/Events";
import { SearchParams } from "@/types/event";
import { Metadata } from "next";
import { cityMap } from "@/lib/helpers/cities";
import { capitalize } from "@/lib/utils";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Events",
  description: "Popular Events",
};

export default function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const tag = searchParams?.tag || null;
  const city = searchParams?.city || null;
  const distance = searchParams?.distance || 50;

  let location = "United States";
  if (city && !cityMap[city]) {
    const splitCity = city.split("-");
    const stateName = splitCity[splitCity.length - 1];
    const cityName = splitCity
      .slice(0, splitCity.length - 1)
      .map((term) => capitalize(term))
      .join(" ");
    location = `${cityName}, ${stateName.toUpperCase()}`;
  } else if (city) {
    location = cityMap[city].label;
  }

  return (
    <main className="max-w-full md:max-w-7xl m-auto">
      <Suspense>
        <FilteringOptions />
        <TagFiltering />
      </Suspense>
      <div className="my-4">
        {tag ? (
          <h1 className="font-semibold text-2xl">Popular {tag} Events</h1>
        ) : (
          <h1 className="font-semibold text-2xl">Popular Events</h1>
        )}
        {city && (
          <h3 className="font-semibold text-muted-foreground text-lg">
            <span className="italic mr-1">Within {distance} miles of </span>
            {location}
          </h3>
        )}
      </div>
      <Events searchParams={searchParams} />
    </main>
  );
}
