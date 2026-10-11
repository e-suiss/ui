import { execFileSync } from "node:child_process";
import path from "node:path";
import type { MetadataRoute } from "next";

import { absolute } from "@/lib/site";
import { source } from "@/lib/source";

function lastModified(file: string) {
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { encoding: "utf8" }).trim();
    return date ? new Date(date) : undefined;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => {
    const depth = page.slugs.length;
    return {
      url: absolute(page.url),
      lastModified: lastModified(path.join("content/docs", page.path)),
      changeFrequency: "weekly" as const,
      priority: depth === 0 ? 0.9 : depth === 1 ? 0.8 : 0.6,
    };
  });
  return [{ url: absolute("/"), changeFrequency: "weekly", priority: 1 }, ...pages];
}
