"use client"

import { AlertDialog as AlertSheetPrimitive } from "@base-ui/react/alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type * as React from "react"

function AlertSheet({ ...props }: AlertSheetPrimitive.Root.Props) {
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
  return (
    <AlertSheetPrimitive.Backdrop
      data-slot="alert-sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/30 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function AlertSheetContent({
  className,
  ...props
}: AlertSheetPrimitive.Popup.Props) {
  return (
    <AlertSheetPortal>
      <AlertSheetOverlay />
      <AlertSheetPrimitive.Popup
        data-slot="alert-sheet-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-md flex-col gap-2 p-2 pb-[max(--spacing(2),env(safe-area-inset-bottom))] text-center outline-none transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:translate-y-full data-starting-style:translate-y-full",
          className
        )}
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
        "flex flex-col overflow-hidden rounded-2xl bg-popover text-popover-foreground *:not-first:border-t",
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
      className={cn("flex flex-col gap-1 px-4 py-4", className)}
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
      className={cn(
        "text-sm font-semibold text-muted-foreground text-balance",
        className
      )}
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
      className={cn("text-sm text-muted-foreground text-balance", className)}
      {...props}
    />
  )
}

const alertSheetActionVariants = cva(
  "flex min-h-14 w-full cursor-pointer items-center justify-center px-4 text-lg outline-none hover:bg-[color-mix(in_oklch,var(--popover),var(--foreground)_5%)] focus-visible:focus-ring active:bg-[color-mix(in_oklch,var(--popover),var(--foreground)_10%)] disabled:pointer-events-none disabled:opacity-50 [--focus-ring-offset:-3px]",
  {
    variants: {
      variant: {
        default: "text-primary",
        destructive: "text-destructive",
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
