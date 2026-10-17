"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Dialog as AlertSheetPrimitive } from "radix-ui"
import * as React from "react"
import { cn } from "@/lib/utils"

const AlertSheetContext = React.createContext({ dismissible: true })

function AlertSheet({
  dismissible = true,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Root> & {
  dismissible?: boolean
}) {
  const context = React.useMemo(() => ({ dismissible }), [dismissible])

  return (
    <AlertSheetContext.Provider value={context}>
      <AlertSheetPrimitive.Root data-slot="alert-sheet" {...props} />
    </AlertSheetContext.Provider>
  )
}

function AlertSheetTrigger({
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Trigger>) {
  return (
    <AlertSheetPrimitive.Trigger data-slot="alert-sheet-trigger" {...props} />
  )
}

function AlertSheetPortal({
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Portal>) {
  return (
    <AlertSheetPrimitive.Portal data-slot="alert-sheet-portal" {...props} />
  )
}

function AlertSheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Overlay>) {
  return (
    <AlertSheetPrimitive.Overlay
      data-slot="alert-sheet-overlay"
      className={cn("cn-alert-sheet-overlay", className)}
      {...props}
    />
  )
}

function AlertSheetContent({
  className,
  onOpenAutoFocus,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Content>) {
  const { dismissible } = React.useContext(AlertSheetContext)

  return (
    <AlertSheetPortal>
      <AlertSheetOverlay />
      <AlertSheetPrimitive.Content
        data-slot="alert-sheet-content"
        role={dismissible ? "dialog" : "alertdialog"}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event)
          if (event.defaultPrevented) return
          const cancel = (
            event.currentTarget as HTMLElement
          ).querySelector<HTMLElement>('[data-slot="alert-sheet-cancel"]')
          if (!cancel) return
          event.preventDefault()
          cancel.focus()
        }}
        onPointerDownOutside={(event) => {
          onPointerDownOutside?.(event)
          if (!dismissible) event.preventDefault()
        }}
        onInteractOutside={(event) => {
          onInteractOutside?.(event)
          if (!dismissible) event.preventDefault()
        }}
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
}: React.ComponentProps<typeof AlertSheetPrimitive.Title>) {
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
}: React.ComponentProps<typeof AlertSheetPrimitive.Description>) {
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
}: React.ComponentProps<typeof AlertSheetPrimitive.Close> &
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
}: React.ComponentProps<typeof AlertSheetPrimitive.Close>) {
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
