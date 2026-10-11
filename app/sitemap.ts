import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { products } from "@/lib/products";
import { localeUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...products.map((product) => `/${product.slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((code) => [code, localeUrl(code, path)])) },
    })),
  );
}
