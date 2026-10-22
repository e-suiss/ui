"use client"

import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Dialog as DialogPrimitive,
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
  isOpen: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: DialogTriggerPrimitiveProps) {
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
      <DialogTriggerPrimitive isOpen={open} onOpenChange={setOpen} {...props} />
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
}: Omit<React.ComponentProps<typeof Button>, "children">) {
  return (
    <Button
      data-slot="fullscreen-menu-trigger"
      variant="ghost"
      size="icon"
      className={cn(
        "cn-fullscreen-menu-trigger group/fullscreen-menu-trigger",
        className
      )}
      {...props}
    >
      <FullscreenMenuIcon className="*:first:-translate-y-0.75 *:last:translate-y-0.75 group-aria-expanded/fullscreen-menu-trigger:*:first:translate-y-0 group-aria-expanded/fullscreen-menu-trigger:*:first:rotate-45 group-aria-expanded/fullscreen-menu-trigger:*:last:translate-y-0 group-aria-expanded/fullscreen-menu-trigger:*:last:-rotate-45" />
    </Button>
  )
}

function FullscreenMenuContent({
  className,
  children,
  showCloseButton = true,
  closeLabel,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <ModalOverlayPrimitive
      data-slot="fullscreen-menu-content"
      className={cn(
        "cn-fullscreen-menu-content fixed inset-0 flex flex-col overflow-x-hidden overflow-y-auto group/fullscreen-menu",
        className
      )}
      {...props}
    >
      <ModalPrimitive className="flex min-h-full flex-col">
        <DialogPrimitive className="flex flex-1 flex-col outline-none">
          {showCloseButton && <FullscreenMenuHeader closeLabel={closeLabel} />}
          <div
            data-slot="fullscreen-menu-body"
            className="cn-fullscreen-menu-body *:nth-2:[--fullscreen-menu-section:1] *:nth-3:[--fullscreen-menu-section:2] *:nth-4:[--fullscreen-menu-section:3] *:nth-5:[--fullscreen-menu-section:4] *:nth-6:[--fullscreen-menu-section:5]"
          >
            {children}
          </div>
        </DialogPrimitive>
      </ModalPrimitive>
    </ModalOverlayPrimitive>
  )
}

function FullscreenMenuHeader({ closeLabel }: { closeLabel?: string }) {
  return (
    <div
      data-slot="fullscreen-menu-header"
      className="cn-fullscreen-menu-header"
    >
      <Button
        slot="close"
        data-slot="fullscreen-menu-close"
        data-label={closeLabel ? "" : undefined}
        variant={closeLabel ? "link" : "ghost"}
        size={closeLabel ? undefined : "icon"}
        className={cn(closeLabel && "text-base")}
      >
        {closeLabel ?? (
          <>
            <FullscreenMenuIcon className="*:first:rotate-45 *:last:-rotate-45 group-data-exiting/fullscreen-menu:*:first:-translate-y-0.75 group-data-exiting/fullscreen-menu:*:first:rotate-0 group-data-exiting/fullscreen-menu:*:last:translate-y-0.75 group-data-exiting/fullscreen-menu:*:last:rotate-0 group-data-entering/fullscreen-menu:*:first:-translate-y-0.75 group-data-entering/fullscreen-menu:*:first:rotate-0 group-data-entering/fullscreen-menu:*:last:translate-y-0.75 group-data-entering/fullscreen-menu:*:last:rotate-0 group-data-exiting/fullscreen-menu:*:duration-350" />
            <span className="sr-only">Close</span>
          </>
        )}
      </Button>
    </div>
  )
}

function FullscreenMenuTitle({
  className,
  ...props
}: Omit<HeadingProps, "className"> & { className?: string }) {
  return (
    <Heading
      slot="title"
      level={2}
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
  render,
  isActive = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"a"> & {
  isActive?: boolean
  render?: (
    props: React.ComponentProps<"a"> & { "data-slot": string }
  ) => React.ReactNode
}) {
  const { setOpen } = useFullscreenMenu()
  const linkProps = {
    "data-slot": "fullscreen-menu-link",
    "data-active": isActive ? "" : undefined,
    "aria-current": isActive ? ("page" as const) : undefined,
    className: cn(
      "flex min-h-11 items-center rounded-lg text-2xl font-semibold text-foreground outline-none transition-[opacity,translate,color] delay-(--fullscreen-menu-delay) duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] select-none [--fullscreen-menu-delay:calc(var(--fullscreen-menu-index,1)*30ms+var(--fullscreen-menu-section,0)*60ms+100ms)] hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-active:text-primary group-data-exiting/fullscreen-menu:-translate-y-2 group-data-exiting/fullscreen-menu:opacity-0 group-data-exiting/fullscreen-menu:delay-0 group-data-exiting/fullscreen-menu:duration-200 group-data-entering/fullscreen-menu:-translate-y-2 group-data-entering/fullscreen-menu:opacity-0 group-has-data-[slot=fullscreen-menu-label]/fullscreen-menu-group:min-h-10 group-has-data-[slot=fullscreen-menu-label]/fullscreen-menu-group:text-lg group-has-data-[slot=fullscreen-menu-label]/fullscreen-menu-group:font-medium motion-reduce:transition-none",
      className
    ),
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      setOpen(false)
    },
    ...props,
  }

  if (render) return render(linkProps)
  return <a {...linkProps} />
}

function FullscreenMenuClose({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      slot="close"
      data-slot="fullscreen-menu-close"
      className={className}
      {...props}
    />
  )
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
