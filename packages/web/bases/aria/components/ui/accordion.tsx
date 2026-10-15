"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  DisclosureGroup as DisclosureGroupPrimitive,
  type DisclosureGroupProps as DisclosureGroupPrimitiveProps,
  DisclosurePanel as DisclosurePanelPrimitive,
  type DisclosurePanelProps as DisclosurePanelPrimitiveProps,
  Disclosure as DisclosurePrimitive,
  type DisclosureProps as DisclosurePrimitiveProps,
  DisclosureStateContext,
  Heading as HeadingPrimitive,
} from "react-aria-components"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

const accordionVariants = cva("flex w-full flex-col", {
  variants: {
    variant: {
      default: "",
      filled: "overflow-hidden rounded-2xl bg-muted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Accordion({
  className,
  variant,
  ...props
}: Omit<DisclosureGroupPrimitiveProps, "className"> &
  VariantProps<typeof accordionVariants> & { className?: string }) {
  return (
    <DisclosureGroupPrimitive
      data-slot="accordion"
      className={cn(accordionVariants({ variant }), className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: Omit<DisclosurePrimitiveProps, "className"> & { className?: string }) {
  return (
    <DisclosurePrimitive
      data-slot="accordion-item"
      className={cn("ms-4 not-first:border-t", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: Omit<ButtonPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <HeadingPrimitive className="flex">
      <ButtonPrimitive
        slot="trigger"
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex min-h-11 cursor-pointer flex-1 items-center justify-between gap-6 py-2.75 ps-0 pe-4 text-start text-base outline-none after:absolute after:-inset-s-2 after:inset-e-2 after:top-2 after:h-[calc(100%-1rem)] after:rounded-md hover:underline focus-visible:after:ring-3 focus-visible:after:ring-ring/50 aria-disabled:pointer-events-none **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <IconPlaceholder
          lucide="ChevronUpIcon"
          tabler="IconChevronUp"
          hugeicons="ArrowUp01Icon"
          phosphor="CaretUpIcon"
          remixicon="RiArrowUpSLine"
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </ButtonPrimitive>
    </HeadingPrimitive>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: Omit<DisclosurePanelPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
}) {
  const state = React.useContext(DisclosureStateContext)

  return (
    <DisclosurePanelPrimitive
      data-slot="accordion-content"
      className="overflow-hidden text-sm text-muted-foreground in-data-expanded:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "pe-10 pb-3 [&_a]:underline [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {state?.isExpanded ? children : null}
      </div>
    </DisclosurePanelPrimitive>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
