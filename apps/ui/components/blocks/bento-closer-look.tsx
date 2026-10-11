"use client"

import { PlusIcon } from "@phosphor-icons/react"
import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`

type Feature = {
  title: string
  description: string
  image: string
  alt: string
}

const features: [Feature, ...Feature[]] = [
  {
    title: "Camera Control",
    description:
      "A faster way to take photos. Slide to zoom, press lightly to focus.",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
  },
  {
    title: "Fusion camera",
    description:
      "Three rear cameras capture detail at every angle with 48 MP resolution.",
    image: photo("1604677209244-6569d050557a"),
    alt: "A camera lens lit in red and pink",
  },
  {
    title: "Aluminum body",
    description: "A unibody design that spreads heat better and weighs less.",
    image: photo("1664883410931-2edffc8be5e6"),
    alt: "A silver phone on a light grey background",
  },
  {
    title: "New colors",
    description: "Cosmic Orange, Deep Blue and Silver.",
    image: photo("1633596683562-4a47eb4983c5"),
    alt: "Layered orange paper waves",
  },
]

export function BentoCloserLook() {
  const [active, setActive] = React.useState(features[0].title)
  const [auto, setAuto] = React.useState(true)

  React.useEffect(() => {
    if (!auto) return
    const timer = window.setInterval(() => {
      setActive((current) => {
        const index = features.findIndex((item) => item.title === current)
        return features[(index + 1) % features.length]?.title ?? current
      })
    }, 4000)
    return () => window.clearInterval(timer)
  }, [auto])

  return (
    <section className="flex flex-col gap-6 bg-surface-secondary p-5 md:p-8">
      <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
        Take a closer look.
      </h2>
      <div className="grid overflow-hidden rounded-[1.75rem] bg-surface md:min-h-117 md:grid-cols-[minmax(16rem,0.8fr)_1.2fr]">
        <Accordion
          value={[active]}
          onValueChange={(value: string[]) => {
            setAuto(false)
            if (value[0]) setActive(value[0])
          }}
          className="order-2 justify-center gap-1.5 p-4 md:order-1 md:py-7 md:ps-7 md:pe-4.5"
        >
          {features.map((feature) => (
            <AccordionItem
              key={feature.title}
              value={feature.title}
              className="ms-0 rounded-[1.125rem] px-5 not-first:border-t-0 transition-[background-color,padding] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:bg-surface-secondary data-open:py-2 motion-reduce:transition-none"
            >
              <AccordionTrigger className="justify-start gap-2.5 pe-0 text-lg font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-control text-label transition-[rotate,background-color,color] duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] group-aria-expanded/accordion-trigger:rotate-45 group-aria-expanded/accordion-trigger:bg-label group-aria-expanded/accordion-trigger:text-surface motion-reduce:transition-none">
                  <PlusIcon weight="bold" className="size-3.5" />
                </span>
                {feature.title}
              </AccordionTrigger>
              <AccordionContent className="ps-9 pe-0 text-base leading-normal">
                {feature.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="relative order-1 m-4 aspect-4/3 overflow-hidden rounded-[1.25rem] bg-control md:order-2 md:aspect-auto">
          {features.map((feature) => (
            <img
              key={feature.title}
              src={feature.image}
              alt={feature.alt}
              aria-hidden={feature.title !== active}
              data-active={feature.title === active ? "" : undefined}
              className="absolute inset-0 size-full scale-104 object-cover opacity-0 transition-[opacity,scale] duration-[700ms,1200ms] ease-[ease,cubic-bezier(0.32,0.72,0,1)] data-active:scale-100 data-active:opacity-100 motion-reduce:transition-none"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
