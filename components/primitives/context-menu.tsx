import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type HostInstance,
  Pressable,
} from "react-native"
import { REASONS } from "./event-details"
import { useComposedRefs } from "./hooks"
import {
  Positioner as MenuPositioner,
  MenuRootImpl,
  type PositionerProps,
  type RootProps,
  useMenuRootContext,
} from "./menu"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

function Root(props: RootProps) {
  return <MenuRootImpl parent="context-menu" {...props} />
}

Root.displayName = "ContextMenuRoot"

interface TriggerState {
  open: boolean
  disabled: boolean
}

type TriggerProps = BaseUIComponentProps<typeof Pressable, TriggerState>

const ACCESSIBILITY_ACTIONS = [{ name: "longpress" }]

function Trigger({
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps) {
  const { floating } = useMenuRootContext("ContextMenu.Trigger")
  const { open, openAt, setOpen } = floating
  const disabled = !!disabledProp || floating.disabled
  const composedRef = useComposedRefs<HostInstance>(
    ref as React.Ref<HostInstance> | undefined,
    floating.triggerRef
  )

  const onLongPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      openAt(
        {
          pageX: event.nativeEvent.pageX,
          pageY: event.nativeEvent.pageY,
          width: 0,
          height: 0,
        },
        REASONS.triggerLongPress,
        event
      )
    },
    [disabled, openAt]
  )

  const onAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (disabled || event.nativeEvent.actionName !== "longpress") return
      setOpen(!open, REASONS.triggerLongPress, event)
    },
    [disabled, open, setOpen]
  )

  const state = React.useMemo<TriggerState>(
    () => ({ open, disabled }),
    [open, disabled]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: composedRef,
    props: [
      {
        accessibilityActions: ACCESSIBILITY_ACTIONS,
        accessibilityState: { expanded: open, disabled },
        onAccessibilityAction,
        onLongPress,
        disabled: disabled || undefined,
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "ContextMenuTrigger"

function Positioner({
  side = "bottom",
  align = "start",
  ...props
}: PositionerProps) {
  return <MenuPositioner side={side} align={align} {...props} />
}

Positioner.displayName = "ContextMenuPositioner"

export type {
  ArrowProps,
  ArrowState,
  BackdropProps,
  BackdropState,
  CheckboxItemProps,
  CheckboxItemState,
  GroupLabelProps,
  GroupProps,
  IndicatorProps,
  ItemProps,
  ItemState,
  MenuChangeEventDetails as ContextMenuChangeEventDetails,
  MenuChangeEventReason as ContextMenuChangeEventReason,
  PopupProps,
  PopupState,
  PortalProps,
  PositionerProps,
  RadioGroupProps,
  RadioItemProps,
  RadioItemState,
  RootProps,
  SeparatorProps,
  SubmenuRootProps,
  SubmenuTriggerProps,
  SubmenuTriggerState,
} from "./menu"
export {
  Arrow,
  Backdrop,
  CheckboxItem,
  CheckboxItemIndicator,
  Group,
  GroupLabel,
  Item,
  Popup,
  Portal,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
  Separator,
  SubmenuRoot,
  SubmenuTrigger,
  useMenuRootContext,
} from "./menu"
export type { TriggerProps, TriggerState }
export { Positioner, Root, Trigger }
