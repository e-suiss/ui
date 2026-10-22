"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Dialog as DialogPrimitive,
  type DialogProps as DialogPrimitiveProps,
  DialogTrigger as DialogTriggerPrimitive,
  type DialogTriggerProps as DialogTriggerPrimitiveProps,
  Heading,
  type HeadingProps,
  ModalOverlay as ModalOverlayPrimitive,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
  Modal as ModalPrimitive,
} from "react-aria-components"
import { cn } from "@/lib/utils"

type AlertSheetContextValue = {
  dismissible: boolean
}

type DescriptionContextValue = {
  id: string
  setDescribed: (described: boolean) => void
}

const AlertSheetContext = React.createContext<AlertSheetContextValue>({
  dismissible: true,
})

const AlertSheetDescriptionContext =
  React.createContext<DescriptionContextValue | null>(null)

function AlertSheet({
  dismissible = true,
  ...props
}: DialogTriggerPrimitiveProps & { dismissible?: boolean }) {
  const context = React.useMemo(() => ({ dismissible }), [dismissible])

  return (
    <AlertSheetContext.Provider value={context}>
      <DialogTriggerPrimitive {...props} />
    </AlertSheetContext.Provider>
  )
}

function AlertSheetTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="alert-sheet-trigger"
      className={className}
      {...props}
    />
  )
}

function AlertSheetPortal({ children }: { children?: React.ReactNode }) {
  return children
}

function AlertSheetOverlay({
  className,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ModalOverlayPrimitive
      data-slot="alert-sheet-overlay"
      className={cn("cn-alert-sheet-overlay fixed inset-0", className)}
      {...props}
    />
  )
}

function AlertSheetContent({
  className,
  children,
  ...props
}: Omit<DialogPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
}) {
  const { dismissible } = React.useContext(AlertSheetContext)
  const descriptionId = React.useId()
  const [described, setDescribed] = React.useState(false)
  const description = React.useMemo(
    () => ({ id: descriptionId, setDescribed }),
    [descriptionId]
  )

  return (
    <AlertSheetOverlay isDismissable={dismissible}>
      <ModalPrimitive>
        <DialogPrimitive
          role={dismissible ? "dialog" : "alertdialog"}
          data-slot="alert-sheet-content"
          aria-describedby={described ? descriptionId : undefined}
          className={cn(
            "cn-alert-sheet-content fixed inset-x-0 flex w-full flex-col",
            className
          )}
          {...props}
        >
          <AlertSheetDescriptionContext.Provider value={description}>
            {children}
          </AlertSheetDescriptionContext.Provider>
        </DialogPrimitive>
      </ModalPrimitive>
    </AlertSheetOverlay>
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
}: Omit<HeadingProps, "className"> & { className?: string }) {
  return (
    <Heading
      slot="title"
      level={2}
      data-slot="alert-sheet-title"
      className={cn("cn-alert-sheet-title", className)}
      {...props}
    />
  )
}

function AlertSheetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const context = React.useContext(AlertSheetDescriptionContext)

  React.useLayoutEffect(() => {
    if (!context) return
    context.setDescribed(true)
    return () => context.setDescribed(false)
  }, [context])

  return (
    <p
      id={context?.id}
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
}: Omit<ButtonPrimitiveProps, "className"> &
  VariantProps<typeof alertSheetActionVariants> & { className?: string }) {
  return (
    <ButtonPrimitive
      slot="close"
      data-slot="alert-sheet-action"
      className={cn(alertSheetActionVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertSheetCancel({
  className,
  autoFocus = true,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      slot="close"
      data-slot="alert-sheet-cancel"
      autoFocus={autoFocus}
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
