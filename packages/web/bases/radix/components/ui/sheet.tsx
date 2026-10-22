"use client"

import { Dialog as SheetPrimitive } from "radix-ui"
import type * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "cn-sheet-overlay fixed inset-0 z-50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
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
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "cn-sheet-content fixed flex flex-col data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=top]:data-open:slide-in-from-top-10 data-[side=top]:data-closed:slide-out-to-top-10 has-[>[data-slot=sheet-close]]:*:first:pe-14 has-[>[data-slot=sheet-close][data-label]]:*:first:pe-24",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            data-label={closeLabel ? "" : undefined}
            asChild
          >
            <Button
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
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("cn-sheet-header flex flex-col", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("cn-sheet-footer mt-auto flex flex-col", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("cn-font-heading cn-sheet-title", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("cn-sheet-description", className)}
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
