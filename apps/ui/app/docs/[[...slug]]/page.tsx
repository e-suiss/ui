import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb"
import { findNeighbour } from "fumadocs-core/page-tree"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import * as React from "react"
import { getMDXComponents } from "@/components/mdx"
import { Anchor } from "@/components/site/anchor"
import { BaseItemsProvider } from "@/components/site/base-items"
import { JsonLd } from "@/components/site/json-ld"
import { PageActions } from "@/components/site/page-actions"
import { PlatformScope, PlatformSwitcher } from "@/components/site/platform"
import { Toc } from "@/components/site/toc"
import { withBase } from "@/lib/base-path"
import { contentDates } from "@/lib/dates"
import { baseItems } from "@/lib/dependencies"
import { markdownUrl } from "@/lib/llms"
import { absolute, site } from "@/lib/site"
import { source } from "@/lib/source"
import { strings } from "@/lib/strings"
import { pageSummary } from "@/lib/summary"
import { cn } from "@/lib/utils"

const WIDE_PAGE = /^\/docs\/(patterns|interactions|blocks)(\/|$)/

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]"

function getDocPage(params: { slug?: string[] }) {
  return source.getPage(params.slug)
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
          {next ? strings.next : strings.previous}
        </span>
        <span
          className={cn(
            "text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-semibold tracking-[-0.045em] transition-transform duration-700",
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

export default function Page(props: PageProps<"/docs/[[...slug]]">) {
  return (
    <React.Suspense>
      <DocPage params={props.params} />
    </React.Suspense>
  )
}

async function DocPage(props: {
  params: PageProps<"/docs/[[...slug]]">["params"]
}) {
  const params = await props.params
  const page = getDocPage(params)
  if (!page) notFound()

  const eyebrow = page.data.eyebrow
  const kind = eyebrow && eyebrow !== strings.brand ? eyebrow : undefined
  const { body: MDX, toc } = await page.data.load()
  const wide = WIDE_PAGE.test(page.url)
  const item = page.slugs.at(-1)
  const items = item
    ? await baseItems(item, () => page.data.getText("raw"))
    : undefined
  const { previous, next } = findNeighbour(source.getPageTree(), page.url, {
    separateRoot: true,
  })

  const crumbs = [
    { name: site.name, url: "/" },
    { name: "Docs", url: "/docs" },
    ...getBreadcrumbItems(page.url, source.getPageTree(), { includePage: true })
      .filter((item) => item.url && item.url !== "/docs")
      .map((item) => ({ name: String(item.name), url: item.url as string })),
  ]
  const summary = pageSummary(
    page.data.title,
    page.data.eyebrow,
    page.data.platforms
  )
  const { published, modified } = contentDates(page.path)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${absolute(page.url)}#article`,
        headline: page.data.title,
        description: page.data.description ?? site.description,
        abstract: summary,
        url: absolute(page.url),
        image: absolute(`/og/docs/${[...page.slugs, "image.png"].join("/")}`),
        inLanguage: "en",
        datePublished: published?.toISOString(),
        dateModified: modified?.toISOString(),
        isPartOf: { "@id": absolute("/#website") },
        about: { "@id": absolute("/#software") },
        author: { "@id": site.organization.id },
        publisher: { "@id": site.organization.id },
        keywords: [page.data.title, kind, ...site.topics]
          .filter(Boolean)
          .join(", "),
        encoding: {
          "@type": "MediaObject",
          encodingFormat: "text/markdown",
          contentUrl: absolute(markdownUrl(page.url)),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: absolute(crumb.url),
        })),
      },
    ],
  }

  const platforms = page.data.platforms
  const content = (
    <div className="flex gap-12 px-5 pt-14 pb-24 md:px-10 md:pt-20 xl:pe-10">
      <JsonLd data={structuredData} />
      <article
        className={cn(
          "mx-auto w-full min-w-0",
          wide ? "max-w-[72rem]" : "max-w-205"
        )}
      >
        <header className="mb-14 flex flex-col gap-5 md:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.02em] text-muted-foreground uppercase">
              {strings.brand}
              {kind && <span className="text-muted-foreground"> · {kind}</span>}
            </p>
            <PageActions markdownUrl={withBase(markdownUrl(page.url))} />
          </div>
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.055em] text-balance">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="max-w-2xl text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.38] tracking-[-0.02em] text-pretty text-muted-foreground">
              {page.data.description}
            </p>
          )}
          {summary && (
            <p className="max-w-2xl text-[15px] leading-[1.5] tracking-[-0.01em] text-pretty text-muted-foreground">
              {summary}
            </p>
          )}
          {platforms && platforms.length > 1 && (
            <div className="mt-4">
              <PlatformSwitcher platforms={platforms} />
            </div>
          )}
        </header>
        <div className="prose">
          <BaseItemsProvider value={items}>
            <MDX components={getMDXComponents()} />
          </BaseItemsProvider>
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
  return platforms ? (
    <PlatformScope platforms={platforms}>{content}</PlatformScope>
  ) : (
    content
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
  const page = getDocPage(await props.params)
  if (!page) notFound()

  const image = `/og/docs/${[...page.slugs, "image.png"].join("/")}`
  const description = page.data.description ?? site.description

  return {
    title: page.data.title,
    description,
    alternates: {
      canonical: page.url,
      types: { "text/markdown": markdownUrl(page.url) },
    },
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: "en_US",
      url: page.url,
      title: page.data.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: page.data.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description,
      images: [image],
    },
  }
}
