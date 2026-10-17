"use client"

import { usePathname } from "next/navigation"
import { Anchor } from "@/components/site/anchor"
import { useActiveSection } from "@/components/site/local-nav"
import { loadIndex } from "@/components/site/search"
import { ThemeToggle } from "@/components/ui/theme"
import { repository } from "@/lib/sections"
import { strings } from "@/lib/strings"
import { type NavItem, GlobalNav as SharedNav } from "@/site/global-nav"

const textLink =
  "hidden rounded-sm text-xs font-semibold tracking-[0.5px] text-foreground/70 uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:block"

function quickLinks(items: NavItem[]) {
  const seen = new Set<string>()
  return [
    ...items.flatMap((item) => item.quick ?? []),
    ...items.map(({ label, href }) => ({ label, href })),
  ].filter((link) => !seen.has(link.href) && seen.add(link.href))
}

function loadSearchLinks() {
  return loadIndex().then((groups) =>
    groups.flatMap((group) =>
      group.pages.map((page) => ({ label: page.title, href: page.url }))
    )
  )
}

export function GlobalNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const isActive = useActiveSection()
  if (pathname !== "/") return null

  return (
    <SharedNav
      anchor={Anchor}
      home="/"
      isHome
      hero="light"
      storageKey="suiss:ui"
      tagline={[strings.taglineStart, strings.taglineEnd]}
      items={items.map((item) => ({ ...item, active: isActive(item.href) }))}
      cta={{ label: strings.getStarted, href: "/docs/installation" }}
      quickLinks={quickLinks(items)}
      loadSearchLinks={loadSearchLinks}
      labels={{
        menu: strings.menu,
        search: strings.search,
        searchPlaceholder: strings.searchPlaceholder,
        back: strings.back,
        explore: strings.explore,
        quickLinks: strings.quickLinks,
        home: strings.home,
      }}
      actions={
        <>
          <Anchor href={repository} className={textLink}>
            {strings.github}
          </Anchor>
          <ThemeToggle
            effect="rectangle"
            origin="top-down"
            size="icon-xs"
            className="text-foreground/70 hover:text-foreground"
          />
        </>
      }
    />
  )
}
