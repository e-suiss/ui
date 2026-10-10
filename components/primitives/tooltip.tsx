import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type HostInstance,
  Pressable,
  View,
} from "react-native"
import { REASONS } from "./event-details"
import {
  FloatingPortal,
  type FloatingRootActions,
  type FloatingRootValue,
  useFloatingPopup,
  useFloatingRoot,
} from "./floating-root"
import { useComposedRefs } from "./hooks"
import { Arrow, type ArrowProps, type ArrowState } from "./popover"
import {
  Positioner as BasePositioner,
  type PositionerProps as BasePositionerProps,
  type PositionerState,
  usePositionerContext,
} from "./positioner"
import type {
  Align,
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  PortalParameters,
  Side,
} from "./types"
import { useRender } from "./use-render"

type OpenChangeReason =
  | typeof REASONS.triggerLongPress
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.backPress
  | typeof REASONS.accessibilityEscape
  | typeof REASONS.imperativeAction
  | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<OpenChangeReason>

type RootActions = FloatingRootActions

interface RootProps {
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<RootActions | null> | undefined
  disabled?: boolean | undefined
  children?: React.ReactNode
}

const TooltipRootContext = React.createContext<FloatingRootValue | null>(null)

function useTooltipRootContext(componentName = "Tooltip part") {
  const context = React.useContext(TooltipRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Tooltip.Root`)
  }
  return context
}

function Root({ children, ...parameters }: RootProps) {
  const root = useFloatingRoot<OpenChangeReason>(parameters)
  return (
    <TooltipRootContext.Provider value={root}>
      {children}
    </TooltipRootContext.Provider>
  )
}

Root.displayName = "TooltipRoot"

interface TriggerState {
  open: boolean
}

type TriggerProps = BaseUIComponentProps<typeof Pressable, TriggerState> & {
  delay?: number | undefined
  closeOnClick?: boolean | undefined
}

const LONG_PRESS_ACTIONS = [{ name: "longpress" }]

function Trigger({
  delay,
  closeOnClick = true,
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps) {
  const root = useTooltipRootContext("TooltipTrigger")
  const { open, setOpen, triggerRef } = root
  const disabled = disabledProp ?? root.disabled
  const composedRef = useComposedRefs<HostInstance>(ref, triggerRef)

  const onLongPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      setOpen(true, REASONS.triggerLongPress, event)
    },
    [disabled, setOpen]
  )

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (open && closeOnClick) setOpen(false, REASONS.triggerPress, event)
    },
    [open, closeOnClick, setOpen]
  )

  const onAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName !== "longpress" || disabled) return
      setOpen(true, REASONS.triggerLongPress, event)
    },
    [disabled, setOpen]
  )

  const state = React.useMemo<TriggerState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: composedRef,
    props: [
      {
        role: "button",
        delayLongPress: delay,
        accessibilityActions: LONG_PRESS_ACTIONS,
        onAccessibilityAction,
        onLongPress,
        onPress,
      },
      elementProps,
      disabledProp == null ? undefined : { disabled: disabledProp },
    ],
  })
}

Trigger.displayName = "TooltipTrigger"

interface PortalProps extends PortalParameters {
  children?: React.ReactNode
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const root = useTooltipRootContext("TooltipPortal")
  return (
    <FloatingPortal root={root} keepMounted={keepMounted} hostName={hostName}>
      <TooltipRootContext.Provider value={root}>
        {children}
      </TooltipRootContext.Provider>
    </FloatingPortal>
  )
}

Portal.displayName = "TooltipPortal"

type PositionerProps = Omit<
  BasePositionerProps,
  "root" | "dismissOnOutsidePress"
>

function Positioner({ side = "top", ...props }: PositionerProps) {
  const root = useTooltipRootContext("TooltipPositioner")
  return <BasePositioner root={root} side={side} {...props} />
}

Positioner.displayName = "TooltipPositioner"

interface PopupState {
  open: boolean
  side: Side
  align: Align
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState>

function Popup({ render, className, style, ref, ...elementProps }: PopupProps) {
  const root = useTooltipRootContext("TooltipPopup")
  const { side, align, isPositioned } = usePositionerContext("TooltipPopup")
  const { open } = root
  const popup = useFloatingPopup({
    root,
    ref,
    role: "tooltip",
    modal: false,
    ready: isPositioned,
  })

  const state = React.useMemo<PopupState>(
    () => ({ open, side, align }),
    [open, side, align]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: popup.ref,
    props: [popup.props, { accessible: true }, elementProps],
  })
}

Popup.displayName = "TooltipPopup"

export type {
  ArrowProps,
  ArrowState,
  ChangeEventDetails,
  OpenChangeReason,
  PopupProps,
  PopupState,
  PortalProps,
  PositionerProps,
  PositionerState,
  RootActions,
  RootProps,
  TriggerProps,
  TriggerState,
}
export {
  Arrow,
  Popup,
  Portal,
  Positioner,
  Root,
  TooltipRootContext,
  Trigger,
  useTooltipRootContext,
}
