import { PlusIcon } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import type * as React from "react"
import { Anchor } from "@/components/anchor"
import { Arrow, ease, Label } from "@/components/arrow"
import { JsonLd } from "@/components/json-ld"
import { dictionary } from "@/lib/dictionary"
import { pageMetadata } from "@/lib/metadata"
import { getProduct, type Product, products } from "@/lib/products"
import { absolute, site } from "@/lib/site"
import { cn } from "@/lib/utils"

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10"

export function generateStaticParams() {
  return products.map((product) => ({ product: product.slug }))
}

export const dynamicParams = false

async function resolve(params: PageProps<"/[product]">["params"]) {
  const { product: slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  return product
}

export async function generateMetadata({
  params,
}: PageProps<"/[product]">): Promise<Metadata> {
  const product = await resolve(params)
  return pageMetadata({
    path: `/${product.slug}`,
    title: `${site.name} ${product.name} – ${product.category}`,
    description: product.description,
    image: `/og/${product.slug}/image.png`,
  })
}

const statusLabel = (product: Product) =>
  product.status === "development"
    ? dictionary.inDevelopment
    : dictionary.planned

function Section({
  id,
  index,
  label,
  className,
  children,
}: {
  id?: string
  index: number
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        frame,
        "grid gap-10 py-24 md:grid-cols-[1fr_3fr] md:py-32",
        className
      )}
    >
      <Label index={String(index).padStart(2, "0")}>{label}</Label>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default async function ProductPage({ params }: PageProps<"/[product]">) {
  const product = await resolve(params)
  const position = products.indexOf(product)
  const next = products[(position + 1) % products.length]
  const url = absolute(`/${product.slug}`)
  let section = 0
  const nextIndex = () => ++section

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#product`,
        name: `${site.name} ${product.name}`,
        description: product.summary,
        applicationCategory: product.category,
        url,
        image: absolute(product.image),
        inLanguage: "en",
        publisher: { "@id": absolute("/#organization") },
        featureList: [
          ...product.groups.flatMap((group) => group.items),
          ...product.agent.items,
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: "en",
        mainEntity: product.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: site.name,
            item: absolute("/"),
          },
          { "@type": "ListItem", position: 2, name: product.name, item: url },
        ],
      },
    ],
  }

  return (
    <main>
      <JsonLd data={structuredData} />
      <section
        data-nav-hero
        className="relative flex flex-col justify-end overflow-hidden bg-black text-white"
      >
        <Image
          src={product.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"
        />
        <div
          className={cn(
            frame,
            "relative flex flex-col gap-8 pt-56 pb-12 md:pt-[24rem] md:pb-16"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-[0.02em] uppercase">
            <span>
              ({String(position + 1).padStart(2, "0")}) {product.category}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-xl">
              {statusLabel(product)}
            </span>
          </div>
          <h1 className="text-[clamp(5rem,16vw,16rem)] leading-[0.82] font-semibold tracking-[-0.065em]">
            {product.name}
          </h1>
          <p className="max-w-4xl text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.045em] text-balance">
            {product.tagline}
          </p>
        </div>
      </section>

      <Section index={nextIndex()} label={product.verb}>
        <p className="text-[clamp(1.75rem,3.4vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.045em] text-balance">
          {product.summary}
        </p>
      </Section>

      <div className="dark bg-background text-foreground dark:bg-muted">
        <Section
          id="question"
          index={nextIndex()}
          label={dictionary.questionLabel}
        >
          <blockquote className="text-[clamp(2.5rem,6vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.055em] text-balance">
            “{product.question}”
          </blockquote>
        </Section>
      </div>

      <Section
        id="principles"
        index={nextIndex()}
        label={dictionary.principlesLabel}
      >
        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {product.principles.map((principle, index) => (
            <li
              key={principle.title}
              className="flex flex-col gap-4 border-t border-foreground/15 pt-6"
            >
              <span className="font-mono text-xs text-foreground/45">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="text-[clamp(1.5rem,2.2vw,2.25rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
                {principle.title}
              </h2>
              <p className="text-[17px] leading-[1.45] tracking-[-0.02em] text-muted-foreground">
                {principle.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="capabilities"
        index={nextIndex()}
        label={dictionary.capabilitiesLabel}
      >
        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {product.groups.map((group) => (
            <div
              key={group.title}
              className="flex flex-col gap-5 border-t border-foreground/15 pt-6"
            >
              <h2 className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none font-semibold tracking-[-0.045em]">
                {group.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-[17px] leading-[1.4] tracking-[-0.02em] text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <section id="agents" className={cn(frame, "py-12 md:py-16")}>
        <div className="relative overflow-hidden rounded-[28px] bg-black text-white">
          <Image
            src={product.image}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-60 blur-2xl"
          />
          <div className="relative grid gap-10 p-6 py-16 md:grid-cols-[1fr_3fr] md:p-10 md:py-24">
            <p className="font-mono text-xs tracking-[0.02em] text-white/75 uppercase">
              ({String(nextIndex()).padStart(2, "0")}) {dictionary.agentLabel}
            </p>
            <div className="flex flex-col gap-12">
              <p className="max-w-4xl text-[clamp(1.75rem,3vw,3rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-balance">
                {product.agent.lead}
              </p>
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {product.agent.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-white/20 py-5 text-[clamp(1.25rem,1.8vw,1.75rem)] leading-[1.15] font-semibold tracking-[-0.035em]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {product.rules && (
        <Section
          id="guarantees"
          index={nextIndex()}
          label={dictionary.rulesLabel}
        >
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
                {product.rules.title}
              </h2>
              <p className="max-w-xl text-[clamp(1.0625rem,1.4vw,1.3125rem)] leading-[1.35] tracking-[-0.02em] text-muted-foreground">
                {product.rules.lead}
              </p>
            </div>
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {product.rules.items.map((item, index) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-t border-foreground/15 py-5"
                >
                  <span className="font-mono text-xs text-foreground/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2] font-semibold tracking-[-0.035em]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {product.standards && (
        <Section
          id="standards"
          index={nextIndex()}
          label={dictionary.standardsLabel}
        >
          <ul className="flex flex-wrap gap-2.5">
            {product.standards.map((standard) => (
              <li
                key={standard}
                className="rounded-full border border-foreground/15 px-5 py-2.5 text-[clamp(1.0625rem,1.4vw,1.375rem)] font-medium tracking-[-0.02em]"
              >
                {standard}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="facts" index={nextIndex()} label={dictionary.factsLabel}>
        <dl className="grid sm:grid-cols-2">
          {product.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-2 border-t border-foreground/15 py-6 sm:pe-10"
            >
              <dt className="font-mono text-xs tracking-[0.02em] text-foreground/45 uppercase">
                {fact.label}
              </dt>
              <dd className="text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.25] font-semibold tracking-[-0.035em]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="works-with"
        index={nextIndex()}
        label={dictionary.worksWithLabel}
      >
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {product.connections.map((connection) => {
            const item = getProduct(connection.slug)
            if (!item) return null
            return (
              <Anchor
                key={connection.slug}
                href={`/${item.slug}`}
                className="group relative flex min-h-80 flex-col justify-between gap-10 overflow-hidden rounded-[24px] bg-black p-6 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:p-8"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]",
                    ease
                  )}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70"
                />
                <span className="relative font-mono text-xs tracking-[0.02em] uppercase">
                  {item.category}
                </span>
                <span className="relative flex flex-col gap-4">
                  <span className="flex items-end justify-between gap-4">
                    <span className="text-[clamp(2.5rem,4vw,4rem)] leading-[0.9] font-semibold tracking-[-0.055em]">
                      {item.name}
                    </span>
                    <Arrow className="border-white/30 group-hover:bg-white group-hover:text-black" />
                  </span>
                  <span className="max-w-md text-[17px] leading-[1.4] tracking-[-0.02em] text-white/85">
                    {connection.text}
                  </span>
                </span>
              </Anchor>
            )
          })}
        </div>
      </Section>

      <Section id="faq" index={nextIndex()} label={dictionary.faqLabel}>
        <div className="flex flex-col border-b border-foreground/15">
          {product.faq.map((item) => (
            <details
              key={item.question}
              className="group border-t border-foreground/15"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                <h2 className="text-[clamp(1.375rem,2vw,2rem)] leading-[1.15] font-semibold tracking-[-0.04em]">
                  {item.question}
                </h2>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 transition-transform duration-500 group-open:rotate-45">
                  <PlusIcon className="size-4" />
                </span>
              </summary>
              <p className="max-w-3xl pb-8 text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.45] tracking-[-0.02em] text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <nav
        aria-label={dictionary.nextProduct}
        className={cn(frame, "pt-8 pb-24 md:pb-36")}
      >
        <Anchor
          href={`/${next.slug}`}
          className="group flex items-center justify-between gap-6 border-y border-foreground/15 py-8 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:py-12"
        >
          <span className="flex flex-col gap-3">
            <span className="font-mono text-xs tracking-[0.02em] text-foreground/45 uppercase">
              {dictionary.nextProduct}
            </span>
            <span
              className={cn(
                "text-[clamp(3rem,8vw,8rem)] leading-[0.85] font-semibold tracking-[-0.06em] transition-transform duration-700 group-hover:translate-x-3",
                ease
              )}
            >
              {next.name}
            </span>
          </span>
          <Arrow className="size-16 md:size-20" />
        </Anchor>
      </nav>
    </main>
  )
}
