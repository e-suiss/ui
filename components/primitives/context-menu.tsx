import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  Pressable,
  View,
} from "react-native"
import {
  FloatingContent as FloatingContentPrimitive,
  type FloatingContentProps,
  FloatingOverlay,
  type FloatingRoot,
  type OverlayProps,
  type OverlayRef,
  useFloatingRoot,
  useTriggerRef,
} from "./menu-core"
import { Portal as PortalPrimitive } from "./portal"
import { Slot } from "./slot"
import type {
  ForceMountable,
  SlottablePressableProps,
  SlottableViewProps,
  TriggerRef,
  ViewRef,
} from "./types"

type RelativeTo = "longPress" | "trigger"

type RootProps = SlottableViewProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  relativeTo?: RelativeTo
}

type TriggerProps = SlottablePressableProps

interface PortalProps extends ForceMountable {
  children: React.ReactNode
  hostName?: string
}

type ContentProps = FloatingContentProps

type RootRef = ViewRef
type ContentRef = ViewRef

interface RootContextValue extends FloatingRoot {
  relativeTo: RelativeTo
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "ContextMenu compound components cannot be rendered outside the ContextMenu component"
    )
  }
  return context
}

function Root({
  asChild,
  open,
  defaultOpen,
  onOpenChange,
  relativeTo = "longPress",
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const floating = useFloatingRoot({ open, defaultOpen, onOpenChange })
  const value = React.useMemo(
    () => ({ ...floating, relativeTo }),
    [floating, relativeTo]
  )
  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={value}>
      <Component ref={ref} {...props} />
    </RootContext.Provider>
  )
}

Root.displayName = "ContextMenuRoot"

const ACCESSIBILITY_ACTIONS = [{ name: "longpress" }]

function Trigger({
  asChild,
  disabled,
  onLongPress: onLongPressProp,
  onAccessibilityAction: onAccessibilityActionProp,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const root = useRootContext()
  const composedRef = useTriggerRef(ref, root)

  function onLongPress(event: GestureResponderEvent) {
    if (disabled) return
    if (root.relativeTo === "longPress") {
      root.openAt({
        pageX: event.nativeEvent.pageX,
        pageY: event.nativeEvent.pageY,
        width: 0,
        height: 0,
      })
    } else {
      root.onOpenChange(true)
    }
    onLongPressProp?.(event)
  }

  function onAccessibilityAction(event: AccessibilityActionEvent) {
    if (!disabled && event.nativeEvent.actionName === "longpress") {
      root.onOpenChange(!root.open)
    }
    onAccessibilityActionProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={composedRef}
      role="button"
      aria-haspopup="menu"
      aria-expanded={root.open}
      aria-disabled={!!disabled}
      disabled={disabled}
      accessibilityActions={ACCESSIBILITY_ACTIONS}
      onAccessibilityAction={onAccessibilityAction}
      onLongPress={onLongPress}
      {...props}
    />
  )
}

Trigger.displayName = "ContextMenuTrigger"

function Portal({ forceMount, hostName, children }: PortalProps) {
  const value = useRootContext()
  if (!forceMount && !value.open) return null
  return (
    <PortalPrimitive hostName={hostName} name={`${value.nativeID}_portal`}>
      <RootContext.Provider value={value}>{children}</RootContext.Provider>
    </PortalPrimitive>
  )
}

Portal.displayName = "ContextMenuPortal"

function Overlay(props: OverlayProps & React.RefAttributes<OverlayRef>) {
  const { open, close } = useRootContext()
  return <FloatingOverlay open={open} close={close} {...props} />
}

Overlay.displayName = "ContextMenuOverlay"

function Content(props: ContentProps & React.RefAttributes<ContentRef>) {
  const root = useRootContext()
  return <FloatingContentPrimitive state={root} role="menu" {...props} />
}

Content.displayName = "ContextMenuContent"

export type {
  CheckboxItemProps,
  CheckboxItemRef,
  GroupProps,
  GroupRef,
  ItemIndicatorProps,
  ItemIndicatorRef,
  ItemProps,
  ItemRef,
  LabelProps,
  LabelRef,
  OverlayProps,
  OverlayRef,
  RadioGroupProps,
  RadioGroupRef,
  RadioItemProps,
  RadioItemRef,
  SeparatorProps,
  SeparatorRef,
  SubContentProps,
  SubContentRef,
  SubProps,
  SubRef,
  SubTriggerProps,
  SubTriggerRef,
} from "./menu-core"
export {
  CheckboxItem,
  Group,
  Item,
  ItemIndicator,
  Label,
  RadioGroup,
  RadioItem,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  useSubContext,
} from "./menu-core"
export type {
  ContentProps,
  ContentRef,
  PortalProps,
  RelativeTo,
  RootContextValue,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
}
export { Content, Overlay, Portal, Root, Trigger, useRootContext }
