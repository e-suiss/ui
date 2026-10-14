"use client"

import { CheckIcon, HandbagIcon, PlusIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=500&q=80&auto=format&fit=crop`

const filters = ["All", "Audio", "Cases", "Bands", "Pad"]

const accessories = [
  {
    name: "Pods Studio Headphones",
    category: "Audio",
    price: "$549",
    image: photo("1599669454699-248893623440"),
  },
  {
    name: "Phone Pro Clear Case",
    category: "Cases",
    price: "$49",
    image: photo("1703676311066-34caf2cbee33"),
  },
  {
    name: "Sport Band",
    category: "Bands",
    price: "$49",
    image: photo("1624096104992-9b4fa3a279dd"),
  },
  {
    name: "Keyboard Folio for Pad",
    category: "Pad",
    price: "$299",
    image: photo("1740637977676-c8040b41dc7a"),
  },
  {
    name: "Pods Sage Headphones",
    category: "Audio",
    price: "$349",
    image: photo("1693621947585-7b7d94149af4"),
  },
  {
    name: "Phone Silicone Case",
    category: "Cases",
    price: "$49",
    image: photo("1714578187196-29775454aa39"),
  },
  {
    name: "Solo Loop",
    category: "Bands",
    price: "$49",
    image: photo("1660844817855-3ecc7ef21f12"),
  },
  {
    name: "Pencil Pro",
    category: "Pad",
    price: "$129",
    image: photo("1625864667534-aa5208d45a87"),
  },
]

export function GridAccessories() {
  const [filter, setFilter] = React.useState("All")
  const [bag, setBag] = React.useState<string[]>([])
  const items = accessories.filter(
    (item) => filter === "All" || item.category === filter
  )

  return (
    <section className="flex flex-col gap-6 bg-surface px-5 py-9 md:px-10">
      <div className="flex items-start gap-4">
        <div className="flex flex-1 flex-col gap-0.5">
          <h2 className="text-4xl font-semibold tracking-tight">Accessories</h2>
          <p className="text-base text-label-secondary">
            Designed for every suiss device.
          </p>
        </div>
        <span
          role="status"
          aria-label={`${bag.length} items in bag`}
          className="relative mt-2 flex"
        >
          <HandbagIcon className="size-5.5" />
          {bag.length > 0 && (
            <span className="absolute -end-2 -bottom-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-label px-1 text-2xs font-semibold text-surface tabular-nums transition-[scale] duration-300 ease-[cubic-bezier(0.3,1.25,0.5,1)] starting:scale-0">
              {bag.length}
            </span>
          )}
        </span>
      </div>
      <ToggleGroup
        value={[filter]}
        onValueChange={(value: string[]) => {
          if (value[0]) setFilter(value[0])
        }}
        aria-label="Category"
        className="flex-wrap"
      >
        {filters.map((item) => (
          <ToggleGroupItem
            key={item}
            value={item}
            className="h-8.5 bg-control px-4 transition-[background-color,color] duration-200 hover:bg-control-hover aria-pressed:bg-label aria-pressed:text-surface aria-pressed:hover:bg-label aria-pressed:hover:text-surface"
          >
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-[repeat(auto-fill,minmax(12.5rem,1fr))] md:gap-5">
        {items.map((item) => {
          const inBag = bag.includes(item.name)
          return (
            <li
              key={`${filter}-${item.name}`}
              className="flex flex-col transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2.5 starting:opacity-0 motion-reduce:transition-none"
            >
              <img
                src={item.image}
                alt=""
                className="aspect-square w-full rounded-2xl bg-surface-secondary object-cover"
              />
              <span className="mt-3 min-h-10 text-base leading-tight font-semibold">
                {item.name}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="flex-1 text-base">{item.price}</span>
                <Button
                  size="icon-sm"
                  data-in-bag={inBag ? "" : undefined}
                  aria-label={
                    inBag
                      ? `Remove ${item.name} from bag`
                      : `Add ${item.name} to bag`
                  }
                  aria-pressed={inBag}
                  onClick={() =>
                    setBag((current) =>
                      inBag
                        ? current.filter((name) => name !== item.name)
                        : [...current, item.name]
                    )
                  }
                  className="relative h-7.5 w-7.5 gap-1 overflow-hidden text-xs transition-[width,padding,background-color] duration-300 ease-[cubic-bezier(0.3,1.25,0.5,1)] after:absolute after:-inset-1.75 after:content-[''] data-in-bag:w-21 data-in-bag:bg-[color-mix(in_oklab,var(--green),var(--label)_40%)] data-in-bag:px-3 data-in-bag:hover:bg-[color-mix(in_oklab,var(--green),var(--label)_50%)] motion-reduce:transition-none dark:data-in-bag:bg-[color-mix(in_oklab,var(--green),black_45%)] dark:data-in-bag:hover:bg-[color-mix(in_oklab,var(--green),black_55%)]"
                >
                  {inBag ? (
                    <CheckIcon weight="bold" className="size-3.75" />
                  ) : (
                    <PlusIcon weight="bold" className="size-3.75" />
                  )}
                  {inBag && <span aria-hidden>In bag</span>}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
