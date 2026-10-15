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
  isOpen,
  defaultOpen,
  onOpenChange,
  dismissible = true,
  children,
}: {
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  dismissible?: boolean
  children?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const rootProps = { isOpen, defaultOpen, onOpenChange, children }

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
  props: React.ComponentProps<typeof DropdownMenuTrigger>
) {
  const { isMobile } = useActionMenu()
  const Trigger = isMobile ? AlertSheetTrigger : DropdownMenuTrigger

  return <Trigger data-slot="action-menu-trigger" {...props} />
}

function ActionMenuContent({
  cancelLabel = "Cancel",
  placement,
  offset,
  crossOffset,
  className,
  children,
  ...props
}: {
  className?: string
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
} & Pick<
  React.ComponentProps<typeof DropdownMenuContent>,
  "placement" | "offset" | "crossOffset"
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
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
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
}: {
  className?: string
  children?: React.ReactNode
  id?: string
}) {
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
  isDisabled,
  onAction,
  ...props
}: {
  className?: string
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
  variant?: "default" | "destructive"
  isDisabled?: boolean
  onAction?: () => void
}) {
  const { isMobile } = useActionMenu()

  if (isMobile) {
    return (
      <AlertSheetAction
        data-slot="action-menu-item"
        variant={variant}
        isDisabled={isDisabled}
        onPress={onAction}
        {...props}
      />
    )
  }

  return (
    <DropdownMenuItem
      data-slot="action-menu-item"
      variant={variant}
      isDisabled={isDisabled}
      onAction={onAction}
      {...props}
    />
  )
}

function ActionMenuSeparator(props: { className?: string }) {
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
