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
  type FocusTarget,
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
  children?: React.ReactNode
}

const HoverCardRootContext = React.createContext<FloatingRootValue | null>(null)

function useHoverCardRootContext(componentName = "HoverCard part") {
  const context = React.useContext(HoverCardRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside HoverCard.Root`)
  }
  return context
}

function Root({ children, ...parameters }: RootProps) {
  const root = useFloatingRoot<OpenChangeReason>(parameters)
  return (
    <HoverCardRootContext.Provider value={root}>
      {children}
    </HoverCardRootContext.Provider>
  )
}

Root.displayName = "HoverCardRoot"

interface TriggerState {
  open: boolean
}

type TriggerProps = BaseUIComponentProps<typeof Pressable, TriggerState> & {
  delay?: number | undefined
}

const LONG_PRESS_ACTIONS = [{ name: "longpress" }]

function Trigger({
  delay,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps) {
  const { open, setOpen, triggerRef } =
    useHoverCardRootContext("HoverCardTrigger")
  const composedRef = useComposedRefs<HostInstance>(ref, triggerRef)

  const onLongPress = React.useCallback(
    (event: GestureResponderEvent) => {
      setOpen(true, REASONS.triggerLongPress, event)
    },
    [setOpen]
  )

  const onAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName !== "longpress") return
      setOpen(true, REASONS.triggerLongPress, event)
    },
    [setOpen]
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
        role: "link",
        delayLongPress: delay,
        accessibilityActions: LONG_PRESS_ACTIONS,
        onAccessibilityAction,
        onLongPress,
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "HoverCardTrigger"

interface PortalProps extends PortalParameters {
  children?: React.ReactNode
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const root = useHoverCardRootContext("HoverCardPortal")
  return (
    <FloatingPortal root={root} keepMounted={keepMounted} hostName={hostName}>
      <HoverCardRootContext.Provider value={root}>
        {children}
      </HoverCardRootContext.Provider>
    </FloatingPortal>
  )
}

Portal.displayName = "HoverCardPortal"

type PositionerProps = Omit<
  BasePositionerProps,
  "root" | "dismissOnOutsidePress"
>

function Positioner(props: PositionerProps) {
  const root = useHoverCardRootContext("HoverCardPositioner")
  return <BasePositioner root={root} {...props} />
}

Positioner.displayName = "HoverCardPositioner"

interface PopupState {
  open: boolean
  side: Side
  align: Align
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState> & {
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
}

function claimResponder() {
  return true
}

function Popup({
  initialFocus,
  finalFocus,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PopupProps) {
  const root = useHoverCardRootContext("HoverCardPopup")
  const { side, align, isPositioned } = usePositionerContext("HoverCardPopup")
  const { open } = root
  const popup = useFloatingPopup({
    root,
    ref,
    modal: false,
    ready: isPositioned,
    initialFocus,
    finalFocus,
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
    props: [
      popup.props,
      { onStartShouldSetResponder: claimResponder },
      elementProps,
    ],
  })
}

Popup.displayName = "HoverCardPopup"

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
  HoverCardRootContext,
  Popup,
  Portal,
  Positioner,
  Root,
  Trigger,
  useHoverCardRootContext,
}
