import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ontreasure.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/events"],
      disallow: [],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
