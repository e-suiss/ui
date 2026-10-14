"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`

type Finish = { label: string; color: string }

const models: {
  name: string
  tagline: string
  price: string
  kicker?: string
  image: string
  alt: string
  finishes: [Finish, ...Finish[]]
}[] = [
  {
    name: "Phone Pro",
    tagline: "Pro at its very core.",
    price: "$1,099",
    kicker: "New",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
    finishes: [
      { label: "Cosmic Orange", color: "oklch(0.68 0.16 50)" },
      { label: "Deep Blue", color: "oklch(0.38 0.07 262)" },
      { label: "Silver", color: "oklch(0.9 0.006 260)" },
    ],
  },
  {
    name: "Phone Air",
    tagline: "The thinnest phone ever.",
    price: "$999",
    kicker: "New",
    image: photo("1664883410931-2edffc8be5e6"),
    alt: "A silver phone on a light grey background",
    finishes: [
      { label: "Sky Blue", color: "oklch(0.92 0.01 230)" },
      { label: "Light Gold", color: "oklch(0.86 0.04 80)" },
      { label: "Space Black", color: "oklch(0.3 0.01 260)" },
    ],
  },
  {
    name: "Phone",
    tagline: "Better in every way.",
    price: "$799",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
    finishes: [
      { label: "Lavender", color: "oklch(0.82 0.06 290)" },
      { label: "Sage", color: "oklch(0.85 0.07 160)" },
      { label: "Mist Blue", color: "oklch(0.88 0.04 240)" },
      { label: "Black", color: "oklch(0.3 0.01 260)" },
    ],
  },
  {
    name: "Phone e",
    tagline: "Speed. Battery. Value.",
    price: "$599",
    image: photo("1703676311066-34caf2cbee33"),
    alt: "A phone on a pink and purple backdrop",
    finishes: [
      { label: "Black", color: "oklch(0.3 0.01 260)" },
      { label: "White", color: "oklch(0.97 0 0)" },
    ],
  },
]

function LineupModel({ model }: { model: (typeof models)[number] }) {
  const [finish, setFinish] = React.useState(model.finishes[0].label)

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={model.image}
        alt={model.alt}
        className="aspect-[0.85] w-full rounded-2xl bg-control object-cover"
      />
      <ToggleGroup
        value={[finish]}
        onValueChange={(value: string[]) => {
          if (value[0]) setFinish(value[0])
        }}
        aria-label={`${model.name} finish`}
        spacing={2}
        className="mt-5.5"
      >
        {model.finishes.map((item) => (
          <ToggleGroupItem
            key={item.label}
            value={item.label}
            aria-label={item.label}
            style={{ "--swatch": item.color } as React.CSSProperties}
            className="relative size-3 min-w-0 rounded-full bg-(--swatch) p-0 shadow-[inset_0_0_0_1px_--alpha(var(--color-label)/15%)] transition-shadow duration-200 after:absolute after:-inset-2 after:content-[''] hover:bg-(--swatch) aria-pressed:bg-(--swatch) aria-pressed:ring-[1.5px] aria-pressed:ring-label-secondary aria-pressed:ring-offset-[1.5px] aria-pressed:ring-offset-surface aria-pressed:hover:bg-(--swatch)"
          />
        ))}
      </ToggleGroup>
      <span className="mt-4.5 min-h-4 text-xs font-semibold text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] dark:text-orange">
        {model.kicker}
      </span>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">
        {model.name}
      </h3>
      <p className="mt-2 min-h-[2lh] text-lg leading-snug text-balance">
        {model.tagline}
      </p>
      <p className="mt-2 text-sm text-label-secondary">From {model.price}</p>
      <div className="mt-4.5 flex flex-wrap items-center justify-center gap-x-4.5 gap-y-3">
        <Button size="sm">Buy</Button>
        <a href="#learn" className="text-sm text-link hover:underline">
          Learn more ›
        </a>
      </div>
    </div>
  )
}

export function GridLineup() {
  return (
    <section className="bg-surface px-5 py-10 md:px-10">
      <h2 className="mb-9 text-center text-4xl font-semibold tracking-tight text-balance md:text-5xl">
        Which phone is right for you?
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
        {models.map((model) => (
          <LineupModel key={model.name} model={model} />
        ))}
      </div>
    </section>
  )
}
