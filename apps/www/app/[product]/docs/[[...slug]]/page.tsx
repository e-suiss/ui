import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { findNeighbour } from "fumadocs-core/page-tree"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type * as React from "react"
import { Anchor } from "@/components/anchor"
import { JsonLd } from "@/components/json-ld"
import { getMDXComponents } from "@/components/mdx"
import { Toc } from "@/components/toc"
import { dictionary } from "@/lib/dictionary"
import { pageMetadata } from "@/lib/metadata"
import { getProduct } from "@/lib/products"
import { absolute, site } from "@/lib/site"
import { DOCS, docsTree, source } from "@/lib/source"
import { cn } from "@/lib/utils"

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]"

type Params = PageProps<"/[product]/docs/[[...slug]]">["params"]

async function resolve(params: Params) {
  const { product: slug, slug: rest = [] } = await params
  const product = getProduct(slug)
  const page = source.getPage([slug, DOCS, ...rest])
  if (!product || !page) notFound()
  return { product, page }
}

function Neighbour({
  direction,
  href,
  name,
}: {
  direction: "previous" | "next"
  href: string
  name: React.ReactNode
}) {
  const next = direction === "next"
  const Icon = next ? ArrowRightIcon : ArrowLeftIcon

  return (
    <Anchor
      href={href}
      className={cn(
        "group flex items-center justify-between gap-6 border-t border-foreground/12 py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:py-8",
        !next && "flex-row-reverse"
      )}
    >
      <span
        className={cn("flex flex-col gap-2", !next && "items-end text-end")}
      >
        <span className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
          {next ? dictionary.next : dictionary.previous}
        </span>
        <span
          className={cn(
            "text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none font-semibold tracking-[-0.045em] transition-transform duration-700",
            next ? "group-hover:translate-x-2" : "group-hover:-translate-x-2",
            ease
          )}
        >
          {name}
        </span>
      </span>
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full border border-foreground/15 transition-colors duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background",
          ease
        )}
      >
        <Icon className="size-4" />
      </span>
    </Anchor>
  )
}

export default async function DocPage({
  params,
}: PageProps<"/[product]/docs/[[...slug]]">) {
  const { product, page } = await resolve(params)
  const { body: MDX, toc } = await page.data.load()
  const tree = docsTree(product.slug)
  const { previous, next } = tree
    ? findNeighbour({ name: tree.name, children: [tree] }, page.url)
    : {}

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${absolute(page.url)}#article`,
    headline: page.data.title,
    description: page.data.description ?? product.description,
    url: absolute(page.url),
    inLanguage: "en",
    isPartOf: { "@id": absolute("/#website") },
    publisher: { "@id": absolute("/#organization") },
    about: `${site.name} ${product.name}`,
  }

  return (
    <div className="flex gap-12 px-5 pt-10 pb-24 md:ps-10 md:pt-0 xl:pe-0">
      <JsonLd data={structuredData} />
      <article className="mx-auto w-full max-w-205 min-w-0">
        <header className="mb-14 flex flex-col gap-5 md:mb-16">
          <p className="font-mono text-xs tracking-[0.02em] text-muted-foreground uppercase">
            {site.name} {product.name} · {dictionary.docs}
          </p>
          <h1 className="text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-balance">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="max-w-2xl text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.38] tracking-[-0.02em] text-pretty text-muted-foreground">
              {page.data.description}
            </p>
          )}
        </header>
        <div className="prose">
          <MDX components={getMDXComponents()} />
        </div>
        {(previous || next) && (
          <nav
            aria-label="Pagination"
            className="mt-24 border-b border-foreground/12"
          >
            {next && (
              <Neighbour direction="next" href={next.url} name={next.name} />
            )}
            {previous && (
              <Neighbour
                direction="previous"
                href={previous.url}
                name={previous.name}
              />
            )}
          </nav>
        )}
      </article>
      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  )
}

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs[1] === DOCS)
    .map((page) => ({
      product: page.slugs[0],
      slug: page.slugs.slice(2),
    }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: PageProps<"/[product]/docs/[[...slug]]">): Promise<Metadata> {
  const { product, page } = await resolve(params)
  const overview = page.slugs.length === 2
  return pageMetadata({
    path: page.url,
    title: overview
      ? `${site.name} ${product.name} docs`
      : `${page.data.title} – ${site.name} ${product.name} docs`,
    description: page.data.description ?? product.description,
    image: `/og/${product.slug}/image.png`,
  })
}
