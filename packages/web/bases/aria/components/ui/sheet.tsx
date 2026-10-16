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

const SheetDescriptionContext =
  React.createContext<DescriptionContextValue | null>(null)

function Sheet({ ...props }: DialogTriggerPrimitiveProps) {
  return <DialogTriggerPrimitive {...props} />
}

function SheetTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="sheet-trigger"
      className={className}
      {...props}
    />
  )
}

function SheetClose({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      slot="close"
      data-slot="sheet-close"
      className={className}
      {...props}
    />
  )
}

function SheetOverlay({
  className,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ModalOverlayPrimitive
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-400 data-exiting:opacity-0 data-entering:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  closeLabel,
  isDismissable = true,
  isKeyboardDismissDisabled,
  ...props
}: Omit<DialogPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
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
    <SheetOverlay
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <ModalPrimitive>
        <DialogPrimitive
          data-slot="sheet-content"
          data-side={side}
          aria-describedby={described ? descriptionId : undefined}
          className={cn(
            "has-[>[data-slot=sheet-close]]:*:first:pe-14 has-[>[data-slot=sheet-close][data-label]]:*:first:pe-24 fixed z-50 flex flex-col rounded-3xl bg-popover text-base text-popover-foreground shadow-xl transition duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] in-data-exiting:opacity-0 in-data-entering:opacity-0 data-[side=bottom]:inset-x-2 data-[side=bottom]:bottom-2 data-[side=bottom]:h-auto data-[side=bottom]:in-data-exiting:translate-y-10 data-[side=bottom]:in-data-entering:translate-y-10 data-[side=left]:inset-y-2 data-[side=left]:left-2 data-[side=left]:w-3/4 data-[side=left]:in-data-exiting:-translate-x-10 data-[side=left]:in-data-entering:-translate-x-10 data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:w-3/4 data-[side=right]:in-data-exiting:translate-x-10 data-[side=right]:in-data-entering:translate-x-10 data-[side=top]:inset-x-2 data-[side=top]:top-2 data-[side=top]:h-auto data-[side=top]:in-data-exiting:-translate-y-10 data-[side=top]:in-data-entering:-translate-y-10 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
            className
          )}
          {...props}
        >
          <SheetDescriptionContext.Provider value={description}>
            {children}
          </SheetDescriptionContext.Provider>
          {showCloseButton && (
            <Button
              slot="close"
              data-slot="sheet-close"
              data-label={closeLabel ? "" : undefined}
              variant={closeLabel ? "plain" : "ghost"}
              className={cn(
                "absolute top-4.75 inset-e-4",
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
    </SheetOverlay>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-6", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: Omit<HeadingProps, "className"> & { className?: string }) {
  return (
    <Heading
      slot="title"
      level={2}
      data-slot="sheet-title"
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  const context = React.useContext(SheetDescriptionContext)

  React.useLayoutEffect(() => {
    if (!context) return
    context.setDescribed(true)
    return () => context.setDescribed(false)
  }, [context])

  return (
    <p
      id={context?.id}
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
