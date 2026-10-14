import * as React from "react"
import { Pressable } from "react-native"
import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
} from "@/components/ui/alert-sheet"

const LONG_PRESS_DELAY = 500

type ContextActionsContextProps = {
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
  const [open, setOpenState] = React.useState(false)

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  const contextValue = React.useMemo(() => ({ setOpen }), [setOpen])

  return (
    <ContextActionsContext.Provider value={contextValue}>
      <AlertSheet
        open={open}
        onOpenChange={(next) => setOpen(next)}
        dismissible={dismissible}
      >
        {children}
      </AlertSheet>
    </ContextActionsContext.Provider>
  )
}

function ContextActionsTrigger({
  onLongPress,
  onAccessibilityAction,
  accessibilityActions,
  delayLongPress = LONG_PRESS_DELAY,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { setOpen } = useContextActions()

  return (
    <Pressable
      accessibilityHint="Long press for actions"
      accessibilityActions={[
        ...(accessibilityActions ?? []),
        { name: "longpress" },
        { name: "showActions", label: "Show actions" },
      ]}
      onAccessibilityAction={(event) => {
        const { actionName } = event.nativeEvent
        if (actionName === "longpress" || actionName === "showActions") {
          setOpen(true)
          return
        }
        onAccessibilityAction?.(event)
      }}
      delayLongPress={delayLongPress}
      onLongPress={(event) => {
        onLongPress?.(event)
        setOpen(true)
      }}
      {...props}
    />
  )
}

function ContextActionsContent({
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

function ContextActionsLabel(
  props: React.ComponentProps<typeof AlertSheetTitle>
) {
  return (
    <AlertSheetHeader>
      <AlertSheetTitle {...props} />
    </AlertSheetHeader>
  )
}

function ContextActionsItem(
  props: React.ComponentProps<typeof AlertSheetAction>
) {
  return <AlertSheetAction {...props} />
}

function ContextActionsSeparator(_props: { className?: string }) {
  return null
}

export {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsSeparator,
  ContextActionsTrigger,
}
