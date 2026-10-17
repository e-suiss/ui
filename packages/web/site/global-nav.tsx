"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type NavLink = { label: string; href: string }

export type NavItem = NavLink & {
  active?: boolean
  explore?: NavLink[]
  quick?: NavLink[]
}

export type GlobalNavLabels = {
  menu: string
  search: string
  searchPlaceholder: string
  back: string
  explore: string
  quickLinks: string
  home: string
}

const COMPACT_SIZE = 29
const BAR_HEIGHT = 44
const COLLAPSED = 0.999
const LOGO_GAP = 48
const EXPAND_DURATION = 320

const heroTones = {
  light: {
    "--foreground": "oklch(0.2316 0.0038 286.09)",
    "--background": "oklch(1 0 0)",
    "--muted-foreground": "oklch(0.5399 0.0077 286.13)",
  },
  dark: {
    "--foreground": "oklch(1 0 0)",
    "--background": "oklch(0 0 0)",
    "--muted-foreground": "oklch(1 0 0 / 0.6)",
  },
}

function useOverHero(enabled: boolean) {
  const [over, setOver] = React.useState(enabled)
  React.useEffect(() => {
    if (!enabled) return
    const update = () => {
      const hero = document.querySelector("[data-nav-hero]")
      setOver(hero ? hero.getBoundingClientRect().bottom > BAR_HEIGHT : false)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [enabled])
  return enabled && over
}
const SEARCH = "search"
const WORDMARK = "clamp(88px,13vw,180px)"

type AnchorComponent = React.ComponentType<
  React.ComponentProps<"a"> & { href: string }
>

const AnchorContext = React.createContext<AnchorComponent>((props) => (
  <a {...props} />
))

function Anchor(props: React.ComponentProps<"a"> & { href: string }) {
  const Component = React.useContext(AnchorContext)
  return <Component {...props} />
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 18 18" width="14" height="14" fill="none" aria-hidden>
      <circle
        cx="7.5"
        cy="7.5"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M11.7 11.7 16 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function taglineWords(tagline: [string, string]) {
  const placements = [
    { left: 0.4, width: 0.955 },
    { left: 1.622, width: 0.917 },
  ]
  const total = tagline[0].length + tagline[1].length - 1
  let offset = 0
  return tagline.map((text, index) => {
    const start = offset
    offset += text.length
    return {
      ...placements[index],
      letters: text.split("").map((letter, position) => {
        const order = start + position
        const blur = (12 + (total - order) * 0.35).toFixed(1)
        const threshold = (3 / (6 + (total - order))).toFixed(3)
        const progress = `max(0, var(--p) - ${threshold})`
        return {
          letter,
          style: {
            filter: `blur(calc(var(--p) * ${blur}px))`,
            transform: `translateX(calc(${progress} * ${progress} * 320px)) translateY(calc(${progress} * ${progress} * -110px))`,
            opacity: `clamp(0, calc(1 - ${progress} * ${progress} * 14), 1)`,
          } as React.CSSProperties,
        }
      }),
    }
  })
}

function useProgress(isHome: boolean, storageKey: string) {
  const navRef = React.useRef<HTMLElement>(null)
  const logoRef = React.useRef<HTMLAnchorElement>(null)
  const state = React.useRef({ locked: !isHome, range: 180, tween: 0 })

  const read = React.useCallback(
    () =>
      Number.parseFloat(navRef.current?.style.getPropertyValue("--p") ?? "0") ||
      0,
    []
  )
  const [collapsed, setCollapsed] = React.useState(!isHome)
  const write = React.useCallback((value: number) => {
    navRef.current?.style.setProperty("--p", value.toFixed(4))
    setCollapsed(value >= COLLAPSED)
  }, [])
  const target = React.useCallback(
    () => Math.min(window.scrollY / state.current.range, 1),
    []
  )
  const tween = React.useCallback(
    (to: number, duration: number, done?: () => void) => {
      cancelAnimationFrame(state.current.tween)
      const from = read()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        write(from + (to - from) * (1 - (1 - t) ** 3))
        if (t < 1) state.current.tween = requestAnimationFrame(tick)
        else done?.()
      }
      state.current.tween = requestAnimationFrame(tick)
    },
    [read, write]
  )

  React.useEffect(() => {
    const nav = navRef.current
    const logo = logoRef.current
    if (!nav || !logo) return
    const measure = () => {
      const size = Number.parseFloat(getComputedStyle(logo).fontSize)
      nav.style.setProperty("--end-scale", String(COMPACT_SIZE / size))
      state.current.range = size
    }
    measure()
    window.addEventListener("resize", measure)

    let previous: string | null = null
    try {
      previous = sessionStorage.getItem(storageKey)
      sessionStorage.setItem(storageKey, isHome ? "home" : "page")
    } catch {
      previous = null
    }

    if (!isHome) {
      state.current.locked = true
      write(1)
      return () => window.removeEventListener("resize", measure)
    }

    let frame = 0
    const onScroll = () => {
      if (state.current.locked) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => write(target()))
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    if (previous === "page") {
      write(1)
      state.current.locked = true
      tween(target(), 700, () => {
        state.current.locked = false
      })
    } else {
      state.current.locked = false
      write(target())
    }

    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(state.current.tween)
    }
  }, [isHome, storageKey, target, tween, write])

  const expand = React.useCallback(
    (open: boolean) => {
      state.current.locked = true
      if (open) {
        tween(0, EXPAND_DURATION)
        return
      }
      tween(isHome ? target() : 1, EXPAND_DURATION, () => {
        state.current.locked = !isHome
      })
    },
    [isHome, target, tween]
  )

  return { navRef, logoRef, collapsed, expand }
}

export function GlobalNav({
  home,
  isHome,
  items,
  tagline,
  cta,
  labels,
  quickLinks = [],
  search,
  actions,
  storageKey = "suiss:nav",
  anchor,
  hero,
  loadSearchLinks,
}: {
  home: string
  isHome: boolean
  items: NavItem[]
  tagline: [string, string]
  cta: NavLink
  labels: GlobalNavLabels
  quickLinks?: NavLink[]
  search?: React.ReactNode
  actions?: React.ReactNode
  storageKey?: string
  anchor: AnchorComponent
  hero?: keyof typeof heroTones
  loadSearchLinks?: () => Promise<NavLink[]>
}) {
  const [panel, setPanel] = React.useState<string | null>(null)
  const [solid, setSolid] = React.useState(false)
  const [mobile, setMobile] = React.useState<"open" | "closing" | null>(null)
  const [sub, setSub] = React.useState<string | null>(null)
  const [returning, setReturning] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const panelsRef = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState<string | null>(null)
  const linksRef = React.useRef<HTMLUListElement>(null)
  const [linksStart, setLinksStart] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!panel) return
    const measure = () => {
      const links = linksRef.current
      const frame = links?.parentElement
      const logo = logoRef.current
      if (!links || !frame) return
      const rtl = getComputedStyle(frame).direction === "rtl"
      const box = frame.getBoundingClientRect()
      const offset = (rect: DOMRect) =>
        rtl ? box.right - rect.right : rect.left - box.left
      const linksStart = offset(links.getBoundingClientRect())
      const logoBox = logo?.getBoundingClientRect()
      const logoEnd =
        logo && logoBox
          ? (rtl ? box.right - logoBox.right : logoBox.left - box.left) +
            logo.offsetWidth +
            LOGO_GAP
          : 0
      setLinksStart(Math.max(0, linksStart, logoEnd))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [panel])
  const [panelHeight, setPanelHeight] = React.useState(0)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const { navRef, logoRef, collapsed, expand } = useProgress(isHome, storageKey)
  const words = React.useMemo(() => taglineWords(tagline), [tagline])
  const menus = items.filter((item) => item.explore?.length)
  const open = panel !== null || mobile === "open"
  const overHero = useOverHero(Boolean(hero))
  const tone =
    hero && overHero && !collapsed && !solid ? heroTones[hero] : undefined
  let position = "relative w-full"
  if (hero) position = "fixed start-0 end-[var(--scrollbar-gap,0px)] top-0"
  else if (isHome) position = "sticky top-0 w-full"

  const panelOpen = panel !== null
  const wasPanelOpen = React.useRef(false)
  React.useEffect(() => {
    if (panelOpen === wasPanelOpen.current) return
    wasPanelOpen.current = panelOpen
    expand(panelOpen)
  }, [panelOpen, expand])

  const wasOpen = React.useRef(false)
  React.useEffect(() => {
    if (open === wasOpen.current) return
    wasOpen.current = open
    if (open) {
      setSolid(true)
      return
    }
    const bar = setTimeout(() => setSolid(false), 300)
    return () => clearTimeout(bar)
  }, [open])

  const openPanel = (name: string | null) => {
    clearTimeout(closeTimer.current)
    setPanel(name)
    if (name) setShown(name)
  }

  React.useLayoutEffect(() => {
    const active = panelsRef.current?.querySelector<HTMLElement>(
      "[data-nav-panel]:not([hidden])"
    )
    setPanelHeight(panel && active ? active.offsetHeight : 0)
  }, [panel])

  const closeMobile = React.useCallback(() => {
    setMobile((value) => (value === "open" ? "closing" : value))
  }, [])

  React.useEffect(() => {
    if (mobile !== "closing") return
    const timeout = setTimeout(() => {
      setMobile(null)
      setSub(null)
      setReturning(false)
    }, 500)
    return () => clearTimeout(timeout)
  }, [mobile])

  React.useEffect(() => {
    if (!returning) return
    const timeout = setTimeout(() => {
      setSub(null)
      setReturning(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [returning])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setPanel(null)
      closeMobile()
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) closeMobile()
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("resize", onResize)
    }
  }, [closeMobile])

  React.useEffect(() => {
    if (mobile !== "open") return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobile])

  const [searchLinks, setSearchLinks] = React.useState<NavLink[]>([])
  const searchOpen = panel === SEARCH
  React.useEffect(() => {
    if (!searchOpen || !loadSearchLinks || searchLinks.length) return
    let active = true
    loadSearchLinks()
      .then((links) => active && setSearchLinks(links))
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [searchOpen, loadSearchLinks, searchLinks.length])

  const results = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return quickLinks
    const seen = new Set<string>()
    return [
      ...items,
      ...items.flatMap((item) => [
        ...(item.explore ?? []),
        ...(item.quick ?? []),
      ]),
      ...quickLinks,
      ...searchLinks,
    ]
      .filter((link) => {
        if (seen.has(link.href) || !link.label.toLowerCase().includes(needle))
          return false
        seen.add(link.href)
        return true
      })
      .slice(0, 8)
  }, [items, quickLinks, searchLinks, query])

  const close = () => setPanel(null)

  const toggleSearch = () => {
    const opening = panel !== SEARCH
    openPanel(opening ? SEARCH : null)
    if (opening)
      requestAnimationFrame(() =>
        searchRef.current?.focus({ preventScroll: true })
      )
  }
  const toggleSearchRef = React.useRef(toggleSearch)
  toggleSearchRef.current = toggleSearch

  React.useEffect(() => {
    if (search) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey))
        return
      event.preventDefault()
      toggleSearchRef.current()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [search])

  return (
    <AnchorContext value={anchor}>
      <nav
        ref={navRef}
        aria-label="Global"
        data-home={isHome}
        data-solid={solid || undefined}
        data-transparent={tone ? true : undefined}
        style={
          {
            "--p": isHome ? 0 : 1,
            "--end-scale": 0.12,
            ...tone,
          } as React.CSSProperties
        }
        onMouseEnter={() => clearTimeout(closeTimer.current)}
        onMouseLeave={() => {
          closeTimer.current = setTimeout(close, 120)
        }}
        className={cn("global-nav z-50 text-foreground", position)}
      >
        <div className="relative mx-auto flex h-11 max-w-[1680px] items-center justify-end gap-7 px-5 md:px-10">
          <ul ref={linksRef} className="hidden items-center gap-7 lg:flex">
            {items.map((item) => (
              <li
                key={item.href}
                className="flex h-11 items-center"
                onMouseEnter={() =>
                  openPanel(item.explore?.length ? item.label : null)
                }
                onFocus={() =>
                  openPanel(item.explore?.length ? item.label : null)
                }
              >
                <Anchor
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  aria-expanded={
                    item.explore?.length ? panel === item.label : undefined
                  }
                  className={cn(
                    "rounded-sm text-xs font-semibold tracking-[0.5px] text-foreground/70 uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    item.active &&
                      "underline decoration-dotted underline-offset-[6px]"
                  )}
                >
                  {item.label}
                </Anchor>
              </li>
            ))}
          </ul>
          {search ?? (
            <button
              type="button"
              aria-label={labels.search}
              aria-expanded={panel === SEARCH}
              onMouseEnter={() => clearTimeout(closeTimer.current)}
              onClick={toggleSearch}
              className="flex size-6 items-center justify-center rounded-full text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <SearchIcon />
            </button>
          )}
          {actions}
          <button
            type="button"
            aria-label={labels.menu}
            aria-expanded={mobile === "open"}
            data-open={mobile === "open" || undefined}
            onClick={() =>
              mobile === "open" ? closeMobile() : setMobile("open")
            }
            className="mm-toggle relative flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
          >
            <span className="mm-line absolute h-px w-4.5 rounded-full bg-foreground" />
            <span className="mm-line absolute h-px w-4.5 rounded-full bg-foreground" />
          </button>
          <Anchor
            href={cta.href}
            className="group relative inline-flex items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="absolute start-0 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-foreground/15 transition-all duration-300 ease-out group-hover:w-full" />
            <span className="relative flex items-center py-1.5 ps-4.5 pe-3.5">
              <span className="text-xs font-semibold whitespace-nowrap text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                {cta.label}
              </span>
            </span>
          </Anchor>
        </div>

        <div className="nav-wordmark pointer-events-none absolute inset-x-0 top-11 z-20">
          <div className="mx-auto max-w-[1680px] px-5 md:px-10">
            <a
              ref={logoRef}
              href={home}
              aria-label={labels.home}
              style={{
                transform:
                  "translateY(calc(var(--p) * -36px)) scale(calc(1 - var(--p) * (1 - var(--end-scale))))",
                fontSize: WORDMARK,
              }}
              className="pointer-events-auto relative inline-flex origin-top-left items-baseline gap-[0.13em] rounded-sm leading-[0.95] font-semibold tracking-[-0.02em] text-foreground outline-none will-change-transform focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {words.map((word, index) => (
                <span
                  key={index}
                  aria-hidden
                  style={{
                    left: `calc(${WORDMARK} * ${word.left})`,
                    width: `calc(${WORDMARK} * ${word.width})`,
                    top: `calc(${WORDMARK} * 0.096)`,
                    fontSize: `calc(${WORDMARK} * 0.181)`,
                  }}
                  className="absolute flex justify-between leading-none font-semibold text-foreground/70 uppercase"
                >
                  {word.letters.map((item, position) => (
                    <span key={position} style={item.style}>
                      {item.letter === " " ? " " : item.letter}
                    </span>
                  ))}
                </span>
              ))}
              <span
                aria-hidden
                className="size-[0.24em] rounded-full bg-muted-foreground"
              />
              suiss
            </a>
          </div>
        </div>

        <div
          ref={panelsRef}
          style={{ height: panelHeight }}
          className="nav-panels absolute inset-x-0 top-11 overflow-hidden bg-background"
        >
          {menus.map((item) => (
            <div
              key={item.label}
              data-nav-panel
              data-open={panel === item.label || undefined}
              hidden={shown !== item.label}
              className="nav-panel"
            >
              <div
                style={{ paddingInlineStart: linksStart }}
                className="mx-auto flex max-w-[1680px] gap-20 px-5 py-10 md:px-10"
              >
                <div>
                  <p className="text-xs text-muted-foreground">
                    {labels.explore}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {item.explore?.map((link, index) => (
                      <li
                        key={link.href}
                        className="fade-item"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <Anchor
                          href={link.href}
                          onClick={close}
                          tabIndex={panel === item.label ? undefined : -1}
                          className="rounded-sm text-[28px] leading-[1.18] font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <span className="mm-label" data-hover={link.label}>
                            {link.label}
                          </span>
                        </Anchor>
                      </li>
                    ))}
                  </ul>
                </div>
                {item.quick?.length ? (
                  <div className="pt-0.5">
                    <p className="text-xs text-muted-foreground">
                      {labels.quickLinks}
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {item.quick.map((link, index) => (
                        <li
                          key={link.href}
                          className="fade-item"
                          style={{ animationDelay: `${120 + index * 40}ms` }}
                        >
                          <Anchor
                            href={link.href}
                            onClick={close}
                            tabIndex={panel === item.label ? undefined : -1}
                            className="rounded-sm text-sm text-foreground/80 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            {link.label}
                          </Anchor>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {!search && (
            <div
              data-nav-panel
              data-open={panel === SEARCH || undefined}
              hidden={shown !== SEARCH}
              className="nav-panel"
            >
              <div
                style={{ paddingInlineStart: linksStart }}
                className="mx-auto max-w-[1680px] px-5 py-8 md:px-10"
              >
                <div className="flex items-center gap-3 border-b border-border pb-3 text-foreground">
                  <SearchIcon />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    tabIndex={panel === SEARCH ? undefined : -1}
                    placeholder={labels.searchPlaceholder}
                    aria-label={labels.search}
                    className="w-full bg-transparent text-[21px] text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
                  />
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  {labels.quickLinks}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {results.map((link) => (
                    <li key={link.href}>
                      <Anchor
                        href={link.href}
                        onClick={close}
                        tabIndex={panel === SEARCH ? undefined : -1}
                        className="rounded-sm text-sm text-foreground/80 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {link.label}
                      </Anchor>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div
        data-open={mobile === "open" || undefined}
        data-closing={mobile === "closing" || undefined}
        data-sub={(sub && !returning) || undefined}
        data-returning={returning || undefined}
        inert={mobile !== "open"}
        className="mobile-menu bg-background lg:hidden"
      >
        <div className="relative px-5 pt-[150px] pb-8 md:px-10">
          <button
            type="button"
            aria-label={labels.back}
            onClick={() => setReturning(true)}
            className="mm-back absolute end-5 top-28 md:end-10 rounded-full text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <svg
              viewBox="0 0 24 12"
              width="26"
              height="13"
              fill="none"
              aria-hidden
              className="rtl:-scale-x-100"
            >
              <path
                d="M7 1 1 6l6 5 M1.5 6H23"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div data-mm-main>
            {items.map((item, index) => (
              <div
                key={item.href}
                className="overflow-hidden"
                style={
                  {
                    "--i": index,
                    "--ri": items.length - 1 - index,
                  } as React.CSSProperties
                }
              >
                {item.explore?.length ? (
                  <button
                    type="button"
                    data-mm-open
                    onClick={() => {
                      setReturning(false)
                      setSub(item.label)
                    }}
                    className="mm-row flex w-full items-center gap-3 py-2 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="text-[30px] leading-[1.2] font-semibold tracking-[-0.03em] text-foreground">
                      {item.label}
                    </span>
                    <span
                      aria-hidden
                      className="mm-plus relative inline-block size-4.5"
                    >
                      <span className="absolute start-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-muted-foreground" />
                      <span className="absolute start-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded-full bg-muted-foreground" />
                    </span>
                  </button>
                ) : (
                  <Anchor
                    href={item.href}
                    onClick={closeMobile}
                    className="mm-row block py-2 text-[30px] leading-[1.2] font-semibold tracking-[-0.03em] text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {item.label}
                  </Anchor>
                )}
              </div>
            ))}
          </div>

          <div
            data-mm-sub
            className="absolute inset-x-5 top-[150px] md:inset-x-10"
          >
            {menus.map((item) => (
              <div
                key={item.label}
                data-active={sub === item.label || undefined}
                className="mm-subpanel absolute inset-x-0 top-0"
              >
                {[
                  { label: item.label, href: item.href },
                  ...(item.explore ?? []),
                ]
                  .filter(
                    (link, index, list) =>
                      list.findIndex((other) => other.href === link.href) ===
                      index
                  )
                  .map((link, index, list) => (
                    <div
                      key={link.href}
                      className="overflow-hidden"
                      style={
                        {
                          "--i": index,
                          "--ri": list.length - 1 - index,
                        } as React.CSSProperties
                      }
                    >
                      <Anchor
                        href={link.href}
                        onClick={closeMobile}
                        className="mm-row block py-1.5 text-[22px] leading-[1.3] font-semibold tracking-[-0.02em] text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {link.label}
                      </Anchor>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden
        data-open={open || undefined}
        className="nav-backdrop pointer-events-none fixed inset-0 z-40 bg-black/20 backdrop-blur-md"
      />

      {isHome && !hero && (
        <div
          aria-hidden
          className="h-[clamp(84px,12.4vw,172px)] w-full bg-background"
        />
      )}
    </AnchorContext>
  )
}
