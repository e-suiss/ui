"use client"

import { Dialog as DialogPrimitive, Slot } from "radix-ui"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FullscreenMenuProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

type FullscreenMenuContextProps = {
  setOpen: (open: boolean) => void
}

const FullscreenMenuContext =
  React.createContext<FullscreenMenuContextProps | null>(null)

function useFullscreenMenu() {
  const context = React.useContext(FullscreenMenuContext)

  if (!context) {
    throw new Error(
      "useFullscreenMenu must be used within a <FullscreenMenu />"
    )
  }

  return context
}

function FullscreenMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: Omit<
  React.ComponentProps<typeof DialogPrimitive.Root>,
  "open" | "defaultOpen" | "onOpenChange"
> &
  FullscreenMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const contextValue = React.useMemo(() => ({ setOpen }), [setOpen])

  return (
    <FullscreenMenuContext.Provider value={contextValue}>
      <DialogPrimitive.Root
        data-slot="fullscreen-menu"
        open={open}
        onOpenChange={(next) => setOpen(next)}
        {...props}
      />
    </FullscreenMenuContext.Provider>
  )
}

function FullscreenMenuIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="fullscreen-menu-icon"
      className={cn(
        "cn-fullscreen-menu-icon *:absolute *:inset-x-0 *:top-1/2 *:-mt-px *:h-0.5 *:rounded-full *:bg-current *:transition-[translate,rotate] *:duration-500 *:ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:*:transition-none",
        className
      )}
    >
      <span />
      <span />
    </span>
  )
}

function FullscreenMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="fullscreen-menu-trigger"
      className={cn(
        "cn-fullscreen-menu-trigger group/fullscreen-menu-trigger",
        className
      )}
      asChild
      {...props}
    >
      <Button variant="ghost" size="icon">
        <FullscreenMenuIcon className="*:first:-translate-y-0.75 *:last:translate-y-0.75 group-data-open/fullscreen-menu-trigger:*:first:translate-y-0 group-data-open/fullscreen-menu-trigger:*:first:rotate-45 group-data-open/fullscreen-menu-trigger:*:last:translate-y-0 group-data-open/fullscreen-menu-trigger:*:last:-rotate-45" />
      </Button>
    </DialogPrimitive.Trigger>
  )
}

function FullscreenMenuContent({
  className,
  children,
  showCloseButton = true,
  closeLabel,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Content
        data-slot="fullscreen-menu-content"
        className={cn(
          "cn-fullscreen-menu-content group/fullscreen-menu",
          className
        )}
        {...props}
      >
        {showCloseButton && <FullscreenMenuHeader closeLabel={closeLabel} />}
        <div
          data-slot="fullscreen-menu-body"
          className="cn-fullscreen-menu-body *:nth-2:[--fullscreen-menu-section:1] *:nth-3:[--fullscreen-menu-section:2] *:nth-4:[--fullscreen-menu-section:3] *:nth-5:[--fullscreen-menu-section:4] *:nth-6:[--fullscreen-menu-section:5]"
        >
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function FullscreenMenuHeader({ closeLabel }: { closeLabel?: string }) {
  return (
    <div
      data-slot="fullscreen-menu-header"
      className="cn-fullscreen-menu-header"
    >
      <DialogPrimitive.Close
        data-slot="fullscreen-menu-close"
        data-label={closeLabel ? "" : undefined}
        asChild
      >
        {closeLabel ? (
          <Button variant="link" className="text-base">
            {closeLabel}
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <FullscreenMenuIcon className="*:first:rotate-45 *:last:-rotate-45 group-data-closed/fullscreen-menu:*:first:-translate-y-0.75 group-data-closed/fullscreen-menu:*:first:rotate-0 group-data-closed/fullscreen-menu:*:last:translate-y-0.75 group-data-closed/fullscreen-menu:*:last:rotate-0 starting:*:first:-translate-y-0.75 starting:*:first:rotate-0 starting:*:last:translate-y-0.75 starting:*:last:rotate-0 group-data-closed/fullscreen-menu:*:duration-350" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </DialogPrimitive.Close>
    </div>
  )
}

function FullscreenMenuTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="fullscreen-menu-title"
      className={cn("cn-fullscreen-menu-title", className)}
      {...props}
    />
  )
}

function FullscreenMenuGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fullscreen-menu-group"
      className={cn(
        "cn-fullscreen-menu-group group/fullscreen-menu-group *:nth-1:[--fullscreen-menu-index:1] *:nth-2:[--fullscreen-menu-index:2] *:nth-3:[--fullscreen-menu-index:3] *:nth-4:[--fullscreen-menu-index:4] *:nth-5:[--fullscreen-menu-index:5] *:nth-6:[--fullscreen-menu-index:6] *:nth-7:[--fullscreen-menu-index:7] *:nth-8:[--fullscreen-menu-index:8] *:nth-9:[--fullscreen-menu-index:9] *:nth-10:[--fullscreen-menu-index:10]",
        className
      )}
      {...props}
    />
  )
}

function FullscreenMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fullscreen-menu-label"
      className={cn("cn-fullscreen-menu-label", className)}
      {...props}
    />
  )
}

function FullscreenMenuLink({
  asChild = false,
  isActive = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const { setOpen } = useFullscreenMenu()
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="fullscreen-menu-link"
      data-active={isActive ? "" : undefined}
      aria-current={isActive ? "page" : undefined}
      onClick={(event) => {
        onClick?.(event)
        setOpen(false)
      }}
      className={cn("cn-fullscreen-menu-link", className)}
      {...props}
    />
  )
}

function FullscreenMenuClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return <DialogPrimitive.Close data-slot="fullscreen-menu-close" {...props} />
}

export {
  FullscreenMenu,
  FullscreenMenuClose,
  FullscreenMenuContent,
  FullscreenMenuGroup,
  FullscreenMenuLabel,
  FullscreenMenuLink,
  FullscreenMenuTitle,
  FullscreenMenuTrigger,
}
