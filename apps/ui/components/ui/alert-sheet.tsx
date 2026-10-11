"use client"

import { AlertDialog as AlertSheetPrimitive } from "@base-ui/react/alert-dialog"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"

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
  return (
    <AlertSheetPrimitive.Backdrop
      data-slot="alert-sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-scrim transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
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
        "flex flex-col overflow-hidden rounded-2xl bg-surface-raised text-label *:col-span-full *:not-first:border-t has-[>button>svg]:grid has-[>button>svg]:grid-cols-[1fr_auto_auto_1fr]",
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
}: AlertSheetPrimitive.Title.Props) {
  return (
    <AlertSheetPrimitive.Title
      data-slot="alert-sheet-title"
      className={cn(
        "text-sm font-semibold text-label-secondary text-balance",
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
      className={cn("text-sm text-label-secondary text-balance", className)}
      {...props}
    />
  )
}

const alertSheetActionVariants = cva(
  "flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 px-4 text-lg has-[>svg]:grid has-[>svg]:grid-cols-subgrid has-[>svg]:gap-x-3 has-[>svg]:text-start [&>svg]:col-start-2 [&_svg:not([class*='size-'])]:size-5 outline-none hover:bg-[color-mix(in_oklab,var(--surface-raised),var(--label)_5%)] focus-visible:focus-ring active:bg-[color-mix(in_oklab,var(--surface-raised),var(--label)_10%)] disabled:pointer-events-none disabled:text-label-quaternary [--focus-ring-offset:-3px]",
  {
    variants: {
      variant: {
        default: "text-link",
        destructive: "text-danger",
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
        "rounded-2xl bg-surface-raised font-semibold",
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
