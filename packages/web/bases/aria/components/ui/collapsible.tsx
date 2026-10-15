"use client"

import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  DisclosurePanel as DisclosurePanelPrimitive,
  type DisclosurePanelProps as DisclosurePanelPrimitiveProps,
  Disclosure as DisclosurePrimitive,
  type DisclosureProps as DisclosurePrimitiveProps,
  DisclosureStateContext,
} from "react-aria-components"

function Collapsible({
  className,
  ...props
}: Omit<DisclosurePrimitiveProps, "className"> & { className?: string }) {
  return (
    <DisclosurePrimitive
      data-slot="collapsible"
      className={className}
      {...props}
    />
  )
}

function CollapsibleTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      slot="trigger"
      data-slot="collapsible-trigger"
      className={className}
      {...props}
    />
  )
}

function CollapsibleContent({
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
      data-slot="collapsible-content"
      className={className}
      {...props}
    >
      {state?.isExpanded ? children : null}
    </DisclosurePanelPrimitive>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
