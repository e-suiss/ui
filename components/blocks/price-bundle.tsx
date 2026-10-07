"use client"

import {
  CloudIcon,
  FlameIcon,
  GameControllerIcon,
  MusicNoteIcon,
  NewspaperIcon,
  TelevisionIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const services = [
  { name: "suiss Music", icon: MusicNoteIcon, tint: "bg-red text-white" },
  { name: "suiss TV", icon: TelevisionIcon, tint: "bg-label text-surface" },
  { name: "suiss Arcade", icon: GameControllerIcon, tint: "bg-red text-white" },
  { name: "suiss Cloud+", icon: CloudIcon, tint: "bg-blue text-white" },
  { name: "Fitness+", icon: FlameIcon, tint: "bg-green text-white" },
  { name: "News+", icon: NewspaperIcon, tint: "bg-pink text-white" },
]

const plans = [
  {
    name: "Individual",
    price: 19.95,
    people: "1 person",
    storage: "50 GB",
    included: 4,
    saving: 6,
  },
  {
    name: "Family",
    price: 25.95,
    people: "Up to 6 people",
    storage: "200 GB",
    included: 4,
    saving: 8,
  },
  {
    name: "Premier",
    price: 37.95,
    people: "Up to 6 people",
    storage: "2 TB",
    included: 6,
    saving: 29,
  },
] as const

export function PriceBundle() {
  const [selected, setSelected] = React.useState("Family")
  const plan = plans.find((item) => item.name === selected) ?? plans[1]

  return (
    <section className="dark flex flex-col items-center gap-5.5 bg-surface px-5 py-8.5 text-label md:px-9">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          <span className="font-bold">suiss</span> One
        </h1>
        <p className="text-2xl text-balance text-label-secondary">
          Bundle it all in one subscription.
        </p>
      </div>
      <RadioGroup
        value={selected}
        onValueChange={(value) => setSelected(value as string)}
        aria-label="Plan"
        className="grid w-full max-w-215 grid-cols-1 gap-3 md:grid-cols-3"
      >
        {plans.map((item) => (
          <Label
            key={item.name}
            className="flex cursor-pointer flex-col gap-3.5 rounded-[1.25rem] bg-surface-secondary/60 p-5 shadow-[inset_0_0_0_1px_var(--color-separator-strong)] transition-[background-color,box-shadow] duration-300 has-data-checked:bg-surface-secondary has-data-checked:shadow-[inset_0_0_0_2px_var(--color-accent)] has-focus-visible:focus-ring font-normal items-stretch"
          >
            <span className="flex items-center gap-2">
              <span className="flex-1 text-2xl font-semibold">{item.name}</span>
              <span className="text-xs text-label-secondary">
                {item.people}
              </span>
              <RadioGroupItem
                value={item.name}
                aria-label={item.name}
                className="absolute sr-only"
              />
            </span>
            <span>
              <span className="text-2xl font-semibold tabular-nums">
                ${item.price}
              </span>
              <span className="text-sm text-label-secondary"> /mo</span>
            </span>
            <ul className="flex flex-col gap-2">
              {services.map((service, index) => {
                const included = index < item.included
                return (
                  <li
                    key={service.name}
                    data-included={included ? "" : undefined}
                    className="group/service flex items-center gap-2 text-sm text-label-tertiary line-through data-included:text-label data-included:no-underline"
                  >
                    <span
                      className={cn(
                        "flex size-5.5 items-center justify-center rounded-md bg-surface-tertiary text-label-tertiary transition-colors duration-300",
                        included && service.tint
                      )}
                    >
                      <service.icon weight="fill" className="size-3.25" />
                    </span>
                    {service.name}
                    {index === 3 && ` ${item.storage}`}
                    {!included && (
                      <span className="sr-only">(not included)</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </Label>
        ))}
      </RadioGroup>
      <div className="flex flex-wrap items-center justify-center gap-x-4.5 gap-y-3">
        <Button size="lg">Try it free</Button>
        <a href="#compare" className="text-lg text-link hover:underline">
          Save ${plan.saving} compared to buying separately ›
        </a>
      </div>
    </section>
  )
}
