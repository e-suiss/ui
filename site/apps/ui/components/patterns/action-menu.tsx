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
}: Pick<
  React.ComponentProps<typeof DropdownMenu>,
  "open" | "defaultOpen" | "children"
> & {
  onOpenChange?: (open: boolean) => void
  dismissible?: boolean
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

function ActionMenuTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    render?: React.ReactElement
  }
) {
  const { isMobile } = useActionMenu()
  const Trigger = isMobile ? AlertSheetTrigger : DropdownMenuTrigger

  return <Trigger data-slot="action-menu-trigger" {...props} />
}

function ActionMenuContent({
  cancelLabel = "Cancel",
  align,
  alignOffset,
  side,
  sideOffset,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> &
  Pick<
    React.ComponentProps<typeof DropdownMenuContent>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    cancelLabel?: string
  }) {
  const { isMobile } = useActionMenu()

  if (isMobile) {
    return (
      <AlertSheetContent
        data-slot="action-menu-content"
        className={className}
        {...props}
      >
        <AlertSheetGroup>{children}</AlertSheetGroup>
        <AlertSheetCancel>{cancelLabel}</AlertSheetCancel>
      </AlertSheetContent>
    )
  }

  return (
    <DropdownMenuContent
      data-slot="action-menu-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={className}
      {...props}
    >
      {children}
    </DropdownMenuContent>
  )
}

function ActionMenuLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { isMobile } = useActionMenu()

  if (isMobile) {
    return (
      <AlertSheetHeader data-slot="action-menu-label">
        <AlertSheetTitle className={className} {...props}>
          {children}
        </AlertSheetTitle>
      </AlertSheetHeader>
    )
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel
        data-slot="action-menu-label"
        className={className}
        {...props}
      >
        {children}
      </DropdownMenuLabel>
    </DropdownMenuGroup>
  )
}

function ActionMenuItem({
  variant,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  variant?: "default" | "destructive"
  disabled?: boolean
}) {
  const { isMobile } = useActionMenu()
  const Item = isMobile ? AlertSheetAction : DropdownMenuItem

  return (
    <Item
      data-slot="action-menu-item"
      variant={variant}
      disabled={disabled}
      {...props}
    />
  )
}

function ActionMenuSeparator(props: React.HTMLAttributes<HTMLElement>) {
  const { isMobile } = useActionMenu()

  if (isMobile) return null

  return <DropdownMenuSeparator data-slot="action-menu-separator" {...props} />
}

export {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
}
