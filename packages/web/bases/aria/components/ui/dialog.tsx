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
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DescriptionContextValue = {
  id: string
  setDescribed: (described: boolean) => void
}

const DialogDescriptionContext =
  React.createContext<DescriptionContextValue | null>(null)

function Dialog({ ...props }: DialogTriggerPrimitiveProps) {
  return <DialogTriggerPrimitive {...props} />
}

function DialogTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="dialog-trigger"
      className={className}
      {...props}
    />
  )
}

function DialogPortal({ children }: { children?: React.ReactNode }) {
  return children
}

function DialogClose({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      slot="close"
      data-slot="dialog-close"
      className={className}
      {...props}
    />
  )
}

function DialogOverlay({
  className,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ModalOverlayPrimitive
      data-slot="dialog-overlay"
      className={cn(
        "cn-dialog-overlay-aria fixed inset-0 isolate z-50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeLabel,
  isDismissable = true,
  isKeyboardDismissDisabled,
  ...props
}: Omit<DialogPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  showCloseButton?: boolean
  closeLabel?: string
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
    <DialogOverlay
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <ModalPrimitive>
        <DialogPrimitive
          data-slot="dialog-content"
          aria-describedby={described ? descriptionId : undefined}
          className={cn(
            "cn-dialog-content-aria inset-s-1/2 grid fixed top-1/2 z-50 w-full -translate-y-1/2 outline-none has-[>[data-slot=dialog-close]]:*:first:pe-8 has-[>[data-slot=dialog-close][data-label]]:*:first:pe-18",
            className
          )}
          {...props}
        >
          <DialogDescriptionContext.Provider value={description}>
            {children}
          </DialogDescriptionContext.Provider>
          {showCloseButton && (
            <Button
              slot="close"
              data-slot="dialog-close"
              data-label={closeLabel ? "" : undefined}
              variant={closeLabel ? "plain" : "ghost"}
              className={cn(
                "cn-dialog-close absolute inset-e-4",
                closeLabel && "text-base",
                !closeLabel &&
                  "bg-secondary hover:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_5%)]"
              )}
              size={closeLabel ? "sm" : "icon-sm"}
            >
              {closeLabel ?? (
                <>
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="Cancel01Icon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                  />
                  <span className="sr-only">Close</span>
                </>
              )}
            </Button>
          )}
        </DialogPrimitive>
      </ModalPrimitive>
    </DialogOverlay>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("cn-dialog-header flex flex-col", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <Button slot="close" variant="secondary">
          Close
        </Button>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: Omit<HeadingProps, "className"> & { className?: string }) {
  return (
    <Heading
      slot="title"
      level={2}
      data-slot="dialog-title"
      className={cn("cn-font-heading cn-dialog-title", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  const context = React.useContext(DialogDescriptionContext)

  React.useLayoutEffect(() => {
    if (!context) return
    context.setDescribed(true)
    return () => context.setDescribed(false)
  }, [context])

  return (
    <p
      id={context?.id}
      data-slot="dialog-description"
      className={cn(
        "cn-dialog-description *:[a]:underline *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
