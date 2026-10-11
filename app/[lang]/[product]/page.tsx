import { cn } from "cn";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Anchor } from "@/components/anchor";
import { Arrow, ease, Label } from "@/components/arrow";
import { JsonLd } from "@/components/json-ld";
import { getDictionary, isLocale, localePath, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getProduct, products } from "@/lib/products";
import { absolute, localeUrl, site } from "@/lib/site";

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10";

export function generateStaticParams() {
  return locales.flatMap((lang) => products.map((product) => ({ lang, product: product.slug })));
}

async function resolve(params: PageProps<"/[lang]/[product]">["params"]) {
  const { lang, product: slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(lang) || !product) notFound();
  return { locale: lang, product, dictionary: getDictionary(lang) };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[product]">): Promise<Metadata> {
  const { locale, product } = await resolve(params);
  return pageMetadata({
    locale,
    path: `/${product.slug}`,
    title: `${site.name} ${product.name} – ${product.category[locale]}`,
    description: product.summary[locale],
    image: `/og/${locale}/${product.slug}/image.png`,
  });
}

export default async function ProductPage({ params }: PageProps<"/[lang]/[product]">) {
  const { locale, product, dictionary } = await resolve(params);
  const index = products.indexOf(product);
  const next = products[(index + 1) % products.length];
  const related = product.related.map((slug) => getProduct(slug)).filter((item) => item !== undefined);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${localeUrl(locale, `/${product.slug}`)}#product`,
        name: `${site.name} ${product.name}`,
        description: product.summary[locale],
        applicationCategory: product.category.en,
        url: localeUrl(locale, `/${product.slug}`),
        image: absolute(product.image),
        inLanguage: locale,
        publisher: { "@id": absolute("/#organization") },
        featureList: [...product.groups.flatMap((group) => group.items[locale]), ...product.agent[locale]],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: localeUrl(locale, "/") },
          { "@type": "ListItem", position: 2, name: product.name, item: localeUrl(locale, `/${product.slug}`) },
        ],
      },
    ],
  };

  return (
    <main>
      <JsonLd data={structuredData} />
      <section className="relative flex flex-col justify-end overflow-hidden bg-black text-white">
        <Image src={product.image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <div className={cn(frame, "relative flex flex-col gap-8 pt-56 pb-12 md:pt-[24rem] md:pb-16")}>
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-[0.02em] uppercase">
            <span>
              ({String(index + 1).padStart(2, "0")}) {product.category[locale]}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-xl">{dictionary.inDevelopment}</span>
          </div>
          <h1 className="text-[clamp(5rem,16vw,16rem)] leading-[0.82] font-semibold tracking-[-0.065em]">{product.name}</h1>
          <p className="max-w-3xl text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.045em] text-balance">
            {product.tagline[locale]}
          </p>
        </div>
      </section>

      <section className={cn(frame, "grid gap-10 py-24 md:grid-cols-[1fr_3fr] md:py-36")}>
        <Label index="01">{product.verb[locale]}</Label>
        <p className="text-[clamp(1.75rem,3.6vw,3.75rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-balance">
          {product.summary[locale]}
        </p>
      </section>

      <section className="dark bg-surface text-label">
        <div className={cn(frame, "grid gap-10 py-24 md:grid-cols-[1fr_3fr] md:py-36")}>
          <Label index="02">{dictionary.questionLabel}</Label>
          <blockquote className="text-[clamp(2.5rem,6vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.055em] text-balance">
            “{product.question[locale]}”
          </blockquote>
        </div>
      </section>

      <section className={cn(frame, "py-24 md:py-36")}>
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]">
          <Label index="03">{dictionary.capabilitiesLabel}</Label>
        </div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-[1fr_3fr]">
          <div />
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {product.groups.map((group) => (
              <div key={group.title.en} className="flex flex-col gap-5 border-t border-label/15 pt-6">
                <h2 className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none font-semibold tracking-[-0.045em]">
                  {group.title[locale]}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {group.items[locale].map((item) => (
                    <li key={item} className="text-[17px] leading-[1.4] tracking-[-0.02em] text-label-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={cn(frame, "pb-24 md:pb-36")}>
        <div className="relative overflow-hidden rounded-[28px] bg-black text-white">
          <Image src={product.image} alt="" fill sizes="100vw" className="object-cover opacity-60 blur-2xl scale-110" />
          <div className="relative grid gap-10 p-6 py-16 md:grid-cols-[1fr_3fr] md:p-10 md:py-24">
            <p className="font-mono text-xs tracking-[0.02em] text-white/75 uppercase">(04) {dictionary.agentLabel}</p>
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {product.agent[locale].map((item) => (
                <li
                  key={item}
                  className="border-t border-white/20 py-5 text-[clamp(1.375rem,2vw,2rem)] leading-[1.1] font-semibold tracking-[-0.04em]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={cn(frame, "pb-24 md:pb-36")}>
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_3fr]">
          <Label index="05">{dictionary.worksWithLabel}</Label>
        </div>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {related.map((item) => (
            <Anchor
              key={item.slug}
              href={localePath(locale, `/${item.slug}`)}
              className="group relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[24px] bg-black p-6 text-white outline-none focus-visible:focus-ring"
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className={cn("object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]", ease)}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              <span className="relative font-mono text-xs tracking-[0.02em] uppercase">{item.category[locale]}</span>
              <span className="relative flex items-end justify-between gap-4">
                <span className="text-[clamp(2.5rem,4vw,4rem)] leading-[0.9] font-semibold tracking-[-0.055em]">{item.name}</span>
                <Arrow className="border-white/30 group-hover:bg-white group-hover:text-black" />
              </span>
            </Anchor>
          ))}
        </div>
      </section>

      <nav aria-label={dictionary.nextProduct} className={cn(frame, "pb-24 md:pb-36")}>
        <Anchor
          href={localePath(locale, `/${next.slug}`)}
          className="group flex items-center justify-between gap-6 border-y border-label/15 py-8 outline-none focus-visible:focus-ring md:py-12"
        >
          <span className="flex flex-col gap-3">
            <span className="font-mono text-xs tracking-[0.02em] text-label-tertiary uppercase">{dictionary.nextProduct}</span>
            <span
              className={cn(
                "text-[clamp(3rem,8vw,8rem)] leading-[0.85] font-semibold tracking-[-0.06em] transition-transform duration-700 group-hover:translate-x-3",
                ease,
              )}
            >
              {next.name}
            </span>
          </span>
          <Arrow className="size-16 md:size-20" />
        </Anchor>
      </nav>
    </main>
  );
}
