"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`

type CareOption = { label: string; price: number; theft?: number }

type Device = {
  name: string
  image: string
  alt: string
  options: [CareOption, ...CareOption[]]
}

const devices: [Device, ...Device[]] = [
  {
    name: "Phone Pro",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
    options: [
      { label: "Annual", price: 99.99, theft: 50 },
      { label: "Monthly", price: 9.99, theft: 5 },
    ],
  },
  {
    name: "Book Air",
    image: photo("1644792863360-40fa85ea52e7"),
    alt: "A laptop on a wooden sideboard",
    options: [
      { label: "3-year", price: 279 },
      { label: "Annual", price: 99.99 },
    ],
  },
  {
    name: "Watch",
    image: photo("1660844817855-3ecc7ef21f12"),
    alt: "A smartwatch with a white band",
    options: [
      { label: "2-year", price: 79 },
      { label: "Monthly", price: 3.99 },
    ],
  },
]

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" })

export function PriceCare() {
  const [device, setDevice] = React.useState(devices[0].name)
  const [option, setOption] = React.useState(devices[0].options[0].label)
  const [theft, setTheft] = React.useState(false)
  const current = devices.find((item) => item.name === device) ?? devices[0]
  const plan =
    current.options.find((item) => item.label === option) ?? current.options[0]
  const total = plan.price + (theft ? (plan.theft ?? 0) : 0)

  return (
    <section className="grid min-h-145 bg-surface md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="relative flex min-h-80 flex-col justify-end gap-1.5 overflow-hidden bg-surface-secondary p-7">
        {devices.map((item) => (
          <img
            key={item.name}
            src={item.image}
            alt={item.alt}
            aria-hidden={item.name !== device}
            data-active={item.name === device ? "" : undefined}
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-600 data-active:opacity-100 motion-reduce:transition-none"
          />
        ))}
        <span className="absolute inset-0 bg-linear-to-b from-transparent from-45% to-black/70" />
        <p className="relative text-base font-semibold text-white">
          suiss Care+
        </p>
        <p className="relative text-3xl leading-tight font-semibold tracking-tight text-white">
          Protection against accidents.
        </p>
      </div>
      <div className="flex flex-col gap-4.5 px-5 py-7.5 md:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Choose your device.
        </h2>
        <ToggleGroup
          value={[device]}
          onValueChange={(value: string[]) => {
            const next = devices.find((item) => item.name === value[0])
            if (!next) return
            setDevice(next.name)
            setOption(next.options[0].label)
          }}
          aria-label="Device"
          className="flex-wrap"
        >
          {devices.map((item) => (
            <ToggleGroupItem
              key={item.name}
              value={item.name}
              className="bg-control px-3.5 hover:bg-control-hover aria-pressed:bg-label aria-pressed:text-surface aria-pressed:hover:bg-label aria-pressed:hover:text-surface"
            >
              {item.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <RadioGroup
          key={device}
          value={option}
          onValueChange={(value) => setOption(value as string)}
          aria-label="Payment"
          className="gap-2.5"
        >
          {current.options.map((item) => (
            <Label
              key={item.label}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--color-separator-strong)] transition-shadow duration-200 has-data-checked:shadow-[inset_0_0_0_2px_var(--color-accent)] has-focus-visible:focus-ring font-normal"
            >
              <RadioGroupItem
                value={item.label}
                className="size-5 [--focus-ring-width:0px]"
              />
              <span className="flex flex-1 flex-col gap-px">
                <span className="text-base font-semibold">
                  {item.label} payment
                </span>
                <span className="text-sm text-label-secondary">
                  Unlimited accidental damage repairs
                </span>
              </span>
              <span className="text-base font-semibold tabular-nums">
                {money(item.price)}
              </span>
            </Label>
          ))}
        </RadioGroup>
        {device === "Phone Pro" && (
          <Label className="flex cursor-pointer items-center gap-2.5 text-sm font-normal">
            <Switch checked={theft} onCheckedChange={setTheft} />
            Add theft and loss protection
          </Label>
        )}
        <div className="flex items-center gap-3 border-t border-separator pt-3.5">
          <div className="flex flex-1 flex-col" aria-live="polite">
            <span className="text-sm text-label-secondary">Total</span>
            <span className="text-2xl font-semibold tabular-nums">
              {money(total)}
            </span>
          </div>
          <Button size="lg">Add to Bag</Button>
        </div>
      </div>
    </section>
  )
}
