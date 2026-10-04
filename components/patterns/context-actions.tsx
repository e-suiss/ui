"use client"

import { cn } from "cn"
import * as React from "react"

import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
} from "@/components/ui/alert-sheet"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useIsMobile } from "@/hooks/use-mobile"

const LONG_PRESS_DELAY = 500
const LONG_PRESS_TOLERANCE = 10

type ContextActionsContextProps = {
  isMobile: boolean
  setOpen: (open: boolean) => void
}

const ContextActionsContext =
  React.createContext<ContextActionsContextProps | null>(null)

function useContextActions() {
  const context = React.useContext(ContextActionsContext)

  if (!context) {
    throw new Error(
      "useContextActions must be used within a <ContextActions />"
    )
  }

  return context
}

function ContextActions({
  onOpenChange,
  dismissible = true,
  children,
}: {
  onOpenChange?: (open: boolean) => void
  dismissible?: boolean
  children?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [open, setOpenState] = React.useState(false)

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  return (
    <ContextActionsContext.Provider value={{ isMobile, setOpen }}>
      {isMobile ? (
        <AlertSheet
          data-slot="context-actions"
          open={open}
          onOpenChange={(next) => setOpen(next)}
          dismissible={dismissible}
        >
          {children}
        </AlertSheet>
      ) : (
        <ContextMenu
          data-slot="context-actions"
          onOpenChange={(next) => onOpenChange?.(next)}
        >
          {children}
        </ContextMenu>
      )}
    </ContextActionsContext.Provider>
  )
}

function ContextActionsTrigger({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile, setOpen } = useContextActions()
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const startRef = React.useRef<{ x: number; y: number } | null>(null)

  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  if (!isMobile) {
    return (
      <ContextMenuTrigger
        data-slot="context-actions-trigger"
        className={className}
      >
        {children}
      </ContextMenuTrigger>
    )
  }

  const cancel = () => {
    clearTimeout(timerRef.current)
    startRef.current = null
  }

  return (
    <div
      data-slot="context-actions-trigger"
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      className={cn(
        "touch-manipulation outline-none select-none [-webkit-touch-callout:none] focus-visible:focus-ring",
        className
      )}
      onKeyDown={(event) => {
        if (
          event.key === "ContextMenu" ||
          (event.shiftKey && event.key === "F10")
        ) {
          event.preventDefault()
          setOpen(true)
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        cancel()
        setOpen(true)
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse") return
        startRef.current = { x: event.clientX, y: event.clientY }
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          startRef.current = null
          setOpen(true)
        }, LONG_PRESS_DELAY)
      }}
      onPointerMove={(event) => {
        const start = startRef.current
        if (!start) return
        const moved = Math.hypot(
          event.clientX - start.x,
          event.clientY - start.y
        )
        if (moved > LONG_PRESS_TOLERANCE) cancel()
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
    >
      {children}
    </div>
  )
}

function ContextActionsContent({
  cancelLabel = "Cancel",
  className,
  children,
}: {
  cancelLabel?: string
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useContextActions()

  if (isMobile) {
    return (
      <AlertSheetContent
        data-slot="context-actions-content"
        className={className}
      >
        <AlertSheetGroup>{children}</AlertSheetGroup>
        <AlertSheetCancel>{cancelLabel}</AlertSheetCancel>
      </AlertSheetContent>
    )
  }

  return (
    <ContextMenuContent
      data-slot="context-actions-content"
      className={className}
    >
      {children}
    </ContextMenuContent>
  )
}

function ContextActionsLabel({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useContextActions()

  if (isMobile) {
    return (
      <AlertSheetHeader data-slot="context-actions-label">
        <AlertSheetTitle className={className}>{children}</AlertSheetTitle>
      </AlertSheetHeader>
    )
  }

  return (
    <ContextMenuGroup>
      <ContextMenuLabel data-slot="context-actions-label" className={className}>
        {children}
      </ContextMenuLabel>
    </ContextMenuGroup>
  )
}

function ContextActionsItem({
  variant,
  className,
  disabled,
  onClick,
  children,
}: {
  variant?: "default" | "destructive"
  className?: string
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
}) {
  const { isMobile } = useContextActions()
  const Item = isMobile ? AlertSheetAction : ContextMenuItem

  return (
    <Item
      data-slot="context-actions-item"
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Item>
  )
}

function ContextActionsSeparator({ className }: { className?: string }) {
  const { isMobile } = useContextActions()

  if (isMobile) return null

  return (
    <ContextMenuSeparator
      data-slot="context-actions-separator"
      className={className}
    />
  )
}

export {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsSeparator,
  ContextActionsTrigger,
}
