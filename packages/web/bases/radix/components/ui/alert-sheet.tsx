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
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/50 duration-300 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
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
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-md flex-col gap-2 p-2 pb-[max(--spacing(2),env(safe-area-inset-bottom))] text-center outline-none duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom",
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
        "flex flex-col overflow-hidden rounded-2xl bg-popover text-popover-foreground *:col-span-full *:not-first:border-t has-[>button>svg]:grid has-[>button>svg]:grid-cols-[1fr_auto_auto_1fr]",
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
      className={cn("flex flex-col gap-1 p-4", className)}
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
}: React.ComponentProps<typeof AlertSheetPrimitive.Description>) {
  return (
    <AlertSheetPrimitive.Description
      data-slot="alert-sheet-description"
      className={cn("text-sm text-muted-foreground text-balance", className)}
      {...props}
    />
  )
}

const alertSheetActionVariants = cva(
  "flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 px-4 text-lg has-[>svg]:grid has-[>svg]:grid-cols-subgrid has-[>svg]:gap-x-3 has-[>svg]:text-start [&>svg]:col-start-2 [&_svg:not([class*='size-'])]:size-5 outline-none hover:bg-[color-mix(in_oklab,var(--popover),var(--foreground)_5%)] focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
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
