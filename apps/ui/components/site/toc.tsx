"use client"

import { ArrowUpIcon } from "@phosphor-icons/react"
import type { TableOfContents, TOCItemType } from "fumadocs-core/toc"
import * as React from "react"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

type Section = { item: TOCItemType; children: TOCItemType[] }

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]"
const pad = (value: number) => String(value).padStart(2, "0")
const idOf = (item: TOCItemType) => decodeURIComponent(item.url.slice(1))

function sectionsOf(items: TableOfContents) {
  const sections: Section[] = []
  for (const item of items) {
    if (item.depth <= 2 || sections.length === 0)
      sections.push({ item, children: [] })
    else sections.at(-1)?.children.push(item)
  }
  return sections
}

function useActiveHeading(ids: string[]) {
  const [active, setActive] = React.useState<string>()

  React.useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.25
        let current: string | undefined
        for (const id of ids) {
          const heading = document.getElementById(id)
          if (heading && heading.getBoundingClientRect().top <= line)
            current = id
        }
        const atEnd =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2
        setActive(atEnd ? ids.at(-1) : current)
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ids])

  return active
}

function useAtPageEnd() {
  const [atEnd, setAtEnd] = React.useState(false)

  React.useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight > window.innerHeight + 2
        setAtEnd(
          scrollable &&
            window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 2
        )
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return atEnd
}

function BackToTop() {
  const visible = useAtPageEnd()

  return (
    <button
      type="button"
      tabIndex={visible ? undefined : -1}
      aria-hidden={visible ? undefined : true}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "group flex h-8 w-fit items-center gap-2 rounded-full bg-foreground/10 ps-3.5 pe-1 text-sm text-foreground outline-none transition-[opacity,translate,background-color] duration-500 hover:bg-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/50",
        ease,
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      {strings.backToTop}
      <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background">
        <ArrowUpIcon
          weight="bold"
          className={cn(
            "size-3 transition-transform duration-500 group-hover:-translate-y-0.5",
            ease
          )}
        />
      </span>
    </button>
  )
}

function useShownHeadings(items: TableOfContents) {
  const [hidden, setHidden] = React.useState<Set<string>>(() => new Set())

  React.useEffect(() => {
    const update = () => {
      const next = new Set<string>()
      for (const item of items) {
        const heading = document.getElementById(idOf(item))
        if (heading && heading.offsetParent === null) next.add(idOf(item))
      }
      setHidden(next)
    }
    update()
    window.addEventListener("platformchange", update)
    return () => window.removeEventListener("platformchange", update)
  }, [items])

  return React.useMemo(
    () => items.filter((item) => !hidden.has(idOf(item))),
    [items, hidden]
  )
}

export function Toc({ items }: { items: TableOfContents }) {
  const shown = useShownHeadings(items)
  const headings = React.useMemo(
    () => shown.filter((item) => item.depth <= 3),
    [shown]
  )
  const sections = React.useMemo(() => sectionsOf(headings), [headings])
  const ids = React.useMemo(() => headings.map(idOf), [headings])
  const active = useActiveHeading(ids)

  if (sections.length === 0) return null
  const current = sections.findIndex(
    (section) =>
      idOf(section.item) === active ||
      section.children.some((child) => idOf(child) === active)
  )

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label={strings.onThisPage} className="flex flex-col gap-5">
        <p className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
          {strings.onThisPage}
        </p>
        <ol className="flex flex-col gap-1">
          {sections.map((section, index) => (
            <li key={section.item.url}>
              <a
                href={section.item.url}
                className={cn(
                  "grid grid-cols-[2rem_1fr] items-baseline py-1.5 text-[14px] leading-[1.3] tracking-[-0.015em] transition-colors duration-300 hover:text-foreground",
                  index === current
                    ? "font-medium text-foreground"
                    : "text-foreground/50"
                )}
              >
                <span className="font-mono text-[11px] font-normal tracking-[0.02em] text-muted-foreground">
                  {pad(index + 1)}
                </span>
                <span>{section.item.title}</span>
              </a>
              {section.children.length > 0 && (
                <ul className="flex flex-col ps-8">
                  {section.children.map((child) => (
                    <li key={child.url}>
                      <a
                        href={child.url}
                        data-active={idOf(child) === active ? "" : undefined}
                        className="group flex items-center gap-2.5 py-1 text-[13px] leading-[1.3] tracking-[-0.01em] text-foreground/50 transition-colors duration-300 hover:text-foreground data-active:text-foreground"
                      >
                        <span
                          className={cn(
                            "h-[1.5px] w-2.5 shrink-0 rounded-full bg-foreground/40 transition-[width,background-color] duration-500 group-hover:bg-foreground/70 group-data-active:w-4 group-data-active:bg-foreground",
                            ease
                          )}
                        />
                        {child.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <BackToTop />
    </div>
  )
}
