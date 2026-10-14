"use client"

import { CheckIcon, CloudIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const plans = [
  {
    size: "50 GB",
    price: 0.99,
    features: ["Space for photos and files", "Private Relay", "Hide My Email"],
  },
  {
    size: "200 GB",
    price: 2.99,
    features: [
      "Share with your family",
      "Custom email domain",
      "Secure Video for 1 camera",
    ],
    popular: true,
  },
  {
    size: "2 TB",
    price: 9.99,
    features: ["Everything in 200 GB", "Unlimited Secure Video cameras"],
  },
  {
    size: "6 TB",
    price: 29.99,
    features: ["Everything in 2 TB", "Room for large archives"],
  },
]

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" })

export function PriceStorage() {
  const [period, setPeriod] = React.useState("monthly")
  const [selected, setSelected] = React.useState("200 GB")
  const [updated, setUpdated] = React.useState(false)
  const yearly = period === "yearly"

  return (
    <section className="flex flex-col items-center gap-6 px-5 py-9 md:px-9">
      <div className="flex flex-col items-center gap-2 text-center">
        <CloudIcon className="size-10 text-blue" />
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          More space with suiss Cloud+.
        </h1>
        <ToggleGroup
          spacing={0}
          value={[period]}
          onValueChange={(value: string[]) => {
            if (value[0]) setPeriod(value[0])
          }}
          aria-label="Billing period"
          className="mt-2"
        >
          <ToggleGroupItem value="monthly" size="sm" className="px-12">
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem value="yearly" size="sm">
            Yearly · 2 months free
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <RadioGroup
        value={selected}
        onValueChange={(value) => {
          setSelected(value as string)
          setUpdated(false)
        }}
        aria-label="Storage plan"
        className="grid w-full max-w-240 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {plans.map((plan) => (
          <Label
            key={plan.size}
            className="relative flex cursor-pointer flex-col gap-3 rounded-[1.125rem] bg-surface-secondary p-4.5 transition-[translate,box-shadow] duration-350 ease-[cubic-bezier(0.3,1.25,0.5,1)] has-data-checked:-translate-y-0.75 has-data-checked:shadow-[inset_0_0_0_2px_var(--color-accent)] has-focus-visible:focus-ring motion-reduce:transition-none font-normal items-stretch"
          >
            {plan.popular && (
              <span className="absolute -top-2.25 start-4.5 rounded-full bg-accent px-2.25 py-0.5 text-2xs font-semibold text-on-accent">
                Most popular
              </span>
            )}
            <span className="flex items-center gap-2">
              <span className="flex-1 text-2xl font-semibold">{plan.size}</span>
              <RadioGroupItem
                value={plan.size}
                aria-label={plan.size}
                className="size-5 [--focus-ring-width:0px]"
              />
            </span>
            <span>
              <span className="text-2xl font-semibold tabular-nums">
                {money(yearly ? plan.price * 10 : plan.price)}
              </span>
              <span className="text-sm text-label-secondary">
                {yearly ? " /yr" : " /mo"}
              </span>
            </span>
            <ul className="flex flex-col gap-1.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-1.5 text-sm leading-snug"
                >
                  <CheckIcon
                    weight="bold"
                    className="mt-0.5 size-3.25 shrink-0 text-[color-mix(in_oklab,var(--green),var(--label)_30%)] dark:text-green"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </Label>
        ))}
      </RadioGroup>
      <Button size="lg" onClick={() => setUpdated(true)} aria-live="polite">
        {updated ? "Your plan is updated" : `Switch to ${selected}`}
      </Button>
    </section>
  )
}
