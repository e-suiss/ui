"use client"

import * as React from "react"

import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"

type ActionMenuContextProps = {
  isMobile: boolean
}

const ActionMenuContext = React.createContext<ActionMenuContextProps | null>(
  null
)

function useActionMenu() {
  const context = React.useContext(ActionMenuContext)

  if (!context) {
    throw new Error("useActionMenu must be used within an <ActionMenu />")
  }

  return context
}

function ActionMenu({
  open,
  defaultOpen,
  onOpenChange,
  dismissible = true,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  dismissible?: boolean
  children?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const rootProps = {
    open,
    defaultOpen,
    onOpenChange: (next: boolean) => onOpenChange?.(next),
    children,
  }

  return (
    <ActionMenuContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <AlertSheet
          data-slot="action-menu"
          dismissible={dismissible}
          {...rootProps}
        />
      ) : (
        <DropdownMenu data-slot="action-menu" {...rootProps} />
      )}
    </ActionMenuContext.Provider>
  )
}

function ActionMenuTrigger(props: {
  render?: React.ReactElement
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}) {
  const { isMobile } = useActionMenu()
  const Trigger = isMobile ? AlertSheetTrigger : DropdownMenuTrigger

  return <Trigger data-slot="action-menu-trigger" {...props} />
}

function ActionMenuContent({
  cancelLabel = "Cancel",
  align,
  side,
  className,
  children,
}: Pick<React.ComponentProps<typeof DropdownMenuContent>, "align" | "side"> & {
  cancelLabel?: string
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useActionMenu()

  if (isMobile) {
    return (
      <AlertSheetContent data-slot="action-menu-content" className={className}>
        <AlertSheetGroup>{children}</AlertSheetGroup>
        <AlertSheetCancel>{cancelLabel}</AlertSheetCancel>
      </AlertSheetContent>
    )
  }

  return (
    <DropdownMenuContent
      data-slot="action-menu-content"
      align={align}
      side={side}
      className={className}
    >
      {children}
    </DropdownMenuContent>
  )
}

function ActionMenuLabel({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useActionMenu()

  if (isMobile) {
    return (
      <AlertSheetHeader data-slot="action-menu-label">
        <AlertSheetTitle className={className}>{children}</AlertSheetTitle>
      </AlertSheetHeader>
    )
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel data-slot="action-menu-label" className={className}>
        {children}
      </DropdownMenuLabel>
    </DropdownMenuGroup>
  )
}

function ActionMenuItem({
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
  const { isMobile } = useActionMenu()
  const Item = isMobile ? AlertSheetAction : DropdownMenuItem

  return (
    <Item
      data-slot="action-menu-item"
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Item>
  )
}

function ActionMenuSeparator({ className }: { className?: string }) {
  const { isMobile } = useActionMenu()

  if (isMobile) return null

  return (
    <DropdownMenuSeparator
      data-slot="action-menu-separator"
      className={className}
    />
  )
}

export {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
}
