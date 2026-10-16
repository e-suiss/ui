"use client"

import { ArrowUpRightIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import { usePathname } from "next/navigation"
import * as React from "react"

import { Anchor } from "@/components/anchor"
import { ease } from "@/components/arrow"
import { ThemeToggle } from "@/components/theme"
import { type Locale, localePath } from "@/lib/i18n"

const MENU_EXIT = 500
const TURKISH_PREFIX = /^\/tr(?=\/|$)/
const ENGLISH_PREFIX = /^\/en(?=\/|$)/

type Item = { label: string; href: string }

function switchLocalePath(pathname: string, locale: Locale) {
  if (locale === "tr") return pathname.replace(TURKISH_PREFIX, "") || "/"
  return `/tr${pathname === "/" ? "" : pathname}`
}

function overlayTone(overlay: boolean, home: boolean) {
  if (!overlay) return "plain"
  return home ? "light" : "dark"
}

function RollLink({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: string
}) {
  return (
    <Anchor
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center overflow-hidden rounded-full px-3.5 text-sm leading-5 font-medium tracking-[-0.01em] outline-none transition-colors duration-300 focus-visible:focus-ring",
        active ? "bg-label text-surface" : "hover:bg-label/8"
      )}
    >
      <span className="relative block overflow-hidden">
        <span
          className={cn(
            "block transition-transform duration-500 group-hover:-translate-y-full",
            ease
          )}
        >
          {children}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0",
            ease
          )}
        >
          {children}
        </span>
      </span>
    </Anchor>
  )
}

export function GlobalNav({
  locale,
  items,
  labels,
  themeLabels,
}: {
  locale: Locale
  items: Item[]
  labels: {
    menu: string
    close: string
    developers: string
    switchLanguage: string
  }
  themeLabels: { system: string; light: string; dark: string }
}) {
  const pathname = usePathname().replace(ENGLISH_PREFIX, "") || "/"
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [menuMounted, setMenuMounted] = React.useState(false)
  const home = pathname === localePath(locale, "/")
  const overlay = home || items.some((item) => item.href === pathname)

  React.useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true)
      return
    }
    const timeout = setTimeout(() => setMenuMounted(false), MENU_EXIT)
    return () => clearTimeout(timeout)
  }, [menuOpen])

  const [menuPath, setMenuPath] = React.useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  React.useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const developers = localePath(locale, "/#developers")
  const tone = overlayTone(overlay, home)
  const glass = {
    plain: "bg-label/5 hover:bg-label/10",
    light: "bg-white/35 text-[#1d1d1f] backdrop-blur-2xl hover:bg-white/55",
    dark: "bg-black/25 text-white backdrop-blur-2xl hover:bg-black/40",
  }[menuOpen ? "plain" : tone]

  return (
    <header
      className={cn(
        "z-50",
        overlay && !menuOpen
          ? "absolute inset-x-0 top-0 text-[#1d1d1f]"
          : "relative border-b border-label/10 bg-surface text-label",
        overlay &&
          !menuOpen &&
          pathname !== localePath(locale, "/") &&
          "text-white"
      )}
    >
      <nav
        aria-label="Global"
        className="relative z-10 mx-auto flex h-16 w-full max-w-[1680px] items-center gap-6 px-5 md:px-10"
      >
        <Anchor
          href={localePath(locale, "/")}
          className="flex h-10 items-center rounded-sm outline-none focus-visible:focus-ring"
        >
          <span className="text-[24px] leading-none font-semibold tracking-[-0.03em]">
            suiss
          </span>
        </Anchor>

        <ul
          className={cn(
            "absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full p-1 backdrop-blur-2xl backdrop-saturate-150 xl:flex",
            {
              plain: "bg-label/5",
              light: "bg-white/35 text-[#1d1d1f]",
              dark: "bg-black/25 text-white",
            }[tone]
          )}
        >
          {items.map((item) => (
            <li key={item.href}>
              <RollLink href={item.href} active={pathname === item.href}>
                {item.label}
              </RollLink>
            </li>
          ))}
        </ul>

        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle
            labels={themeLabels}
            className={cn("hidden sm:flex", glass)}
          />
          <Anchor
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale === "en" ? "tr" : "en"}
            className={cn(
              "flex h-10 items-center rounded-full px-4 text-sm font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:focus-ring",
              glass
            )}
          >
            {labels.switchLanguage}
          </Anchor>
          <Anchor
            href={developers}
            className={cn(
              "group hidden h-10 items-center gap-2 rounded-full ps-4.5 pe-1 text-sm font-medium outline-none focus-visible:focus-ring sm:flex",
              overlay && !menuOpen
                ? "bg-[#1d1d1f] text-white"
                : "bg-label text-surface"
            )}
          >
            {labels.developers}
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45",
                overlay && !menuOpen
                  ? "bg-white text-[#1d1d1f]"
                  : "bg-surface text-label",
                ease
              )}
            >
              <ArrowUpRightIcon weight="bold" className="size-3.5" />
            </span>
          </Anchor>
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className={cn(
              "h-10 rounded-full px-4.5 text-sm font-medium outline-none transition-colors duration-300 focus-visible:focus-ring xl:hidden",
              glass
            )}
          >
            {menuOpen ? labels.close : labels.menu}
          </button>
        </div>
      </nav>

      {menuMounted && (
        <div
          data-state={menuOpen ? "open" : "closed"}
          className={cn(
            "fixed inset-0 flex flex-col overflow-y-auto bg-surface px-5 pt-24 pb-10 text-label transition-opacity duration-500 md:px-10 xl:hidden",
            ease,
            menuOpen
              ? "opacity-100 starting:opacity-0"
              : "pointer-events-none opacity-0"
          )}
        >
          <ul className="flex flex-col">
            {items.map((item, index) => (
              <li
                key={item.href}
                style={{
                  transitionDelay: `${(menuOpen ? index : items.length - 1 - index) * 40}ms`,
                }}
                className={cn(
                  "border-t border-label/15 transition-[opacity,translate] duration-500",
                  ease,
                  menuOpen
                    ? "translate-y-0 opacity-100 starting:translate-y-4 starting:opacity-0"
                    : "-translate-y-2 opacity-0"
                )}
              >
                <Anchor
                  href={item.href}
                  className="flex items-baseline gap-4 py-2.5 outline-none focus-visible:focus-ring"
                >
                  <span className="font-mono text-xs text-label-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(2.5rem,10vw,4.5rem)] leading-[0.95] font-semibold tracking-tighter">
                    {item.label}
                  </span>
                </Anchor>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-6 border-t border-label/15 pt-6 text-[15px] font-medium">
            <Anchor href={developers}>{labels.developers}</Anchor>
            <Anchor href={switchLocalePath(pathname, locale)}>
              {labels.switchLanguage}
            </Anchor>
          </div>
        </div>
      )}
    </header>
  )
}
