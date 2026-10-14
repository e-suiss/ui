import type { MetadataRoute } from "next";

import { contentDates } from "@/lib/dates";
import { absolute } from "@/lib/site";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => {
    const depth = page.slugs.length;
    return {
      url: absolute(page.url),
      lastModified: contentDates(page.path).modified,
      changeFrequency: "weekly" as const,
      priority: depth === 0 ? 0.9 : depth === 1 ? 0.8 : 0.6,
    };
  });
  return [{ url: absolute("/"), changeFrequency: "weekly", priority: 1 }, ...pages];
}
