"use client"

import { HandbagIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"

import { Navbar, type NavbarItem } from "@/components/patterns/navbar"
import { Button } from "@/components/ui/button"

const image =
  "https://images.unsplash.com/photo-1644792863360-40fa85ea52e7?w=1600&q=80&auto=format&fit=crop"

const items: NavbarItem[] = [
  { label: "Store", href: "#store" },
  {
    label: "Laptop",
    columns: [
      {
        label: "Explore laptops",
        featured: true,
        links: [
          { label: "Book Air", href: "#book-air" },
          { label: "Book Pro", href: "#book-pro" },
          { label: "Desk", href: "#desk" },
          { label: "Mini", href: "#mini" },
          { label: "Studio", href: "#studio" },
        ],
      },
      {
        label: "Shop laptops",
        links: [
          { label: "Buy a laptop", href: "#buy-laptop" },
          { label: "Laptop accessories", href: "#laptop-accessories" },
          { label: "Education pricing", href: "#education" },
        ],
      },
      {
        label: "More from laptops",
        links: [
          { label: "Laptop support", href: "#laptop-support" },
          { label: "What's new", href: "#laptop-new" },
          { label: "Switch to suiss", href: "#switch" },
        ],
      },
    ],
  },
  { label: "Pad", href: "#pad" },
  {
    label: "Phone",
    columns: [
      {
        label: "Explore phones",
        featured: true,
        links: [
          { label: "Phone Pro", href: "#phone-pro" },
          { label: "Phone Air", href: "#phone-air" },
          { label: "Phone", href: "#phone" },
          { label: "Phone Lite", href: "#phone-lite" },
          { label: "Compare models", href: "#compare" },
        ],
      },
      {
        label: "Shop phones",
        links: [
          { label: "Buy a phone", href: "#buy-phone" },
          { label: "Phone accessories", href: "#phone-accessories" },
          { label: "Trade in", href: "#trade-in" },
        ],
      },
      {
        label: "More from phones",
        links: [
          { label: "Phone support", href: "#phone-support" },
          { label: "suiss Care", href: "#care" },
          { label: "What's new", href: "#phone-new" },
        ],
      },
    ],
  },
  {
    label: "Watch",
    columns: [
      {
        label: "Explore watches",
        featured: true,
        links: [
          { label: "Watch Series", href: "#watch-series" },
          { label: "Watch Ultra", href: "#watch-ultra" },
          { label: "Watch SE", href: "#watch-se" },
        ],
      },
      {
        label: "Shop watches",
        links: [
          { label: "Buy a watch", href: "#buy-watch" },
          { label: "Bands", href: "#bands" },
        ],
      },
      {
        label: "More from watches",
        links: [
          { label: "Watch support", href: "#watch-support" },
          { label: "What's new", href: "#watch-new" },
        ],
      },
    ],
  },
  { label: "Vision", href: "#vision" },
  { label: "Pods", href: "#pods" },
  { label: "TV & Home", href: "#tv" },
  { label: "Entertainment", href: "#entertainment" },
  { label: "Accessories", href: "#accessories" },
  { label: "Support", href: "#support" },
]

export function NavGlobal() {
  return (
    <div className="relative min-h-140 bg-surface-secondary">
      <Navbar
        layout="panel"
        items={items}
        brand={
          <a
            href="#home"
            className="rounded-sm text-sm font-semibold tracking-tight outline-none focus-visible:focus-ring"
          >
            suiss
          </a>
        }
        actions={
          <>
            <Button variant="ghost" size="icon-sm" aria-label="Search">
              <MagnifyingGlassIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Shopping bag">
              <HandbagIcon />
            </Button>
          </>
        }
        className="sticky top-0 h-11 bg-surface/80 backdrop-blur-xl backdrop-saturate-180 transition-colors duration-300 has-data-popup-open:bg-surface md:px-[max(--spacing(5),calc((100%-62.5rem)/2))] [&_[data-slot=navigation-menu-link]]:h-11 [&_[data-slot=navigation-menu-link]]:rounded-sm [&_[data-slot=navigation-menu-link]]:px-2 [&_[data-slot=navigation-menu-link]]:text-xs [&_[data-slot=navigation-menu-link]]:text-label/80 [&_[data-slot=navigation-menu-link]]:hover:bg-transparent [&_[data-slot=navigation-menu-link]]:hover:text-label [&_[data-slot=navigation-menu-trigger]]:h-11 [&_[data-slot=navigation-menu-trigger]]:rounded-sm [&_[data-slot=navigation-menu-trigger]]:px-2 [&_[data-slot=navigation-menu-trigger]]:text-xs [&_[data-slot=navigation-menu-trigger]]:text-label/80 [&_[data-slot=navigation-menu-trigger]]:hover:bg-transparent [&_[data-slot=navigation-menu-trigger]]:hover:text-label [&_[data-slot=navigation-menu-trigger]]:data-popup-open:bg-transparent [&_[data-slot=navigation-menu-trigger]]:data-popup-open:text-label [&_[data-slot=navigation-menu-trigger]>svg]:hidden"
      />
      <section className="flex flex-col items-center px-6 pt-10 pb-12 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-balance">
          Book Air
        </h1>
        <p className="mt-1.5 text-2xl text-balance">So thin. So capable.</p>
        <img
          src={image}
          alt="A laptop on a wooden desk"
          className="mt-7 aspect-[1.7] w-full max-w-160 rounded-[1.125rem] bg-control object-cover md:w-[70%]"
        />
      </section>
    </div>
  )
}
