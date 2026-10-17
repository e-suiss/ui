"use client"

import { AlertDialog as AlertSheetPrimitive } from "@base-ui/react/alert-dialog"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { useScrollbarGap } from "@/hooks/use-scrollbar-gap"
import { cn } from "@/lib/utils"

function AlertSheet({
  dismissible = true,
  ...props
}: AlertSheetPrimitive.Root.Props & { dismissible?: boolean }) {
  if (dismissible) {
    return <DialogPrimitive.Root data-slot="alert-sheet" {...props} />
  }
  return <AlertSheetPrimitive.Root data-slot="alert-sheet" {...props} />
}

function AlertSheetTrigger({ ...props }: AlertSheetPrimitive.Trigger.Props) {
  return (
    <AlertSheetPrimitive.Trigger data-slot="alert-sheet-trigger" {...props} />
  )
}

function AlertSheetPortal({ ...props }: AlertSheetPrimitive.Portal.Props) {
  return (
    <AlertSheetPrimitive.Portal data-slot="alert-sheet-portal" {...props} />
  )
}

function AlertSheetOverlay({
  className,
  ...props
}: AlertSheetPrimitive.Backdrop.Props) {
  useScrollbarGap()

  return (
    <AlertSheetPrimitive.Backdrop
      data-slot="alert-sheet-overlay"
      className={cn("cn-alert-sheet-overlay", className)}
      {...props}
    />
  )
}

function AlertSheetContent({
  className,
  initialFocus,
  ref,
  ...props
}: AlertSheetPrimitive.Popup.Props) {
  const popupRef = React.useRef<HTMLDivElement | null>(null)

  const setRefs = (node: HTMLDivElement | null) => {
    popupRef.current = node
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }

  const focusCancel = () =>
    popupRef.current?.querySelector<HTMLElement>(
      '[data-slot="alert-sheet-cancel"]'
    ) ?? true

  return (
    <AlertSheetPortal>
      <AlertSheetOverlay />
      <AlertSheetPrimitive.Popup
        data-slot="alert-sheet-content"
        ref={setRefs}
        initialFocus={initialFocus ?? focusCancel}
        className={cn("cn-alert-sheet-content", className)}
        {...props}
      />
    </AlertSheetPortal>
  )
}

function AlertSheetGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-sheet-group"
      className={cn(
        "cn-alert-sheet-group *:col-span-full *:not-first:border-t",
        className
      )}
      {...props}
    />
  )
}

function AlertSheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-sheet-header"
      className={cn("cn-alert-sheet-header", className)}
      {...props}
    />
  )
}

function AlertSheetTitle({
  className,
  ...props
}: AlertSheetPrimitive.Title.Props) {
  return (
    <AlertSheetPrimitive.Title
      data-slot="alert-sheet-title"
      className={cn("cn-alert-sheet-title", className)}
      {...props}
    />
  )
}

function AlertSheetDescription({
  className,
  ...props
}: AlertSheetPrimitive.Description.Props) {
  return (
    <AlertSheetPrimitive.Description
      data-slot="alert-sheet-description"
      className={cn("cn-alert-sheet-description", className)}
      {...props}
    />
  )
}

const alertSheetActionVariants = cva(
  "cn-alert-sheet-action [&>svg]:col-start-2 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "cn-alert-sheet-action-variant-default",
        destructive: "cn-alert-sheet-action-variant-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function AlertSheetAction({
  className,
  variant,
  ...props
}: AlertSheetPrimitive.Close.Props &
  VariantProps<typeof alertSheetActionVariants>) {
  return (
    <AlertSheetPrimitive.Close
      data-slot="alert-sheet-action"
      className={cn(alertSheetActionVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertSheetCancel({
  className,
  ...props
}: AlertSheetPrimitive.Close.Props) {
  return (
    <AlertSheetPrimitive.Close
      data-slot="alert-sheet-cancel"
      className={cn(
        alertSheetActionVariants(),
        "rounded-2xl bg-popover font-semibold",
        className
      )}
      {...props}
    />
  )
}

export {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetOverlay,
  AlertSheetPortal,
  AlertSheetTitle,
  AlertSheetTrigger,
}
