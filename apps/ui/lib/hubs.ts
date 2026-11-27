import { contentDates } from "@/lib/dates"
import { source } from "@/lib/source"

type Page = NonNullable<ReturnType<typeof source.getPage>>

export type Variant = { page: Page; anchor: string }

function anchorOf(hub: Page, name: string) {
  const prefix = `${hub.slugs.at(-1)}-`
  return name.startsWith(prefix) ? name.slice(prefix.length) : name
}

function build() {
  const hubs = new Map<string, Variant[]>()
  const owners = new Map<string, { hub: Page; anchor: string }>()
  for (const hub of source.getPages()) {
    const names = hub.data.variants
    if (!names) continue
    const variants = names.flatMap((name) => {
      const page = source.getPage([...hub.slugs.slice(0, -1), name])
      return page ? [{ page, anchor: anchorOf(hub, name) }] : []
    })
    hubs.set(hub.url, variants)
    for (const { page, anchor } of variants)
      owners.set(page.url, { hub, anchor })
  }
  return { hubs, owners }
}

let cache: ReturnType<typeof build> | undefined
const index = () => {
  cache ??= build()
  return cache
}

export function hubVariants(page: Page) {
  return index().hubs.get(page.url)
}

export function hubOf(page: Page) {
  return index().owners.get(page.url)
}

export function isVariant(page: Page) {
  return index().owners.has(page.url)
}

export function listedPages() {
  return source.getPages().filter((page) => !isVariant(page))
}

export function pageHref(url: string) {
  const owner = index().owners.get(url)
  return owner ? `${owner.hub.url}#${owner.anchor}` : url
}

export function pageDates(page: Page) {
  const dates = [page, ...(hubVariants(page) ?? []).map((v) => v.page)].map(
    (entry) => contentDates(entry.path)
  )
  const times = (key: "published" | "modified") =>
    dates.flatMap((entry) => entry[key]?.getTime() ?? [])
  const modified = times("modified")
  const published = times("published")
  return {
    modified: modified.length ? new Date(Math.max(...modified)) : undefined,
    published: published.length ? new Date(Math.min(...published)) : undefined,
  }
}

export function hubWeights(): Record<string, number> {
  return Object.fromEntries(
    [...index().hubs].map(([url, variants]) => [url, variants.length])
  )
}
