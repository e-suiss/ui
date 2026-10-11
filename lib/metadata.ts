import type { Metadata } from "next";

import { getDictionary, type Locale, localePath, locales } from "@/lib/i18n";
import { localeUrl, site } from "@/lib/site";

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image: string;
}): Metadata {
  const dictionary = getDictionary(locale);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        ...Object.fromEntries(locales.map((code) => [code, localeUrl(code, path)])),
        "x-default": localeUrl("en", path),
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: dictionary.ogLocale,
      alternateLocale: locales.filter((code) => code !== locale).map((code) => getDictionary(code).ogLocale),
      url: localePath(locale, path),
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
