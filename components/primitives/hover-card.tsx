import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native"
import { REASONS } from "./event-details"
import {
  FloatingHandle,
  FloatingPortal,
  type FloatingRootActions,
  type FloatingRootValue,
  type FloatingViewportState,
  type FocusTarget,
  resolvePayloadChildren,
  useFloatingPopup,
  useFloatingRoot,
  useFloatingTriggerRegistration,
  useFloatingViewportState,
} from "./floating-root"
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
  PayloadChildRenderFunction,
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

class Handle<Payload = unknown> extends FloatingHandle<Payload> {}

function createHandle<Payload = unknown>(): Handle<Payload> {
  return new Handle<Payload>()
}

interface RootProps<Payload = unknown> {
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<RootActions | null> | undefined
  triggerId?: string | null | undefined
  defaultTriggerId?: string | null | undefined
  handle?: Handle<Payload> | undefined
  children?: React.ReactNode | PayloadChildRenderFunction<Payload>
}

const HoverCardRootContext = React.createContext<FloatingRootValue | null>(null)

function useHoverCardRootContext(componentName = "HoverCard part") {
  const context = React.useContext(HoverCardRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside HoverCard.Root`)
  }
  return context
}

function Root<Payload = unknown>({
  children,
  ...parameters
}: RootProps<Payload>) {
  const root = useFloatingRoot<OpenChangeReason>(parameters)
  return (
    <HoverCardRootContext.Provider value={root}>
      {resolvePayloadChildren(children, root.payload)}
    </HoverCardRootContext.Provider>
  )
}

Root.displayName = "HoverCardRoot"

interface TriggerState {
  open: boolean
}

type TriggerProps<Payload = unknown> = Omit<
  BaseUIComponentProps<typeof Pressable, TriggerState>,
  "id"
> & {
  delay?: number | undefined
  handle?: Handle<Payload> | undefined
  payload?: Payload | undefined
  id?: string | undefined
}

const LONG_PRESS_ACTIONS = [{ name: "longpress" }]

function Trigger<Payload = unknown>({
  delay,
  handle,
  payload,
  id: idProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps<Payload>) {
  const context = React.useContext(HoverCardRootContext)
  if (!context && !handle) {
    throw new Error("HoverCardTrigger must be rendered inside HoverCard.Root")
  }
  const registration = useFloatingTriggerRegistration({
    root: context,
    handle,
    id: idProp,
    payload,
    ref,
  })
  const { open, id } = registration
  const openWithTrigger = registration.root?.openWithTrigger

  const onLongPress = React.useCallback(
    (event: GestureResponderEvent) => {
      openWithTrigger?.(id, REASONS.triggerLongPress, event)
    },
    [openWithTrigger, id]
  )

  const onAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName !== "longpress") return
      openWithTrigger?.(id, REASONS.triggerLongPress, event)
    },
    [openWithTrigger, id]
  )

  const state = React.useMemo<TriggerState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: registration.ref,
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

interface BackdropState {
  open: boolean
}

type BackdropProps = BaseUIComponentProps<typeof View, BackdropState>

function Backdrop({
  render,
  className,
  style,
  ref,
  ...elementProps
}: BackdropProps) {
  const { open } = useHoverCardRootContext("HoverCardBackdrop")
  const state = React.useMemo<BackdropState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: open,
    props: [
      {
        style: StyleSheet.absoluteFill,
        pointerEvents: "none",
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Backdrop.displayName = "HoverCardBackdrop"

type ViewportState = FloatingViewportState

type ViewportProps = BaseUIComponentProps<typeof View, ViewportState>

function Viewport({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ViewportProps) {
  const root = useHoverCardRootContext("HoverCardViewport")
  const state = useFloatingViewportState(root)
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: elementProps,
  })
}

Viewport.displayName = "HoverCardViewport"

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
  BackdropProps,
  BackdropState,
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
  ViewportProps,
  ViewportState,
}
export {
  Arrow,
  Backdrop,
  createHandle,
  Handle,
  HoverCardRootContext,
  Popup,
  Portal,
  Positioner,
  Root,
  Trigger,
  useHoverCardRootContext,
  Viewport,
}
