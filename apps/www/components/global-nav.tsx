"use client"

import { usePathname } from "next/navigation"
import { Anchor } from "@/components/anchor"
import { ThemeToggle } from "@/components/ui/theme"
import { type Locale, localePath } from "@/lib/i18n"
import {
  type GlobalNavLabels,
  type NavItem,
  type NavLink,
  GlobalNav as SharedNav,
} from "@/site/global-nav"

const TURKISH_PREFIX = /^\/tr(?=\/|$)/
const ENGLISH_PREFIX = /^\/en(?=\/|$)/

function switchLocalePath(pathname: string, locale: Locale) {
  if (locale === "tr") return pathname.replace(TURKISH_PREFIX, "") || "/"
  return `/tr${pathname === "/" ? "" : pathname}`
}

export function GlobalNav({
  locale,
  items,
  quickLinks,
  tagline,
  labels,
}: {
  locale: Locale
  items: NavItem[]
  quickLinks: NavLink[]
  tagline: [string, string]
  labels: GlobalNavLabels & { developers: string; switchLanguage: string }
}) {
  const pathname = usePathname().replace(ENGLISH_PREFIX, "") || "/"
  const home = localePath(locale, "/")

  return (
    <SharedNav
      anchor={Anchor}
      home={home}
      isHome={pathname === home}
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
        href: localePath(locale, "/#developers"),
      }}
      actions={
        <>
          <Anchor
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale === "en" ? "tr" : "en"}
            className="hidden rounded-sm text-xs font-semibold tracking-[0.5px] text-foreground/70 uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:block"
          >
            {labels.switchLanguage}
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
