"use client"

import { ArrowUpIcon } from "@phosphor-icons/react"
import { Anchor } from "@/components/anchor"
import { ease } from "@/components/arrow"
import { FitWord } from "@/components/fit-word"
import { cn } from "@/lib/utils"

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10"

type Column = { title: string; links: { label: string; href: string }[] }

export function Footer({
  columns,
  labels,
}: {
  columns: Column[]
  labels: { copyright: string; backToTop: string }
}) {
  return (
    <footer className="dark overflow-hidden bg-background text-foreground dark:border-t dark:border-foreground/15">
      <div
        className={cn(
          frame,
          "grid grid-cols-2 gap-x-6 gap-y-10 py-20 md:grid-cols-4 md:py-28"
        )}
      >
        {columns.map((column) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-xs tracking-[0.02em] text-muted-foreground uppercase">
              {column.title}
            </p>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Anchor
                    href={link.href}
                    className="text-[17px] tracking-[-0.02em] text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Anchor>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div
        className={cn(
          frame,
          "flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-foreground/15 py-6 text-sm text-muted-foreground"
        )}
      >
        <span>{labels.copyright}</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex h-8 items-center gap-2 rounded-full bg-foreground/10 ps-3.5 pe-1 text-foreground outline-none transition-colors hover:bg-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {labels.backToTop}
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
      </div>

      <div aria-hidden className={cn(frame, "mb-[-4.5vw] select-none")}>
        <FitWord className="pe-[0.075em] leading-[0.8] font-semibold tracking-[-0.075em]">
          suiss
        </FitWord>
      </div>
    </footer>
  )
}
