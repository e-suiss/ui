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
  PayloadChildRenderFunction,
} from "./types"
import { useControllableState } from "./use-controllable-state"

type FocusTarget = boolean | React.RefObject<HostInstance | null>

interface FloatingRootActions {
  close: () => void
  unmount: () => void
}

interface FloatingTriggerEntry {
  node: HostInstance | null
  payload: unknown
}

interface FloatingHandleSlot {
  current: FloatingRootValue
}

class FloatingHandle<Payload = unknown> {
  private slots: FloatingHandleSlot[] = []
  private listeners = new Set<() => void>()

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getRoot = (): FloatingRootValue | null =>
    this.slots[this.slots.length - 1]?.current ?? null

  attach(slot: FloatingHandleSlot) {
    this.slots = [...this.slots, slot]
    this.notify()
    return () => {
      this.slots = this.slots.filter((entry) => entry !== slot)
      this.notify()
    }
  }

  notify() {
    for (const listener of this.listeners) listener()
  }

  open(triggerId: string | null = null) {
    this.getRoot()?.openWithTrigger(triggerId, REASONS.imperativeAction)
  }

  openWithPayload(payload: Payload) {
    this.getRoot()?.openWithPayload(payload, REASONS.imperativeAction)
  }

  close() {
    this.getRoot()?.close(REASONS.imperativeAction)
  }

  get isOpen() {
    return this.getRoot()?.open ?? false
  }
}

function createFloatingHandle<Payload = unknown>() {
  return new FloatingHandle<Payload>()
}

function subscribeNothing() {
  return () => {}
}

function getNoRoot() {
  return null
}

function useFloatingHandleRoot(
  handle: FloatingHandle<unknown> | undefined
): FloatingRootValue | null {
  return React.useSyncExternalStore(
    handle ? handle.subscribe : subscribeNothing,
    handle ? handle.getRoot : getNoRoot,
    handle ? handle.getRoot : getNoRoot
  )
}

function resolvePayloadChildren<Payload>(
  children: React.ReactNode | PayloadChildRenderFunction<Payload>,
  payload: unknown
): React.ReactNode {
  if (typeof children === "function") {
    return children({ payload: payload as Payload | undefined })
  }
  return children
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
  triggerId?: string | null | undefined
  defaultTriggerId?: string | null | undefined
  handle?: FloatingHandle<unknown> | undefined
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
  activeTriggerId: string | null
  payload: unknown
  registerTrigger: (id: string, entry: FloatingTriggerEntry) => () => void
  openWithTrigger: (
    triggerId: string | null,
    reason?: string,
    event?: ChangeEvent
  ) => boolean
  openWithPayload: (
    payload: unknown,
    reason?: string,
    event?: ChangeEvent
  ) => boolean
  pressTrigger: (
    triggerId: string,
    reason: string,
    event?: ChangeEvent,
    toggle?: boolean
  ) => boolean
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
  triggerId: triggerIdProp,
  defaultTriggerId = null,
  handle,
}: FloatingRootParameters<Reason>): FloatingRootValue {
  const id = React.useId()
  const popupId = `${id}-popup`
  const triggerRef = React.useRef<HostInstance>(null)
  const popupRef = React.useRef<HostInstance>(null)
  const finalFocusRef = React.useRef<FocusTarget | undefined>(undefined)
  const virtualAnchorRef = React.useRef<AnchorRect | null>(null)
  const { width, height } = useWindowDimensions()
  const [anchor, setAnchorState] = React.useState<AnchorRect | null>(null)
  const triggersRef = React.useRef(new Map<string, FloatingTriggerEntry>())
  const [uncontrolledTriggerId, setUncontrolledTriggerId] = React.useState<
    string | null
  >(defaultTriggerId)
  const activeTriggerId =
    triggerIdProp !== undefined ? triggerIdProp : uncontrolledTriggerId
  const activeTriggerIdRef = React.useRef(activeTriggerId)
  activeTriggerIdRef.current = activeTriggerId
  const [payload, setPayload] = React.useState<unknown>(undefined)

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

  const registerTrigger = React.useCallback(
    (triggerId: string, entry: FloatingTriggerEntry) => {
      const triggers = triggersRef.current
      triggers.set(triggerId, entry)
      if (activeTriggerIdRef.current === triggerId) {
        if (entry.node) triggerRef.current = entry.node
        setPayload(entry.payload)
      }
      return () => {
        if (triggers.get(triggerId) === entry) triggers.delete(triggerId)
        if (triggerRef.current === null || triggerRef.current === entry.node) {
          let fallback: HostInstance | null = null
          for (const remaining of triggers.values()) {
            if (remaining.node) {
              fallback = remaining.node
              break
            }
          }
          triggerRef.current = fallback
        }
      }
    },
    []
  )

  const openWithTrigger = React.useCallback(
    (
      triggerId: string | null,
      reason: string = REASONS.imperativeAction,
      event?: ChangeEvent
    ) => {
      const entry =
        triggerId === null ? undefined : triggersRef.current.get(triggerId)
      const previousNode = triggerRef.current
      if (entry?.node) triggerRef.current = entry.node
      const applied = open ? true : setOpen(true, reason, event)
      if (!applied) {
        triggerRef.current = previousNode
        return false
      }
      setUncontrolledTriggerId(triggerId)
      setPayload(entry?.payload)
      return true
    },
    [open, setOpen]
  )

  const openWithPayload = React.useCallback(
    (
      nextPayload: unknown,
      reason: string = REASONS.imperativeAction,
      event?: ChangeEvent
    ) => {
      const applied = open ? true : setOpen(true, reason, event)
      if (!applied) return false
      setUncontrolledTriggerId(null)
      setPayload(nextPayload)
      return true
    },
    [open, setOpen]
  )

  const pressTrigger = React.useCallback(
    (triggerId: string, reason: string, event?: ChangeEvent, toggle = true) => {
      const current = activeTriggerIdRef.current
      if (open && current !== null && current !== triggerId) {
        return openWithTrigger(triggerId, reason, event)
      }
      if (open) return toggle ? setOpen(false, reason, event) : false
      return openWithTrigger(triggerId, reason, event)
    },
    [open, setOpen, openWithTrigger]
  )

  React.useLayoutEffect(() => {
    if (activeTriggerId === null) return
    const entry = triggersRef.current.get(activeTriggerId)
    if (!entry) return
    if (entry.node) triggerRef.current = entry.node
    setPayload(entry.payload)
  }, [activeTriggerId])

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

  React.useEffect(() => {
    if (!open || activeTriggerId === null) return
    measureAnchor()
  }, [open, activeTriggerId, measureAnchor])

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

  const value = React.useMemo<FloatingRootValue>(
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
      activeTriggerId,
      payload,
      registerTrigger,
      openWithTrigger,
      openWithPayload,
      pressTrigger,
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
      activeTriggerId,
      payload,
      registerTrigger,
      openWithTrigger,
      openWithPayload,
      pressTrigger,
    ]
  )

  const slot = React.useRef<FloatingHandleSlot>({ current: value }).current

  React.useLayoutEffect(() => {
    if (slot.current === value) return
    slot.current = value
    handle?.notify()
  }, [slot, value, handle])

  React.useLayoutEffect(() => handle?.attach(slot), [handle, slot])

  return value
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

interface UseFloatingTriggerRegistrationParameters {
  root?: FloatingRootValue | null | undefined
  handle?: FloatingHandle<unknown> | undefined
  id?: string | undefined
  payload?: unknown
  ref?: React.Ref<HostInstance> | undefined
}

interface UseFloatingTriggerRegistrationReturnValue {
  root: FloatingRootValue | null
  id: string
  open: boolean
  ref: React.RefCallback<HostInstance>
}

function useFloatingTriggerRegistration({
  root: rootParameter,
  handle,
  id: idParameter,
  payload,
  ref,
}: UseFloatingTriggerRegistrationParameters): UseFloatingTriggerRegistrationReturnValue {
  const context = useOptionalFloatingRootContext()
  const handleRoot = useFloatingHandleRoot(handle)
  const root = handle ? handleRoot : (rootParameter ?? context)
  if (!root && !handle) {
    throw new Error("Trigger must be rendered inside its Root component")
  }
  const generatedId = React.useId()
  const id = idParameter ?? generatedId
  const entry = React.useRef<FloatingTriggerEntry>({
    node: null,
    payload,
  }).current
  const rootTriggerRef = root?.triggerRef

  const setNode = React.useCallback(
    (node: HostInstance | null) => {
      const previous = entry.node
      entry.node = node
      if (!rootTriggerRef) return
      if (
        rootTriggerRef.current === null ||
        rootTriggerRef.current === previous
      ) {
        rootTriggerRef.current = node
      }
    },
    [entry, rootTriggerRef]
  )

  React.useLayoutEffect(() => {
    entry.payload = payload
  }, [entry, payload])

  const registerTrigger = root?.registerTrigger

  React.useLayoutEffect(
    () => registerTrigger?.(id, entry),
    [registerTrigger, id, entry]
  )

  const composedRef = useComposedRefs<HostInstance>(ref, setNode)
  const activeTriggerId = root?.activeTriggerId ?? null
  const open =
    !!root?.open && (activeTriggerId === null || activeTriggerId === id)

  return { root, id, open, ref: composedRef }
}

interface UseFloatingTriggerParameters {
  root?: FloatingRootValue | null | undefined
  ref?: React.Ref<HostInstance> | undefined
  disabled?: boolean | undefined
  reason?: string | undefined
  toggle?: boolean | undefined
  role?: Role | undefined
  handle?: FloatingHandle<unknown> | undefined
  id?: string | undefined
  payload?: unknown
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
  handle,
  id: idParameter,
  payload,
}: UseFloatingTriggerParameters = {}): UseFloatingTriggerReturnValue {
  const registration = useFloatingTriggerRegistration({
    root: rootParameter,
    handle,
    id: idParameter,
    payload,
    ref,
  })
  const { root, id, open } = registration
  const disabled = disabledParameter ?? root?.disabled ?? false
  const pressTrigger = root?.pressTrigger

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || !pressTrigger) return
      pressTrigger(id, reason, event, toggle)
    },
    [disabled, pressTrigger, id, reason, toggle]
  )

  return {
    ref: registration.ref,
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

interface FloatingViewportState {
  activationDirection: string | undefined
  transitioning: boolean
}

const INITIAL_VIEWPORT_STATE: FloatingViewportState = {
  activationDirection: undefined,
  transitioning: false,
}

function getActivationDirection(
  previous: AnchorRect,
  next: AnchorRect
): string | undefined {
  const deltaX =
    next.pageX + next.width / 2 - (previous.pageX + previous.width / 2)
  const deltaY =
    next.pageY + next.height / 2 - (previous.pageY + previous.height / 2)
  const parts: string[] = []
  if (deltaX > 0) parts.push("right")
  else if (deltaX < 0) parts.push("left")
  if (deltaY > 0) parts.push("down")
  else if (deltaY < 0) parts.push("up")
  return parts.length > 0 ? parts.join(" ") : undefined
}

interface ViewportSnapshot {
  triggerId: string | null
  anchor: AnchorRect
}

function useFloatingViewportState(
  root: FloatingRootValue
): FloatingViewportState {
  const { open, anchor, activeTriggerId } = root
  const [state, setState] = React.useState(INITIAL_VIEWPORT_STATE)
  const previousRef = React.useRef<ViewportSnapshot | null>(null)
  const activeTriggerIdRef = React.useRef(activeTriggerId)
  activeTriggerIdRef.current = activeTriggerId

  React.useEffect(() => {
    if (!open) {
      previousRef.current = null
      setState(INITIAL_VIEWPORT_STATE)
      return
    }
    if (!anchor) return
    const triggerId = activeTriggerIdRef.current
    const previous = previousRef.current
    previousRef.current = { triggerId, anchor }
    if (!previous || previous.triggerId === triggerId) return
    setState({
      activationDirection: getActivationDirection(previous.anchor, anchor),
      transitioning: true,
    })
    const frame = requestAnimationFrame(() => {
      setState((current) =>
        current.transitioning ? { ...current, transitioning: false } : current
      )
    })
    return () => cancelAnimationFrame(frame)
  }, [open, anchor])

  return state
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
  FloatingHandleSlot,
  FloatingPopupProps,
  FloatingPortalProps,
  FloatingRootActions,
  FloatingRootParameters,
  FloatingRootValue,
  FloatingTriggerEntry,
  FloatingTriggerProps,
  FloatingTriggerState,
  FloatingViewportState,
  FocusTarget,
  UseFloatingPopupParameters,
  UseFloatingPopupReturnValue,
  UseFloatingTriggerParameters,
  UseFloatingTriggerRegistrationParameters,
  UseFloatingTriggerRegistrationReturnValue,
  UseFloatingTriggerReturnValue,
}
export {
  createFloatingHandle,
  FloatingHandle,
  FloatingPortal,
  FloatingRootContext,
  getActivationDirection,
  measureAnchorRect,
  resolvePayloadChildren,
  useFloatingHandleRoot,
  useFloatingPopup,
  useFloatingRoot,
  useFloatingRootContext,
  useFloatingTrigger,
  useFloatingTriggerRegistration,
  useFloatingViewportState,
  useOptionalFloatingRootContext,
}
