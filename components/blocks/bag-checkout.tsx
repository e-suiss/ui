"use client"

import { CheckIcon, CreditCardIcon, WalletIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=200&q=80&auto=format&fit=crop`

const items = [
  {
    name: "Phone Pro",
    variant: "256 GB · Cosmic Orange",
    price: 1099,
    image: photo("1714972384975-fbd4f19b1bb3"),
  },
  {
    name: "Pods Studio",
    variant: "Midnight",
    price: 549,
    image: photo("1599669454699-248893623440"),
  },
  {
    name: "Phone Pro Clear Case",
    variant: "With MagCharge",
    price: 49,
    image: photo("1703676311066-34caf2cbee33"),
  },
]

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" })

const choiceClass =
  "flex cursor-pointer items-center gap-3 rounded-[0.875rem] px-4 py-3.5 text-base font-normal shadow-[inset_0_0_0_1px_var(--color-separator-strong)] transition-shadow duration-200 has-data-checked:shadow-[inset_0_0_0_2px_var(--color-accent)] has-focus-visible:focus-ring"

function stepState(index: number, current: number) {
  if (current > index) return "done"
  if (current === index) return "open"
  return "idle"
}

function Step({
  index,
  current,
  title,
  summary,
  onEdit,
  children,
}: {
  index: number
  current: number
  title: string
  summary?: string
  onEdit: () => void
  children: React.ReactNode
}) {
  const open = current === index
  const done = current > index

  return (
    <section
      aria-current={open ? "step" : undefined}
      className="border-b border-separator py-4.5"
    >
      <div className="flex items-center gap-2.5">
        <span
          data-state={stepState(index, current)}
          className="flex size-6.5 items-center justify-center rounded-full bg-control text-sm font-semibold text-label-secondary data-[state=done]:bg-[color-mix(in_oklab,var(--green),var(--label)_35%)] data-[state=done]:text-white data-[state=open]:bg-label data-[state=open]:text-surface dark:data-[state=done]:bg-[color-mix(in_oklab,var(--green),black_35%)]"
        >
          {done ? <CheckIcon weight="bold" className="size-3.25" /> : index + 1}
        </span>
        <h2
          data-idle={!open && !done ? "" : undefined}
          className="flex-1 text-2xl font-semibold data-idle:text-label-secondary"
        >
          {title}
        </h2>
        {done && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title.toLowerCase()}`}
            className="rounded-xs text-sm text-link outline-none hover:underline focus-visible:focus-ring"
          >
            Edit ›
          </button>
        )}
      </div>
      {done && summary && (
        <p className="ps-9 pt-1.5 text-sm text-label-secondary">{summary}</p>
      )}
      <div
        data-open={open ? "" : undefined}
        inert={!open}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2.5 ps-9 pt-4 pb-1">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function BagCheckout() {
  const [step, setStep] = React.useState(0)
  const [shipping, setShipping] = React.useState("standard")
  const [payment, setPayment] = React.useState("card")
  const [placed, setPlaced] = React.useState(false)
  const total =
    items.reduce((sum, item) => sum + item.price, 0) +
    (shipping === "express" ? 19 : 0)

  if (placed) {
    return (
      <section className="flex min-h-160 items-center justify-center p-6">
        <div className="flex max-w-105 flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] text-white dark:bg-[color-mix(in_oklab,var(--green),black_35%)]">
            <CheckIcon weight="bold" className="size-9.5" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Thank you. Your order is in.
          </h1>
          <p className="text-lg text-label-secondary">
            Your order number is W1049. We sent a confirmation email.
          </p>
          <button
            type="button"
            onClick={() => {
              setPlaced(false)
              setStep(0)
            }}
            className="rounded-xs text-lg text-link outline-none hover:underline focus-visible:focus-ring"
          >
            Start over ›
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid min-h-160 bg-surface md:grid-cols-[minmax(0,1.4fr)_minmax(16.25rem,1fr)]">
      <div className="px-5 py-6 md:px-9">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Checkout</h1>
        <Step
          index={0}
          current={step}
          title="Delivery"
          summary={
            shipping === "express"
              ? "Express · Tomorrow"
              : "Standard · 3–5 business days"
          }
          onEdit={() => setStep(0)}
        >
          <RadioGroup
            value={shipping}
            onValueChange={(value) => setShipping(value as string)}
            aria-label="Delivery"
            className="gap-2.5"
          >
            <Label className={choiceClass}>
              <RadioGroupItem
                value="standard"
                className="size-5 [--focus-ring-width:0px]"
              />
              <span className="flex-1">Standard · 3–5 business days</span>
              <span>Free</span>
            </Label>
            <Label className={choiceClass}>
              <RadioGroupItem
                value="express"
                className="size-5 [--focus-ring-width:0px]"
              />
              <span className="flex-1">Express · Tomorrow</span>
              <span>$19</span>
            </Label>
          </RadioGroup>
          <Button size="sm" className="self-start" onClick={() => setStep(1)}>
            Continue to Payment
          </Button>
        </Step>
        <Step
          index={1}
          current={step}
          title="Payment"
          summary={payment === "card" ? "Card •••• 4242" : "suiss Pay"}
          onEdit={() => setStep(1)}
        >
          <RadioGroup
            value={payment}
            onValueChange={(value) => setPayment(value as string)}
            aria-label="Payment"
            className="gap-2.5"
          >
            <Label className={choiceClass}>
              <RadioGroupItem
                value="card"
                className="size-5 [--focus-ring-width:0px]"
              />
              <CreditCardIcon className="size-4.5" />
              <span className="flex-1">Credit card · •••• 4242</span>
            </Label>
            <Label className={choiceClass}>
              <RadioGroupItem
                value="pay"
                className="size-5 [--focus-ring-width:0px]"
              />
              <WalletIcon className="size-4.5" />
              <span className="flex-1">suiss Pay</span>
            </Label>
          </RadioGroup>
          <Button size="sm" className="self-start" onClick={() => setStep(2)}>
            Continue to Review
          </Button>
        </Step>
        <Step index={2} current={step} title="Review" onEdit={() => setStep(2)}>
          <p className="text-sm leading-normal text-label-secondary">
            By placing your order, you agree to the Sales Policy.
          </p>
          <Button className="self-start" onClick={() => setPlaced(true)}>
            Place Order
          </Button>
        </Step>
      </div>
      <aside
        aria-label="Order summary"
        className="flex flex-col gap-3.5 bg-surface-secondary px-6.5 py-7"
      >
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="flex flex-col gap-3.5">
          {items.map((item) => (
            <li key={item.name} className="flex items-center gap-2.5">
              <img
                src={item.image}
                alt=""
                className="size-12 shrink-0 rounded-[0.625rem] bg-control object-cover"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="text-xs text-label-secondary">
                  {item.variant}
                </span>
              </span>
              <span className="text-sm tabular-nums">{money(item.price)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center border-t border-separator pt-3">
          <span className="flex-1 text-base font-semibold">Total</span>
          <span
            className="text-lg font-semibold tabular-nums"
            aria-live="polite"
          >
            {money(total)}
          </span>
        </div>
      </aside>
    </section>
  )
}
