"use client"

import { usePathname } from "next/navigation"
import { Anchor } from "@/components/anchor"
import { ThemeToggle } from "@/components/ui/theme"
import {
  type GlobalNavLabels,
  type NavItem,
  type NavLink,
  GlobalNav as SharedNav,
} from "@/site/global-nav"

function heroTone(isHome: boolean, isProduct: boolean) {
  if (isHome) return "light"
  if (isProduct) return "dark"
  return undefined
}

export function GlobalNav({
  items,
  quickLinks,
  tagline,
  labels,
}: {
  items: NavItem[]
  quickLinks: NavLink[]
  tagline: [string, string]
  labels: GlobalNavLabels & { developers: string }
}) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isProduct = items.some((item) => item.href === pathname)

  return (
    <SharedNav
      anchor={Anchor}
      home="/"
      isHome={isHome}
      hero={heroTone(isHome, isProduct)}
      storageKey="suiss:www"
      tagline={tagline}
      labels={labels}
      quickLinks={quickLinks}
      items={items.map((item) => ({
        ...item,
        active: pathname === item.href || pathname.startsWith(`${item.href}/`),
      }))}
      cta={{
        label: labels.developers,
        href: "/ui",
      }}
      actions={
        <ThemeToggle
          effect="rectangle"
          origin="top-down"
          size="icon-xs"
          className="text-foreground/70 hover:text-foreground"
        />
      }
    />
  )
}
