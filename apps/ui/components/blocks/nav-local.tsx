"use client"

import * as React from "react"

import { Navbar } from "@/components/patterns/navbar"
import { Button } from "@/components/ui/button"

const images = {
  hero: "https://images.unsplash.com/photo-1714972384975-fbd4f19b1bb3?w=1600&q=80&auto=format&fit=crop",
  detail:
    "https://images.unsplash.com/photo-1695083691065-4f77dfd0f0d5?w=1600&q=80&auto=format&fit=crop",
}

type Section = { id: string; label: string }

const sections: [Section, ...Section[]] = [
  { id: "overview", label: "Overview" },
  { id: "why", label: "Why suiss" },
  { id: "specs", label: "Tech Specs" },
]

const highlights = [
  { value: "S19 Pro", text: "The fastest chip ever in a phone." },
  { value: "48 MP", text: "Fusion resolution across all three cameras." },
  { value: "33 hours", text: "The longest video playback yet." },
]

const SCROLL_THRESHOLD = 8

export function NavLocal() {
  const [scrolled, setScrolled] = React.useState(false)
  const [active, setActive] = React.useState(sections[0].id)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )
    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="dark bg-surface text-label">
      <Navbar
        data-scrolled={scrolled ? "" : undefined}
        items={sections.map((section) => ({
          label: section.label,
          href: `#${section.id}`,
          active: section.id === active,
        }))}
        brand={
          <span className="text-xl font-semibold tracking-tight">
            Phone Pro
          </span>
        }
        actions={
          <Button size="sm" className="h-7 px-3 text-xs">
            Buy
          </Button>
        }
        className="sticky top-0 z-10 h-13 border-b border-label/18 transition-[background-color,border-color] duration-300 data-scrolled:border-label/12 data-scrolled:bg-surface-secondary/80 data-scrolled:backdrop-blur-xl data-scrolled:backdrop-saturate-180 md:px-[max(--spacing(5),calc((100%-62.5rem)/2))] [&_[data-slot=navigation-menu]]:me-0 [&_[data-slot=navigation-menu]]:ms-auto [&_[data-slot=navigation-menu-link]]:relative [&_[data-slot=navigation-menu-link]]:h-13 [&_[data-slot=navigation-menu-link]]:rounded-none [&_[data-slot=navigation-menu-link]]:px-3 [&_[data-slot=navigation-menu-link]]:text-xs [&_[data-slot=navigation-menu-link]]:text-label-secondary [&_[data-slot=navigation-menu-link]]:hover:bg-transparent [&_[data-slot=navigation-menu-link]]:hover:text-label [&_[data-slot=navigation-menu-link]]:data-active:bg-transparent [&_[data-slot=navigation-menu-link]]:data-active:text-label [&_[data-slot=navigation-menu-link]]:data-active:after:absolute [&_[data-slot=navigation-menu-link]]:data-active:after:inset-x-3 [&_[data-slot=navigation-menu-link]]:data-active:after:-bottom-px [&_[data-slot=navigation-menu-link]]:data-active:after:h-px [&_[data-slot=navigation-menu-link]]:data-active:after:bg-label"
      />
      <section
        id="overview"
        className="flex flex-col items-center px-6 pt-14 pb-6 text-center"
      >
        <p className="mb-2 text-sm text-label-secondary">New</p>
        <h1 className="text-5xl font-semibold tracking-tight text-balance md:text-6xl">
          Pro power.
        </h1>
        <p className="mt-2 text-2xl text-balance text-label-secondary">
          The most advanced phone yet.
        </p>
      </section>
      <img
        src={images.hero}
        alt="An orange phone on a gradient background"
        className="mx-auto h-90 w-[calc(100%-2.5rem)] max-w-5xl rounded-[1.375rem] bg-control object-cover md:w-[calc(100%-5rem)]"
      />
      <section
        id="why"
        className="mx-auto grid max-w-5xl gap-3.5 px-5 py-10 sm:grid-cols-3 md:px-10"
      >
        {highlights.map((item) => (
          <div
            key={item.value}
            className="rounded-[1.125rem] bg-surface-secondary p-5.5"
          >
            <p className="text-3xl font-semibold tabular-nums">{item.value}</p>
            <p className="mt-1.5 text-base text-label-secondary">{item.text}</p>
          </div>
        ))}
      </section>
      <section id="specs" className="px-5 pb-10 md:px-10">
        <img
          src={images.detail}
          alt="A close look at a camera lens"
          className="mx-auto h-80 w-full max-w-5xl rounded-[1.375rem] bg-control object-cover"
        />
      </section>
    </div>
  )
}
