import type * as React from "react"
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
  return (
    <AlertSheet
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => onOpenChange?.(next)}
      dismissible={dismissible}
    >
      {children}
    </AlertSheet>
  )
}

function ActionMenuTrigger(
  props: React.ComponentProps<typeof AlertSheetTrigger>
) {
  return <AlertSheetTrigger {...props} />
}

function ActionMenuContent({
  cancelLabel = "Cancel",
  children,
  ...props
}: React.ComponentProps<typeof AlertSheetContent> & {
  cancelLabel?: string
}) {
  return (
    <AlertSheetContent {...props}>
      <AlertSheetGroup>{children}</AlertSheetGroup>
      <AlertSheetCancel>{cancelLabel}</AlertSheetCancel>
    </AlertSheetContent>
  )
}

function ActionMenuLabel(props: React.ComponentProps<typeof AlertSheetTitle>) {
  return (
    <AlertSheetHeader>
      <AlertSheetTitle {...props} />
    </AlertSheetHeader>
  )
}

function ActionMenuItem(props: React.ComponentProps<typeof AlertSheetAction>) {
  return <AlertSheetAction {...props} />
}

function ActionMenuSeparator(_props: { className?: string }) {
  return null
}

export {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
}
