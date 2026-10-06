"use client"

import * as React from "react"

import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"
import { Button } from "@/components/ui/button"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`

const initialItems = [
  {
    name: "Phone Pro",
    variant: "256 GB · Cosmic Orange",
    price: 1099,
    image: photo("1714972384975-fbd4f19b1bb3"),
    quantity: 1,
  },
  {
    name: "Pods Studio",
    variant: "Midnight",
    price: 549,
    image: photo("1599669454699-248893623440"),
    quantity: 1,
  },
  {
    name: "Phone Pro Clear Case",
    variant: "With MagCharge",
    price: 49,
    image: photo("1703676311066-34caf2cbee33"),
    quantity: 2,
  },
]

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" })

export function BagReview() {
  const [items, setItems] = React.useState(initialItems)
  const bag = items.filter((item) => item.quantity > 0)
  const subtotal = bag.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const setQuantity = (name: string, quantity: number) =>
    setItems((current) =>
      current.map((item) => (item.name === name ? { ...item, quantity } : item))
    )

  return (
    <section className="px-5 py-8 md:px-12">
      <div className="mx-auto flex max-w-205 flex-col">
        <h1
          aria-live="polite"
          className="text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl"
        >
          {bag.length
            ? `Your bag total is ${money(subtotal)}.`
            : "Your bag is empty."}
        </h1>
        <p className="mt-2 mb-5 text-center text-base text-label-secondary">
          Free delivery and free returns on every order.
        </p>
        {bag.length > 0 ? (
          <Button size="lg" className="mb-5 self-center">
            Check Out
          </Button>
        ) : (
          <Button
            size="lg"
            className="self-center"
            onClick={() => setItems(initialItems)}
          >
            Continue Shopping
          </Button>
        )}
        <ul>
          {bag.map((item) => (
            <li
              key={item.name}
              className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-t border-separator py-5.5 transition-[opacity,translate] duration-700 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none md:grid-cols-[7.5rem_minmax(0,1fr)_auto_7.5rem] md:gap-5"
            >
              <img
                src={item.image}
                alt=""
                className="size-20 rounded-xl bg-control object-cover md:row-span-2 md:size-30"
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-label-secondary">{item.variant}</p>
                <a
                  href="#details"
                  className="mt-1.5 text-sm text-link hover:underline"
                >
                  Show product details ›
                </a>
              </div>
              <Stepper
                value={item.quantity}
                onValueChange={(value) => setQuantity(item.name, value)}
                min={1}
                max={10}
                className="col-start-2 flex items-center gap-2 md:col-start-auto md:items-start"
              >
                <StepperInput
                  aria-label={`${item.name} quantity`}
                  className="w-8 text-center"
                />
                <StepperGroup>
                  <StepperDecrement />
                  <StepperSeparator />
                  <StepperIncrement />
                </StepperGroup>
              </Stepper>
              <div className="col-start-2 flex items-center justify-between gap-1.5 md:col-start-auto md:flex-col md:items-end md:justify-start">
                <span className="text-xl font-semibold tabular-nums">
                  {money(item.price * item.quantity)}
                </span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setQuantity(item.name, 0)}
                  aria-label={`Remove ${item.name}`}
                  className="h-auto px-0 text-sm text-link"
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {bag.length > 0 && (
          <div className="flex flex-col gap-2.5 border-t border-separator pt-5 md:ps-90">
            <div className="flex justify-between text-base">
              <span>Subtotal</span>
              <span className="tabular-nums">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between border-t border-separator pt-3 text-2xl font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{money(subtotal)}</span>
            </div>
            <div className="mt-1 flex flex-wrap justify-end gap-2.5">
              <Button
                size="lg"
                className="bg-label text-surface hover:bg-label/90 active:bg-label/80"
              >
                Check Out with <span className="font-bold">suiss</span> Pay
              </Button>
              <Button size="lg">Check Out</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
