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

const accordionVariants = cva("cn-accordion", {
  variants: {
    variant: {
      default: "",
      filled: "cn-accordion-variant-filled",
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
  value,
  id = value,
  disabled,
  isDisabled = disabled,
  ...props
}: Omit<DisclosurePrimitiveProps, "className"> & {
  className?: string
  value?: string
  disabled?: boolean
}) {
  return (
    <DisclosurePrimitive
      data-slot="accordion-item"
      className={cn("cn-accordion-item", className)}
      {...props}
      id={id}
      isDisabled={isDisabled}
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
          "cn-accordion-trigger group/accordion-trigger flex flex-1 justify-between outline-none **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
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
          className="cn-accordion-trigger-icon pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <IconPlaceholder
          lucide="ChevronUpIcon"
          tabler="IconChevronUp"
          hugeicons="ArrowUp01Icon"
          phosphor="CaretUpIcon"
          remixicon="RiArrowUpSLine"
          data-slot="accordion-trigger-icon"
          className="cn-accordion-trigger-icon pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
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
      className="cn-accordion-content"
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
