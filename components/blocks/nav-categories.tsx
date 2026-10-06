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
  { label: "Laptop", image: photo("1504198070170-4ca53bb1c1fa") },
  { label: "Phone", image: photo("1726587912121-ea21fcc57ff8") },
  { label: "Pad", image: photo("1759588073186-1d4ac7e33623") },
  { label: "Watch", image: photo("1644653005289-78b8312f9cc5") },
  { label: "Pods", image: photo("1609692814858-f7cd2f0afa4f") },
  { label: "Cases", image: photo("1736173155811-e8142fd553ee") },
  { label: "Camera", image: photo("1759588071838-d560be56b2a2") },
  { label: "Colors", image: photo("1616410011236-7a42121dd981") },
  { label: "Pro", image: photo("1592750475338-74b7b21085ab") },
  { label: "Accessories", image: photo("1757709608566-4b9fd41a7af5") },
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
