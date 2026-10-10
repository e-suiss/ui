import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  Pressable,
  View,
} from "react-native"
import { REASONS } from "./event-details"
import {
  FloatingHandle,
  FloatingPortal,
  type FloatingRootActions,
  type FloatingRootValue,
  type FloatingViewportState,
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
  | typeof REASONS.triggerPress
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
  disabled?: boolean | undefined
  triggerId?: string | null | undefined
  defaultTriggerId?: string | null | undefined
  handle?: Handle<Payload> | undefined
  children?: React.ReactNode | PayloadChildRenderFunction<Payload>
}

const TooltipRootContext = React.createContext<FloatingRootValue | null>(null)

function useTooltipRootContext(componentName = "Tooltip part") {
  const context = React.useContext(TooltipRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Tooltip.Root`)
  }
  return context
}

function Root<Payload = unknown>({
  children,
  ...parameters
}: RootProps<Payload>) {
  const root = useFloatingRoot<OpenChangeReason>(parameters)
  return (
    <TooltipRootContext.Provider value={root}>
      {resolvePayloadChildren(children, root.payload)}
    </TooltipRootContext.Provider>
  )
}

Root.displayName = "TooltipRoot"

interface TriggerState {
  open: boolean
}

type TriggerProps<Payload = unknown> = Omit<
  BaseUIComponentProps<typeof Pressable, TriggerState>,
  "id"
> & {
  delay?: number | undefined
  closeDelay?: number | undefined
  closeOnClick?: boolean | undefined
  handle?: Handle<Payload> | undefined
  payload?: Payload | undefined
  id?: string | undefined
}

const LONG_PRESS_ACTIONS = [{ name: "longpress" }]

function Trigger<Payload = unknown>({
  delay,
  closeDelay = 1500,
  closeOnClick = true,
  disabled: disabledProp,
  handle,
  payload,
  id: idProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps<Payload>) {
  const context = React.useContext(TooltipRootContext)
  if (!context && !handle) {
    throw new Error("TooltipTrigger must be rendered inside Tooltip.Root")
  }
  const registration = useFloatingTriggerRegistration({
    root: context,
    handle,
    id: idProp,
    payload,
    ref,
  })
  const { root, open, id } = registration
  const disabled = disabledProp ?? root?.disabled ?? false
  const setOpen = root?.setOpen
  const openWithTrigger = root?.openWithTrigger

  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const openedByPressRef = React.useRef(false)

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }, [])

  React.useEffect(() => clearCloseTimer, [clearCloseTimer])

  const onLongPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      clearCloseTimer()
      openedByPressRef.current = true
      openWithTrigger?.(id, REASONS.triggerLongPress, event)
    },
    [disabled, openWithTrigger, id, clearCloseTimer]
  )

  const onPressOut = React.useCallback(() => {
    if (!openedByPressRef.current) return
    openedByPressRef.current = false
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null
      setOpen?.(false, REASONS.none)
    }, closeDelay)
  }, [clearCloseTimer, closeDelay, setOpen])

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (!open || !closeOnClick) return
      clearCloseTimer()
      setOpen?.(false, REASONS.triggerPress, event)
    },
    [open, closeOnClick, setOpen, clearCloseTimer]
  )

  const onAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName !== "longpress" || disabled) return
      openWithTrigger?.(id, REASONS.triggerLongPress, event)
    },
    [disabled, openWithTrigger, id]
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
        role: "button",
        delayLongPress: delay,
        accessibilityActions: LONG_PRESS_ACTIONS,
        onAccessibilityAction,
        onLongPress,
        onPressOut,
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
  return (
    <BasePositioner
      root={root}
      side={side}
      dismissOnOutsidePress={false}
      {...props}
    />
  )
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

type ViewportState = FloatingViewportState

type ViewportProps = BaseUIComponentProps<typeof View, ViewportState>

function Viewport({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ViewportProps) {
  const root = useTooltipRootContext("TooltipViewport")
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

Viewport.displayName = "TooltipViewport"

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
  ViewportProps,
  ViewportState,
}
export {
  Arrow,
  createHandle,
  Handle,
  Popup,
  Portal,
  Positioner,
  Root,
  TooltipRootContext,
  Trigger,
  useTooltipRootContext,
  Viewport,
}
