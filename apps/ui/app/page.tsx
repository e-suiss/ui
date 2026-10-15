import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr"
import { cn } from "cn"
import type { Metadata } from "next"
import type * as React from "react"

import { Anchor } from "@/components/site/anchor"
import { Bento } from "@/components/site/bento"
import { InstallCommand } from "@/components/site/install-command"
import { Search } from "@/components/site/search"
import { strings } from "@/lib/strings"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10"
const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]"

const collections = [
  {
    title: "Components",
    href: "/docs/components",
    description:
      "From buttons and fields to sheets, keypads and dialogs, on every platform.",
  },
  {
    title: "Patterns",
    href: "/docs/patterns",
    description:
      "Components composed into flows that adapt between desktop and mobile.",
  },
  {
    title: "Interactions",
    href: "/docs/interactions",
    description:
      "Swipe actions, pull to refresh, undo and the small moments in between.",
  },
  {
    title: "Charts",
    href: "/docs/charts",
    description:
      "Area, bar, line, pie, radar and radial charts styled by your theme.",
  },
  {
    title: "Blocks",
    href: "/docs/blocks",
    description:
      "Complete screens, from checkout and inbox to dashboards and settings.",
  },
]

function Label({
  index,
  children,
}: {
  index: string
  children: React.ReactNode
}) {
  return (
    <p className="font-mono text-xs tracking-[0.02em] text-muted-foreground uppercase">
      ({index}) {children}
    </p>
  )
}

const grain = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 -0.2"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}")`

function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden text-[#1d1d1f]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[#dbba95] bg-[radial-gradient(circle_at_18%_22%,#ff5005_0%,#dbba95_48%,#d0bce1_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-45 mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />
      <div
        className={cn(
          frame,
          "relative flex flex-col gap-10 pt-60 pb-12 md:pt-[26rem] md:pb-16"
        )}
      >
        <div className="flex max-w-6xl flex-col gap-6">
          <h1 className="text-[clamp(3rem,8vw,8rem)] leading-[0.88] font-semibold tracking-[-0.055em] text-balance">
            Copy-paste components for web and mobile.
          </h1>
          <p className="max-w-2xl text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.38] tracking-[-0.02em] text-pretty text-[#1d1d1f]/70">
            {strings.heroLead}
          </p>
        </div>
        <Search
          variant="field"
          className="h-14 w-full rounded-full bg-white/45 px-5 md:max-w-2xl text-[17px] tracking-[-0.02em] text-[#1d1d1f]/70 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 hover:bg-white/60 md:h-16 md:px-6"
        />
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section
      className={cn(frame, "grid gap-10 py-24 md:grid-cols-[1fr_3fr] md:py-36")}
    >
      <Label index="01">Approach</Label>
      <p className="text-[clamp(2rem,4.4vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.045em] text-balance">
        Components you own.{" "}
        <span className="text-muted-foreground">
          Copy them into your project and change anything you like.
        </span>{" "}
        For React, React Native, SwiftUI and Jetpack Compose.{" "}
        <span className="text-muted-foreground">
          One design, accessible, themeable and open source.
        </span>
      </p>
    </section>
  )
}

function Interface() {
  return (
    <section className="pb-32 md:pb-48">
      <div
        className={cn(
          frame,
          "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]"
        )}
      >
        <Label index="02">Interface</Label>
        <div className="flex flex-col gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            Every piece is live.
          </h2>
          <p className="max-w-md text-[clamp(1.0625rem,1.4vw,1.3125rem)] leading-[1.35] tracking-[-0.02em] text-muted-foreground">
            No screenshots. These are the React components themselves, running
            on this page. Try them.
          </p>
        </div>
      </div>

      <div className={frame}>
        <Bento />
      </div>

      <div className={frame}>
        <div className="mt-20 md:mt-28">
          <p className="mb-6 font-mono text-xs tracking-[0.02em] text-muted-foreground uppercase">
            Start in one line
          </p>
          <InstallCommand command="npx @esuiss/ui@latest init" />
        </div>
      </div>
    </section>
  )
}

function Library() {
  return (
    <section className="pb-32 md:pb-48">
      <div
        className={cn(
          frame,
          "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]"
        )}
      >
        <Label index="03">Library</Label>
        <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
          Five collections.{" "}
          <span className="text-muted-foreground">One design language.</span>
        </h2>
      </div>
      <ul className={cn(frame, "flex flex-col")}>
        {collections.map((collection, index) => (
          <li
            key={collection.href}
            className="border-t border-foreground/15 last:border-b"
          >
            <Anchor
              href={collection.href}
              className="group grid items-center gap-4 py-8 outline-none focus-visible:focus-ring md:grid-cols-[1fr_3fr] md:gap-6 md:py-10"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center justify-between gap-6">
                <span className="flex flex-col gap-3">
                  <span
                    className={cn(
                      "text-[clamp(2rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.045em] transition-transform duration-700 group-hover:translate-x-2",
                      ease
                    )}
                  >
                    {collection.title}
                  </span>
                  <span className="max-w-xl text-[17px] leading-[1.4] tracking-[-0.02em] text-muted-foreground">
                    {collection.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "hidden size-12 items-center justify-center rounded-full border border-foreground/15 transition-colors duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background md:flex",
                    ease
                  )}
                >
                  <ArrowUpRightIcon className="size-4" />
                </span>
              </span>
            </Anchor>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Interface />
      <Library />
    </main>
  )
}
