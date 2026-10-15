"use client"

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
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DescriptionContextValue = {
  id: string
  setDescribed: (described: boolean) => void
}

const AlertDialogDescriptionContext =
  React.createContext<DescriptionContextValue | null>(null)

function AlertDialog({ ...props }: DialogTriggerPrimitiveProps) {
  return <DialogTriggerPrimitive {...props} />
}

function AlertDialogTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="alert-dialog-trigger"
      className={className}
      {...props}
    />
  )
}

function AlertDialogPortal({ children }: { children?: React.ReactNode }) {
  return children
}

function AlertDialogOverlay({
  className,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ModalOverlayPrimitive
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/50 duration-100 data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  children,
  isDismissable = false,
  isKeyboardDismissDisabled,
  ...props
}: Omit<DialogPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  size?: "default" | "sm"
  isDismissable?: boolean
  isKeyboardDismissDisabled?: boolean
}) {
  const descriptionId = React.useId()
  const [described, setDescribed] = React.useState(false)
  const description = React.useMemo(
    () => ({ id: descriptionId, setDescribed }),
    [descriptionId]
  )

  return (
    <AlertDialogOverlay
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <ModalPrimitive>
        <DialogPrimitive
          role="alertdialog"
          data-slot="alert-dialog-content"
          data-size={size}
          aria-describedby={described ? descriptionId : undefined}
          className={cn(
            "fixed top-1/2 inset-s-1/2 z-50 grid w-full -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 gap-6 rounded-2xl bg-popover p-6 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none max-w-xs data-[size=default]:max-w-85 dark:ring-foreground/10 in-data-entering:animate-in in-data-entering:fade-in-0 in-data-entering:zoom-in-95 in-data-exiting:animate-out in-data-exiting:fade-out-0 in-data-exiting:zoom-out-95",
            className
          )}
          {...props}
        >
          <AlertDialogDescriptionContext.Provider value={description}>
            {children}
          </AlertDialogDescriptionContext.Provider>
        </DialogPrimitive>
      </ModalPrimitive>
    </AlertDialogOverlay>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("grid grid-cols-2 gap-2", className)}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-16 items-center justify-center rounded-full bg-muted *:[svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: Omit<HeadingProps, "className"> & { className?: string }) {
  return (
    <Heading
      slot="title"
      level={2}
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const context = React.useContext(AlertDialogDescriptionContext)

  React.useLayoutEffect(() => {
    if (!context) return
    context.setDescribed(true)
    return () => context.setDescribed(false)
  }, [context])

  return (
    <p
      id={context?.id}
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      slot="close"
      data-slot="alert-dialog-action"
      variant={variant}
      size={size}
      {...props}
    />
  )
}

function AlertDialogCancel({
  variant = "secondary",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      slot="close"
      data-slot="alert-dialog-cancel"
      variant={variant}
      size={size}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
