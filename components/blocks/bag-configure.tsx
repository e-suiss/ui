"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`

type Model = { name: string; price: number }

type Finish = { name: string; color: string; image: string; alt: string }

type StorageOption = { size: string; extra: number }

const models: [Model, ...Model[]] = [
  { name: "Phone Pro", price: 1099 },
  { name: "Phone Pro Max", price: 1199 },
]

const finishes: [Finish, ...Finish[]] = [
  {
    name: "Cosmic Orange",
    color: "oklch(0.68 0.16 50)",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
  },
  {
    name: "Deep Blue",
    color: "oklch(0.38 0.07 262)",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
  },
  {
    name: "Silver",
    color: "oklch(0.9 0.006 260)",
    image: photo("1664883410931-2edffc8be5e6"),
    alt: "A silver phone on a light grey background",
  },
]

const storage: [StorageOption, ...StorageOption[]] = [
  { size: "256 GB", extra: 0 },
  { size: "512 GB", extra: 200 },
  { size: "1 TB", extra: 400 },
]

const choiceClass =
  "cursor-pointer rounded-[0.875rem] font-normal shadow-[inset_0_0_0_1px_var(--color-separator-strong)] transition-shadow duration-200 has-data-checked:shadow-[inset_0_0_0_2px_var(--color-accent)] has-focus-visible:focus-ring"

const money = (value: number, digits = 2) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })

export function BagConfigure() {
  const [model, setModel] = React.useState(models[0].name)
  const [finish, setFinish] = React.useState(finishes[0].name)
  const [size, setSize] = React.useState(storage[0].size)
  const [added, setAdded] = React.useState(false)
  const price =
    (models.find((item) => item.name === model)?.price ?? 0) +
    (storage.find((item) => item.size === size)?.extra ?? 0)

  return (
    <section className="grid min-h-160 bg-surface md:grid-cols-[minmax(0,1.3fr)_minmax(18.75rem,1fr)]">
      <div className="relative m-5 aspect-4/3 overflow-hidden rounded-[1.375rem] bg-surface-secondary md:aspect-auto">
        {finishes.map((item) => (
          <img
            key={item.name}
            src={item.image}
            alt={item.alt}
            aria-hidden={item.name !== finish}
            data-active={item.name === finish ? "" : undefined}
            className="absolute inset-0 size-full scale-104 object-cover opacity-0 transition-[opacity,scale] duration-[600ms,900ms] ease-[ease,cubic-bezier(0.32,0.72,0,1)] data-active:scale-100 data-active:opacity-100 motion-reduce:transition-none"
          />
        ))}
      </div>
      <div className="flex flex-col gap-4 px-5 pb-6 md:py-6.5 md:ps-2 md:pe-7">
        <p className="text-xs font-semibold text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] dark:text-orange">
          New
        </p>
        <h1 className="-mt-2.5 text-4xl font-semibold tracking-tight">
          Buy Phone Pro
        </h1>
        <p className="text-lg font-semibold">
          Model.{" "}
          <span className="text-label-secondary">
            Which one is right for you?
          </span>
        </p>
        <RadioGroup
          value={model}
          onValueChange={(value) => {
            setModel(value as string)
            setAdded(false)
          }}
          aria-label="Model"
          className="gap-2"
        >
          {models.map((item) => (
            <Label
              key={item.name}
              className={`${choiceClass} flex items-center justify-between gap-0 px-4 py-3.5`}
            >
              <RadioGroupItem value={item.name} className="absolute sr-only" />
              <span className="flex-1 text-base font-semibold">
                {item.name}
              </span>
              <span className="text-sm text-label-secondary">
                From {money(item.price, 0)}
              </span>
            </Label>
          ))}
        </RadioGroup>
        <p className="text-lg font-semibold">
          Finish. <span className="text-label-secondary">{finish}</span>
        </p>
        <ToggleGroup
          value={[finish]}
          onValueChange={(value: string[]) => {
            if (value[0]) setFinish(value[0])
          }}
          aria-label="Finish"
          spacing={3.5}
        >
          {finishes.map((item) => (
            <ToggleGroupItem
              key={item.name}
              value={item.name}
              aria-label={item.name}
              style={{ "--swatch": item.color } as React.CSSProperties}
              className="size-7.5 min-w-0 rounded-full bg-(--swatch) p-0 shadow-[inset_0_0_0_1px_--alpha(var(--color-label)/15%)] transition-shadow duration-200 hover:bg-(--swatch) aria-pressed:bg-(--swatch) aria-pressed:ring-2 aria-pressed:ring-accent aria-pressed:ring-offset-2 aria-pressed:ring-offset-surface aria-pressed:hover:bg-(--swatch)"
            />
          ))}
        </ToggleGroup>
        <p className="text-lg font-semibold">Storage.</p>
        <RadioGroup
          value={size}
          onValueChange={(value) => {
            setSize(value as string)
            setAdded(false)
          }}
          aria-label="Storage"
          className="grid grid-cols-3 gap-2"
        >
          {storage.map((item) => (
            <Label
              key={item.size}
              className={`${choiceClass} flex flex-col items-center gap-0.5 px-1.5 py-3`}
            >
              <RadioGroupItem value={item.size} className="absolute sr-only" />
              <span className="text-base font-semibold whitespace-nowrap">
                {item.size}
              </span>
              <span className="text-2xs whitespace-nowrap text-label-secondary">
                {item.extra ? `+${money(item.extra, 0)}` : "Included"}
              </span>
            </Label>
          ))}
        </RadioGroup>
        <div className="sticky bottom-0 mt-auto flex items-center gap-3 border-t border-separator bg-surface pt-3.5">
          <div className="flex flex-1 flex-col" aria-live="polite">
            <span className="text-2xl font-semibold tabular-nums">
              {money(price)}
            </span>
            <span className="text-xs text-label-secondary">
              or {money(price / 12)}/mo. for 12 mo.
            </span>
          </div>
          <Button size="lg" onClick={() => setAdded(true)}>
            {added ? "Added to Bag" : "Add to Bag"}
          </Button>
        </div>
      </div>
    </section>
  )
}
