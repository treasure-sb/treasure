import { getAllEventCleanedNames } from "@/lib/actions/events";

export default async function sitemap() {
  const baseUrl = "https://ontreasure.xyz";
  const { data } = await getAllEventCleanedNames();

  const generateEventUrls = (event: any) => [
    {
      url: `${baseUrl}/events/${event.cleaned_name}`,
      lastModified: event.created_at,
    },
    {
      url: `${baseUrl}/events/${event.cleaned_name}/tickets`,
      lastModified: event.created_at,
    },
    {
      url: `${baseUrl}/events/${event.cleaned_name}/tables`,
      lastModified: event.created_at,
    },
  ];

  const eventUrls = data?.flatMap(generateEventUrls) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date().toISOString(),
    },
    ...eventUrls,
  ];
}
