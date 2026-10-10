import * as React from "react"
import {
  AccessibilityInfo,
  type GestureResponderEvent,
  type HostInstance,
  type Role,
  useWindowDimensions,
} from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import { useBackHandler, useComposedRefs, useEffectEvent } from "./hooks"
import { Portal } from "./portal"
import type {
  AnchorRect,
  BaseUIChangeEventDetails,
  ChangeEvent,
  MeasurableAnchor,
} from "./types"
import { useControllableState } from "./use-controllable-state"

type FocusTarget = boolean | React.RefObject<HostInstance | null>

interface FloatingRootActions {
  close: () => void
  unmount: () => void
}

interface FloatingRootParameters<Reason extends string = string> {
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, details: BaseUIChangeEventDetails<Reason>) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<FloatingRootActions | null> | undefined
  modal?: boolean | undefined
  disabled?: boolean | undefined
}

interface FloatingRootValue {
  id: string
  popupId: string
  open: boolean
  modal: boolean
  disabled: boolean
  anchor: AnchorRect | null
  triggerRef: React.RefObject<HostInstance | null>
  popupRef: React.RefObject<HostInstance | null>
  finalFocusRef: React.RefObject<FocusTarget | undefined>
  setOpen: (open: boolean, reason: string, event?: ChangeEvent) => boolean
  setOpenWithDetails: (
    open: boolean,
    details: BaseUIChangeEventDetails<string>
  ) => boolean
  openAt: (anchor: AnchorRect, reason?: string, event?: ChangeEvent) => boolean
  close: (reason?: string, event?: ChangeEvent) => boolean
  measureAnchor: () => void
}

function isSameRect(previous: AnchorRect | null, next: AnchorRect | null) {
  if (!previous || !next) return previous === next
  return (
    previous.pageX === next.pageX &&
    previous.pageY === next.pageY &&
    previous.width === next.width &&
    previous.height === next.height
  )
}

function measureAnchorRect(
  node: MeasurableAnchor | null | undefined,
  onMeasure: (rect: AnchorRect) => void
) {
  node?.measure((_x, _y, width, height, pageX, pageY) => {
    onMeasure({ pageX, pageY, width, height })
  })
}

function focusNode(node: HostInstance | null | undefined) {
  if (!node) return undefined
  const timeout = setTimeout(() => {
    AccessibilityInfo.sendAccessibilityEvent(node, "focus")
  }, 50)
  return () => clearTimeout(timeout)
}

function resolveFocusTarget(
  target: FocusTarget | undefined,
  fallback: React.RefObject<HostInstance | null>
): HostInstance | null {
  if (target === false) return null
  if (target === undefined || target === true) return fallback.current
  return target.current ?? fallback.current
}

function useFloatingRoot<Reason extends string = string>({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onOpenChangeComplete,
  actionsRef,
  modal = false,
  disabled = false,
}: FloatingRootParameters<Reason>): FloatingRootValue {
  const id = React.useId()
  const popupId = `${id}-popup`
  const triggerRef = React.useRef<HostInstance>(null)
  const popupRef = React.useRef<HostInstance>(null)
  const finalFocusRef = React.useRef<FocusTarget | undefined>(undefined)
  const virtualAnchorRef = React.useRef<AnchorRect | null>(null)
  const { width, height } = useWindowDimensions()
  const [anchor, setAnchorState] = React.useState<AnchorRect | null>(null)

  const [open, setOpenState] = useControllableState<
    boolean,
    BaseUIChangeEventDetails<string>
  >({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange as
      | ((value: boolean, details: BaseUIChangeEventDetails<string>) => void)
      | undefined,
  })

  const setAnchor = React.useCallback((next: AnchorRect | null) => {
    setAnchorState((previous) => (isSameRect(previous, next) ? previous : next))
  }, [])

  const setOpenWithDetails = React.useCallback(
    (next: boolean, details: BaseUIChangeEventDetails<string>) => {
      const applied = setOpenState(next, details)
      if (applied && !next) virtualAnchorRef.current = null
      return applied
    },
    [setOpenState]
  )

  const setOpen = React.useCallback(
    (next: boolean, reason: string, event?: ChangeEvent) =>
      setOpenWithDetails(
        next,
        createChangeEventDetails(reason, event, triggerRef.current)
      ),
    [setOpenWithDetails]
  )

  const openAt = React.useCallback(
    (
      rect: AnchorRect,
      reason: string = REASONS.triggerPress,
      event?: ChangeEvent
    ) => {
      if (open) {
        virtualAnchorRef.current = rect
        setAnchor(rect)
        return true
      }
      const previous = virtualAnchorRef.current
      virtualAnchorRef.current = rect
      const applied = setOpen(true, reason, event)
      if (!applied) virtualAnchorRef.current = previous
      else setAnchor(rect)
      return applied
    },
    [open, setOpen, setAnchor]
  )

  const close = React.useCallback(
    (reason: string = REASONS.imperativeAction, event?: ChangeEvent) =>
      setOpen(false, reason, event),
    [setOpen]
  )

  const measureAnchor = React.useCallback(() => {
    const virtualAnchor = virtualAnchorRef.current
    if (virtualAnchor) {
      setAnchor(virtualAnchor)
      return
    }
    measureAnchorRect(triggerRef.current, setAnchor)
  }, [setAnchor])

  React.useEffect(() => {
    if (!open) {
      setAnchor(null)
      return
    }
    if (width <= 0 || height <= 0) return
    measureAnchor()
  }, [open, width, height, measureAnchor, setAnchor])

  React.useImperativeHandle(
    actionsRef,
    () => ({
      close: () => {
        close(REASONS.imperativeAction)
      },
      unmount: () => {
        close(REASONS.imperativeAction)
      },
    }),
    [close]
  )

  const handleOpenChangeComplete = useEffectEvent((value: boolean) => {
    onOpenChangeComplete?.(value)
  })

  const previousOpenRef = React.useRef(open)

  React.useEffect(() => {
    const wasOpen = previousOpenRef.current
    previousOpenRef.current = open
    if (wasOpen === open) return
    handleOpenChangeComplete(open)
    if (!wasOpen || open) return
    return focusNode(resolveFocusTarget(finalFocusRef.current, triggerRef))
  }, [open, handleOpenChangeComplete])

  return React.useMemo<FloatingRootValue>(
    () => ({
      id,
      popupId,
      open,
      modal,
      disabled,
      anchor,
      triggerRef,
      popupRef,
      finalFocusRef,
      setOpen,
      setOpenWithDetails,
      openAt,
      close,
      measureAnchor,
    }),
    [
      id,
      popupId,
      open,
      modal,
      disabled,
      anchor,
      setOpen,
      setOpenWithDetails,
      openAt,
      close,
      measureAnchor,
    ]
  )
}

const FloatingRootContext = React.createContext<FloatingRootValue | null>(null)

function useOptionalFloatingRootContext() {
  return React.useContext(FloatingRootContext)
}

function useFloatingRootContext(componentName = "Floating component") {
  const context = React.useContext(FloatingRootContext)
  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside its Root component`
    )
  }
  return context
}

interface FloatingTriggerState {
  open: boolean
  disabled: boolean
}

interface UseFloatingTriggerParameters {
  root?: FloatingRootValue | undefined
  ref?: React.Ref<HostInstance> | undefined
  disabled?: boolean | undefined
  reason?: string | undefined
  toggle?: boolean | undefined
  role?: Role | undefined
}

interface FloatingTriggerProps {
  role: Role
  accessibilityState: { expanded: boolean; disabled: boolean }
  disabled: boolean | undefined
  onPress: (event: GestureResponderEvent) => void
}

interface UseFloatingTriggerReturnValue {
  ref: React.RefCallback<HostInstance>
  state: FloatingTriggerState
  props: FloatingTriggerProps
}

function useFloatingTrigger({
  root: rootParameter,
  ref,
  disabled: disabledParameter,
  reason = REASONS.triggerPress,
  toggle = true,
  role = "button",
}: UseFloatingTriggerParameters = {}): UseFloatingTriggerReturnValue {
  const context = useOptionalFloatingRootContext()
  const root = rootParameter ?? context
  if (!root) {
    throw new Error("Trigger must be rendered inside its Root component")
  }
  const composedRef = useComposedRefs<HostInstance>(ref, root.triggerRef)
  const disabled = disabledParameter ?? root.disabled
  const { open, setOpen } = root

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      setOpen(toggle ? !open : true, reason, event)
    },
    [disabled, setOpen, toggle, open, reason]
  )

  return {
    ref: composedRef,
    state: { open, disabled },
    props: {
      role,
      accessibilityState: { expanded: open, disabled },
      disabled: disabled || undefined,
      onPress,
    },
  }
}

interface UseFloatingPopupParameters {
  root?: FloatingRootValue | undefined
  ref?: React.Ref<HostInstance> | undefined
  role?: Role | undefined
  modal?: boolean | undefined
  ready?: boolean | undefined
  dismissible?: boolean | undefined
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
}

interface FloatingPopupProps {
  nativeID: string
  role: Role | undefined
  accessibilityViewIsModal: boolean
  onAccessibilityEscape: (() => void) | undefined
}

interface UseFloatingPopupReturnValue {
  ref: React.RefCallback<HostInstance>
  props: FloatingPopupProps
}

function useFloatingPopup({
  root: rootParameter,
  ref,
  role,
  modal: modalParameter,
  ready = true,
  dismissible = true,
  initialFocus,
  finalFocus,
}: UseFloatingPopupParameters = {}): UseFloatingPopupReturnValue {
  const context = useOptionalFloatingRootContext()
  const root = rootParameter ?? context
  if (!root) {
    throw new Error("Popup must be rendered inside its Root component")
  }
  const { open, setOpen, popupRef, finalFocusRef } = root
  const modal = modalParameter ?? root.modal
  const composedRef = useComposedRefs<HostInstance>(ref, popupRef)

  React.useLayoutEffect(() => {
    finalFocusRef.current = finalFocus
  })

  const initialFocusRef = React.useRef(initialFocus)
  initialFocusRef.current = initialFocus

  React.useEffect(() => {
    if (!open || !ready) return
    return focusNode(resolveFocusTarget(initialFocusRef.current, popupRef))
  }, [open, ready, popupRef])

  const onBackPress = React.useCallback(() => {
    setOpen(false, REASONS.backPress)
  }, [setOpen])

  const onAccessibilityEscape = React.useCallback(() => {
    setOpen(false, REASONS.accessibilityEscape)
  }, [setOpen])

  useBackHandler(open && dismissible, onBackPress)

  return {
    ref: composedRef,
    props: {
      nativeID: root.popupId,
      role,
      accessibilityViewIsModal: modal,
      onAccessibilityEscape: dismissible ? onAccessibilityEscape : undefined,
    },
  }
}

interface FloatingPortalProps {
  children?: React.ReactNode
  keepMounted?: boolean | undefined
  hostName?: string | undefined
  root?: FloatingRootValue | undefined
}

function FloatingPortal({
  children,
  keepMounted = false,
  hostName,
  root: rootParameter,
}: FloatingPortalProps) {
  const context = useOptionalFloatingRootContext()
  const root = rootParameter ?? context
  if (!root) {
    throw new Error("Portal must be rendered inside its Root component")
  }
  if (!root.open && !keepMounted) return null
  return (
    <Portal hostName={hostName} name={`${root.id}-portal`}>
      <FloatingRootContext.Provider value={root}>
        {children}
      </FloatingRootContext.Provider>
    </Portal>
  )
}

FloatingPortal.displayName = "FloatingPortal"

export type {
  FloatingPopupProps,
  FloatingPortalProps,
  FloatingRootActions,
  FloatingRootParameters,
  FloatingRootValue,
  FloatingTriggerProps,
  FloatingTriggerState,
  FocusTarget,
  UseFloatingPopupParameters,
  UseFloatingPopupReturnValue,
  UseFloatingTriggerParameters,
  UseFloatingTriggerReturnValue,
}
export {
  FloatingPortal,
  FloatingRootContext,
  measureAnchorRect,
  useFloatingPopup,
  useFloatingRoot,
  useFloatingRootContext,
  useFloatingTrigger,
  useOptionalFloatingRootContext,
}
