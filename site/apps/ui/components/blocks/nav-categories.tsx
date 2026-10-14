"use client"

import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Toggle } from "@/components/ui/toggle"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`

const categories = [
  { label: "Laptop", image: photo("1785245560368-f6d715956e5d") },
  { label: "Phone", image: photo("1714578187196-29775454aa39") },
  { label: "Pad", image: photo("1607452263110-39a87c399c50") },
  { label: "Watch", image: photo("1660844817855-3ecc7ef21f12") },
  { label: "Pods", image: photo("1599669454699-248893623440") },
  { label: "Cases", image: photo("1703676311066-34caf2cbee33") },
  { label: "Camera", image: photo("1604677209244-6569d050557a") },
  { label: "Colors", image: photo("1633596683562-4a47eb4983c5") },
  { label: "Pro", image: photo("1760978631841-f3754859ca59") },
  { label: "Accessories", image: photo("1645323927877-3de25b4f819c") },
]

export function NavCategories() {
  const [selected, setSelected] = React.useState("Phone")

  return (
    <section className="flex flex-col gap-7 bg-surface pt-11 pb-10">
      <div className="flex flex-wrap items-end gap-6 px-6 md:px-12">
        <div className="flex min-w-60 flex-1 flex-col gap-1">
          <h1 className="text-5xl font-semibold tracking-tight">Store.</h1>
          <p className="text-2xl text-balance text-label-secondary">
            The best way to buy the suiss products you love.
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5 text-xs">
          <span className="font-semibold text-label-secondary">
            Need shopping help?
          </span>
          <a href="#specialist" className="text-link hover:underline">
            Ask a Specialist ›
          </a>
          <a href="#stores" className="text-link hover:underline">
            Visit a suiss Store near you ›
          </a>
        </div>
      </div>
      <Carousel
        opts={{ align: "start", dragFree: true }}
        aria-label="Categories"
        className="flex flex-col gap-3"
      >
        <CarouselContent className="ms-0 gap-5.5 px-6 py-2 md:px-12">
          {categories.map((category) => {
            const pressed = selected === category.label
            return (
              <CarouselItem key={category.label} className="basis-auto ps-0">
                <Toggle
                  pressed={pressed}
                  onPressedChange={() => setSelected(category.label)}
                  className="group/category h-auto flex-col gap-2.5 rounded-xl p-0 hover:bg-transparent aria-pressed:bg-transparent aria-pressed:hover:bg-transparent"
                >
                  <img
                    src={category.image}
                    alt=""
                    className="h-19.5 w-30 rounded-[0.875rem] bg-control object-cover transition-[translate,box-shadow] duration-350 ease-[cubic-bezier(0.3,1.25,0.5,1)] group-aria-pressed/category:-translate-y-0.5 group-aria-pressed/category:ring-2 group-aria-pressed/category:ring-accent"
                  />
                  <span className="text-sm font-semibold text-label group-aria-pressed/category:text-link">
                    {category.label}
                  </span>
                </Toggle>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <div className="flex justify-end gap-3 px-6 md:px-12">
          <CarouselPrevious
            variant="secondary"
            size="icon"
            className="static inset-auto my-0"
          />
          <CarouselNext
            variant="secondary"
            size="icon"
            className="static inset-auto my-0"
          />
        </div>
      </Carousel>
      <div className="mx-6 border-t border-separator pt-5.5 md:mx-12">
        <p className="text-2xl font-semibold tracking-tight text-balance">
          The latest.{" "}
          <span className="text-label-secondary">
            Take a look at what's new in {selected}.
          </span>
        </p>
      </div>
    </section>
  )
}
