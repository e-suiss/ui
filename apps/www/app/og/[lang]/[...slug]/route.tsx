import { notFound } from "next/navigation";

import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { getProduct, products } from "@/lib/products";

export async function GET(_request: Request, context: RouteContext<"/og/[lang]/[...slug]">) {
  const { lang, slug } = await context.params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);
  const path = slug.slice(0, -1);

  if (path.length === 0) return ogImage({ title: dictionary.heroTitle, description: dictionary.heroSubtitle });

  const product = getProduct(path[0]);
  if (!product) notFound();
  return ogImage({ title: product.name, description: product.tagline[lang], eyebrow: product.category[lang] });
}

export function generateStaticParams() {
  return locales.flatMap((lang) => [
    { lang, slug: ["image.png"] },
    ...products.map((product) => ({ lang, slug: [product.slug, "image.png"] })),
  ]);
}
