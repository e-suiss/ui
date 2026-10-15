"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

const EMAIL = /.+@.+\..+/

const services = [
  {
    icon: (
      <IconPlaceholder
        lucide="TruckIcon"
        tabler="IconTruck"
        hugeicons="DeliveryTruck01Icon"
        phosphor="TruckIcon"
        remixicon="RiTruckLine"
        className="size-8 text-primary"
      />
    ),
    title: "Free delivery",
    description: "Fast, free delivery on every order.",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="RotateCcwIcon"
        tabler="IconRotate"
        hugeicons="UndoIcon"
        phosphor="ArrowCounterClockwiseIcon"
        remixicon="RiResetLeftLine"
        className="size-8 text-primary"
      />
    ),
    title: "Easy returns",
    description: "Free returns within 14 days.",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="CreditCardIcon"
        tabler="IconCreditCard"
        hugeicons="CreditCardIcon"
        phosphor="CreditCardIcon"
        remixicon="RiBankCardLine"
        className="size-8 text-primary"
      />
    ),
    title: "Pay monthly",
    description: "Installments for up to 12 months.",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="MessageCircleIcon"
        tabler="IconMessageCircle"
        hugeicons="BubbleChatIcon"
        phosphor="ChatCircleIcon"
        remixicon="RiChat1Line"
        className="size-8 text-primary"
      />
    ),
    title: "Expert help",
    description: "Chat online with a Specialist.",
  },
]

const sections = [
  {
    title: "suiss Store",
    links: [
      "Find a Store",
      "Help Desk",
      "Today at suiss",
      "Trade In",
      "Order Status",
    ],
  },
  {
    title: "Account",
    links: ["Manage Your suiss Account", "suiss Store Account", "suiss Cloud"],
  },
  {
    title: "Entertainment",
    links: [
      "suiss One",
      "suiss TV",
      "suiss Music",
      "suiss Arcade",
      "suiss Podcasts",
    ],
  },
  {
    title: "About suiss",
    links: [
      "Newsroom",
      "Leadership",
      "Careers",
      "Investors",
      "Ethics & Compliance",
    ],
  },
]

const legal = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
]

const slug = (text: string) =>
  `#${text.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`

export function FooterServices() {
  const [email, setEmail] = React.useState("")
  const [invalid, setInvalid] = React.useState(false)
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <footer className="bg-background text-xs text-muted-foreground">
      <div className="bg-muted px-5 py-10 md:px-10">
        <ul className="mx-auto grid max-w-245 grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {services.map((service) => (
            <li
              key={service.title}
              className="flex flex-col items-center gap-2 text-center"
            >
              {service.icon}
              <h3 className="text-base font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="text-sm leading-snug text-muted-foreground">
                {service.description}
              </p>
              <a
                href={slug(service.title)}
                className="text-sm text-primary hover:underline"
              >
                Learn more ›
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto flex max-w-245 flex-col gap-4.5 px-5.5 pt-7 pb-5">
        <div className="flex flex-col gap-4 border-b border-border pb-4.5 md:flex-row md:items-center md:gap-6">
          <div className="flex flex-1 flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">
              Stay in the loop.
            </h2>
            <p className="text-sm">New products and offers, in your inbox.</p>
          </div>
          {subscribed ? (
            <p
              role="status"
              className="flex h-11 items-center gap-1.5 text-sm text-foreground transition-[opacity,translate] duration-800 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none"
            >
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                className="size-4.5 text-green-500"
              />
              You're subscribed. Thank you.
            </p>
          ) : (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                const valid = EMAIL.test(email)
                setInvalid(!valid)
                if (valid) setSubscribed(true)
              }}
              className="w-full md:w-85"
            >
              <InputGroup className="rounded-xl border-input bg-transparent">
                <InputGroupInput
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setInvalid(false)
                  }}
                  placeholder="Email address"
                  aria-label="Email address"
                  aria-invalid={invalid || undefined}
                  className="ps-3.5"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="submit"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Subscribe"
                    className="size-7.5 border-[1.5px] border-muted-foreground bg-transparent text-muted-foreground"
                  >
                    <IconPlaceholder
                      lucide="ArrowRightIcon"
                      tabler="IconArrowRight"
                      hugeicons="ArrowRight02Icon"
                      phosphor="ArrowRightIcon"
                      remixicon="RiArrowRightLine"
                      className="size-3.5 rtl:rotate-180"
                    />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          )}
        </div>
        <nav
          aria-label="Directory"
          className="grid grid-cols-2 gap-5 md:grid-cols-4"
        >
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href={slug(link)} className="hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-2.5">
          <span>Copyright © 2026 suiss Inc. All rights reserved.</span>
          <ul className="flex flex-wrap leading-6">
            {legal.map((link) => (
              <li
                key={link}
                className="border-input px-2 text-foreground not-first:border-s first:ps-0"
              >
                <a href={slug(link)} className="hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#region"
            className="text-foreground hover:underline md:ms-auto"
          >
            United States
          </a>
        </div>
      </div>
    </footer>
  )
}
