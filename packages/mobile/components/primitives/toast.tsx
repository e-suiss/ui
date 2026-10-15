import * as React from "react"
import {
  AccessibilityInfo,
  AppState,
  type GestureResponderEvent,
  type HostInstance,
  type LayoutChangeEvent,
  Pressable,
  type PressableProps,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { scheduleOnRN } from "react-native-worklets"
import { Portal as PortalPrimitive } from "./portal"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

type SwipeDirection = "up" | "down" | "left" | "right"

type ToastData = object

type ToastActionProps = Omit<PressableProps, "children"> & {
  children?: React.ReactNode
}

interface ToastObject<Data extends ToastData = ToastData> {
  id: string
  ref?: React.RefObject<HostInstance | null> | undefined
  title?: React.ReactNode
  type?: string | undefined
  description?: React.ReactNode
  timeout?: number | undefined
  priority?: "low" | "high" | undefined
  transitionStatus?: "starting" | "ending" | undefined
  updateKey?: number | undefined
  limited?: boolean | undefined
  height?: number | undefined
  onClose?: (() => void) | undefined
  onRemove?: (() => void) | undefined
  actionProps?: ToastActionProps | undefined
  data?: Data | undefined
}

interface ToastManagerAddOptions<Data extends ToastData>
  extends Omit<
    ToastObject<Data>,
    "id" | "height" | "ref" | "limited" | "updateKey" | "transitionStatus"
  > {
  id?: string | undefined
}

interface ToastManagerUpdateOptions<Data extends ToastData>
  extends Partial<
    Omit<
      ToastObject<Data>,
      "id" | "ref" | "height" | "transitionStatus" | "limited" | "updateKey"
    >
  > {}

type ToastUpdater<Data extends ToastData> =
  | ToastManagerUpdateOptions<Data>
  | ((previous: ToastObject<Data>) => ToastManagerUpdateOptions<Data>)

type ToastPromiseResult<Value, Data extends ToastData> =
  | string
  | ToastManagerUpdateOptions<Data>
  | ((value: Value) => string | ToastManagerUpdateOptions<Data>)

interface ToastManagerPromiseOptions<Value, Data extends ToastData> {
  loading: string | ToastManagerUpdateOptions<Data>
  success: ToastPromiseResult<Value, Data>
  error: ToastPromiseResult<unknown, Data>
}

type ToastManagerEvent =
  | {
      action: "add"
      options: ToastManagerAddOptions<ToastData> & { id: string }
    }
  | { action: "close"; options: { id?: string | undefined } }
  | {
      action: "update"
      options: { id: string; updates: ToastUpdater<ToastData> }
    }
  | {
      action: "promise"
      options: ToastManagerPromiseOptions<unknown, ToastData> & {
        promise: Promise<unknown>
      }
    }

interface ToastManager<Data extends ToastData = ToastData> {
  " subscribe": (listener: (event: ToastManagerEvent) => void) => () => void
  add: <T extends Data = Data>(options: ToastManagerAddOptions<T>) => string
  close: (id?: string) => void
  update: <T extends Data = Data>(id: string, updates: ToastUpdater<T>) => void
  promise: <Value, T extends Data = Data>(
    promise: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, T>
  ) => Promise<Value>
}

interface UseToastManagerReturnValue<Data extends ToastData = ToastData> {
  toasts: ToastObject<Data>[]
  add: <T extends Data = Data>(options: ToastManagerAddOptions<T>) => string
  close: (id?: string) => void
  update: <T extends Data = Data>(id: string, updates: ToastUpdater<T>) => void
  promise: <Value, T extends Data = Data>(
    promise: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, T>
  ) => Promise<Value>
}

let toastCounter = 0

function generateToastId() {
  toastCounter += 1
  return `toast-${Date.now().toString(36)}-${toastCounter}`
}

function createToastManager<
  Data extends ToastData = ToastData,
>(): ToastManager<Data> {
  const listeners = new Set<(event: ToastManagerEvent) => void>()
  const pending: ToastManagerEvent[] = []

  function emit(event: ToastManagerEvent) {
    if (listeners.size === 0) {
      pending.push(event)
      return
    }
    for (const listener of listeners) listener(event)
  }

  return {
    " subscribe": (listener) => {
      listeners.add(listener)
      for (const event of pending.splice(0)) listener(event)
      return () => {
        listeners.delete(listener)
      }
    },
    add: (options) => {
      const id = options.id ?? generateToastId()
      emit({
        action: "add",
        options: { ...(options as ToastManagerAddOptions<ToastData>), id },
      })
      return id
    },
    close: (id) => {
      emit({ action: "close", options: { id } })
    },
    update: (id, updates) => {
      emit({
        action: "update",
        options: { id, updates: updates as ToastUpdater<ToastData> },
      })
    },
    promise: (promise, options) => {
      emit({
        action: "promise",
        options: {
          ...(options as unknown as ToastManagerPromiseOptions<
            unknown,
            ToastData
          >),
          promise,
        },
      })
      return promise
    },
  }
}

interface ToastSnapshot {
  toasts: ToastObject[]
  expanded: boolean
}

interface ToastTimer {
  handle: ReturnType<typeof setTimeout> | null
  remaining: number
  startedAt: number
}

function messageOf(toast: Pick<ToastObject, "title" | "description">) {
  const parts: string[] = []
  if (typeof toast.title === "string" || typeof toast.title === "number") {
    parts.push(String(toast.title))
  }
  if (
    typeof toast.description === "string" ||
    typeof toast.description === "number"
  ) {
    parts.push(String(toast.description))
  }
  return parts.join(". ")
}

function announce(toast: ToastObject) {
  const message = messageOf(toast)
  if (!message) return
  AccessibilityInfo.announceForAccessibilityWithOptions(message, {
    queue: toast.priority !== "high",
  })
}

class ToastStore {
  private snapshot: ToastSnapshot = { toasts: [], expanded: false }
  private listeners = new Set<() => void>()
  private timers = new Map<string, ToastTimer>()
  private pauseReasons = new Set<string>()
  private defaultTimeout = 5000
  private limit = 3

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.snapshot

  configure(timeout: number, limit: number) {
    this.defaultTimeout = timeout
    this.limit = limit
    this.setToasts(this.snapshot.toasts)
  }

  private emit() {
    for (const listener of this.listeners) listener()
  }

  private setSnapshot(next: Partial<ToastSnapshot>) {
    this.snapshot = { ...this.snapshot, ...next }
    this.emit()
  }

  private setToasts(toasts: ToastObject[]) {
    let visible = 0
    const next = toasts.map((toast) => {
      const limited = visible >= this.limit
      if (toast.transitionStatus !== "ending") visible += 1
      return toast.limited === limited ? toast : { ...toast, limited }
    })
    const expanded = next.length === 0 ? false : this.snapshot.expanded
    if (next.length === 0) this.pauseReasons.delete("expanded")
    this.setSnapshot({ toasts: next, expanded })
  }

  private find(id: string) {
    return this.snapshot.toasts.find((toast) => toast.id === id)
  }

  get paused() {
    return this.pauseReasons.size > 0
  }

  add = <Data extends ToastData>(options: ToastManagerAddOptions<Data>) => {
    const id = options.id ?? generateToastId()
    const existing = this.find(id)
    if (existing) {
      this.update(id, options)
      return id
    }
    const toast: ToastObject = {
      ...(options as ToastManagerAddOptions<ToastData>),
      id,
      transitionStatus: "starting",
      updateKey: 0,
      limited: false,
    }
    this.setToasts([toast, ...this.snapshot.toasts])
    this.scheduleTimer(toast)
    announce(toast)
    requestAnimationFrame(() => this.settle(id))
    return id
  }

  update = <Data extends ToastData>(
    id: string,
    updates: ToastUpdater<Data>
  ) => {
    const previous = this.find(id)
    if (!previous) return
    const resolved =
      typeof updates === "function"
        ? (updates as (value: ToastObject) => ToastManagerUpdateOptions<Data>)(
            previous
          )
        : updates
    const next: ToastObject = {
      ...previous,
      ...(resolved as ToastManagerUpdateOptions<ToastData>),
      id,
      updateKey: (previous.updateKey ?? 0) + 1,
    }
    this.setToasts(
      this.snapshot.toasts.map((toast) => (toast.id === id ? next : toast))
    )
    this.scheduleTimer(next)
    if (
      next.title !== previous.title ||
      next.description !== previous.description
    ) {
      announce(next)
    }
  }

  close = (id?: string) => {
    const targets =
      id === undefined
        ? this.snapshot.toasts
        : this.snapshot.toasts.filter((toast) => toast.id === id)
    if (targets.length === 0) return
    const removed = new Set(targets.map((toast) => toast.id))
    for (const toast of targets) this.clearTimer(toast.id)
    this.setToasts(
      this.snapshot.toasts.filter((toast) => !removed.has(toast.id))
    )
    for (const toast of targets) {
      toast.onClose?.()
      toast.onRemove?.()
    }
  }

  promise = <Value, Data extends ToastData>(
    promise: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, Data>
  ) => {
    const normalize = (
      value: string | ToastManagerUpdateOptions<Data>
    ): ToastManagerUpdateOptions<Data> =>
      typeof value === "string" ? { title: value } : value
    const id = this.add<Data>({
      type: "loading",
      timeout: 0,
      ...normalize(options.loading),
    })
    promise.then(
      (value) => {
        const result =
          typeof options.success === "function"
            ? options.success(value)
            : options.success
        this.update<Data>(id, {
          type: "success",
          timeout: undefined,
          ...normalize(result),
        })
      },
      (error: unknown) => {
        const result =
          typeof options.error === "function"
            ? options.error(error)
            : options.error
        this.update<Data>(id, {
          type: "error",
          timeout: undefined,
          ...normalize(result),
        })
      }
    )
    return promise
  }

  private settle(id: string) {
    if (this.find(id)?.transitionStatus !== "starting") return
    this.setToasts(
      this.snapshot.toasts.map((item) =>
        item.id === id ? { ...item, transitionStatus: undefined } : item
      )
    )
  }

  setHeight = (id: string, height: number) => {
    const toast = this.find(id)
    if (!toast || toast.height === height) return
    this.snapshot = {
      ...this.snapshot,
      toasts: this.snapshot.toasts.map((item) =>
        item.id === id ? { ...item, height } : item
      ),
    }
    this.emit()
  }

  setExpanded = (expanded: boolean) => {
    if (expanded === this.snapshot.expanded) return
    if (expanded) this.pause("expanded")
    else this.resume("expanded")
    this.setSnapshot({ expanded })
  }

  pause = (reason: string) => {
    const wasPaused = this.paused
    this.pauseReasons.add(reason)
    if (wasPaused) return
    const now = Date.now()
    for (const timer of this.timers.values()) {
      if (!timer.handle) continue
      clearTimeout(timer.handle)
      timer.handle = null
      timer.remaining = Math.max(0, timer.remaining - (now - timer.startedAt))
    }
  }

  resume = (reason: string) => {
    if (!this.pauseReasons.delete(reason) || this.paused) return
    for (const [id, timer] of this.timers) this.startTimer(id, timer)
  }

  private resolveTimeout(toast: ToastObject) {
    if (toast.type === "loading" && toast.timeout === undefined) return 0
    return toast.timeout ?? this.defaultTimeout
  }

  private scheduleTimer(toast: ToastObject) {
    this.clearTimer(toast.id)
    const timeout = this.resolveTimeout(toast)
    if (timeout <= 0) return
    const timer: ToastTimer = {
      handle: null,
      remaining: timeout,
      startedAt: Date.now(),
    }
    this.timers.set(toast.id, timer)
    if (!this.paused) this.startTimer(toast.id, timer)
  }

  private startTimer(id: string, timer: ToastTimer) {
    timer.startedAt = Date.now()
    timer.handle = setTimeout(() => {
      this.timers.delete(id)
      this.close(id)
    }, timer.remaining)
  }

  private clearTimer(id: string) {
    const timer = this.timers.get(id)
    if (timer?.handle) clearTimeout(timer.handle)
    this.timers.delete(id)
  }

  dispose() {
    for (const timer of this.timers.values()) {
      if (timer.handle) clearTimeout(timer.handle)
    }
    this.timers.clear()
  }
}

const ToastStoreContext = React.createContext<ToastStore | null>(null)

function useToastStore(componentName = "Toast part") {
  const store = React.useContext(ToastStoreContext)
  if (!store) {
    throw new Error(`${componentName} must be rendered inside Toast.Provider`)
  }
  return store
}

function useToastSnapshot(store: ToastStore) {
  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  )
}

interface ProviderProps {
  children?: React.ReactNode
  timeout?: number | undefined
  limit?: number | undefined
  toastManager?: ToastManager | undefined
}

function Provider({
  children,
  timeout = 5000,
  limit = 3,
  toastManager,
}: ProviderProps) {
  const [store] = React.useState(() => new ToastStore())

  React.useEffect(() => {
    store.configure(timeout, limit)
  }, [store, timeout, limit])

  React.useEffect(() => () => store.dispose(), [store])

  React.useEffect(() => {
    if (!toastManager) return
    return toastManager[" subscribe"]((event) => {
      switch (event.action) {
        case "add":
          store.add(event.options)
          break
        case "close":
          store.close(event.options.id)
          break
        case "update":
          store.update(event.options.id, event.options.updates)
          break
        case "promise": {
          const { promise, ...options } = event.options
          store.promise(promise, options).catch(() => undefined)
          break
        }
        default:
          break
      }
    })
  }, [store, toastManager])

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") store.resume("background")
      else store.pause("background")
    })
    return () => subscription.remove()
  }, [store])

  return (
    <ToastStoreContext.Provider value={store}>
      {children}
    </ToastStoreContext.Provider>
  )
}

Provider.displayName = "ToastProvider"

function useToastManager<
  Data extends ToastData = ToastData,
>(): UseToastManagerReturnValue<Data> {
  const store = useToastStore("useToastManager")
  const { toasts } = useToastSnapshot(store)
  return React.useMemo(
    () => ({
      toasts: toasts as ToastObject<Data>[],
      add: store.add,
      close: store.close,
      update: store.update,
      promise: store.promise,
    }),
    [toasts, store]
  )
}

interface ToastPosition {
  index: number
  visibleIndex: number
  offsetY: number
  height: number
  frontmostHeight: number
  expanded: boolean
  limited: boolean
  total: number
}

function useToastPosition(toastId: string): ToastPosition {
  const store = useToastStore("useToastPosition")
  const { toasts, expanded } = useToastSnapshot(store)
  return React.useMemo(() => {
    let offsetY = 0
    let visibleIndex = 0
    let index = -1
    for (let position = 0; position < toasts.length; position += 1) {
      const toast = toasts[position]
      if (!toast) continue
      if (toast.id === toastId) {
        index = position
        break
      }
      if (!toast.limited) {
        offsetY += toast.height ?? 0
        visibleIndex += 1
      }
    }
    const current = toasts[index]
    return {
      index,
      visibleIndex,
      offsetY,
      height: current?.height ?? 0,
      frontmostHeight: toasts[0]?.height ?? 0,
      expanded,
      limited: current?.limited ?? false,
      total: toasts.length,
    }
  }, [toasts, expanded, toastId])
}

interface PortalProps {
  children?: React.ReactNode
  hostName?: string | undefined
}

function Portal({ children, hostName }: PortalProps) {
  const store = useToastStore("ToastPortal")
  const id = React.useId()
  return (
    <PortalPrimitive name={`toast-portal-${id}`} hostName={hostName}>
      <ToastStoreContext.Provider value={store}>
        {children}
      </ToastStoreContext.Provider>
    </PortalPrimitive>
  )
}

Portal.displayName = "ToastPortal"

interface ViewportState {
  expanded: boolean
}

type ViewportProps = BaseUIComponentProps<typeof View, ViewportState>

const VIEWPORT_STYLE: ViewStyle = { pointerEvents: "box-none" }

const COLLAPSE_DELAY = 3000

function Viewport({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ViewportProps) {
  const store = useToastStore("ToastViewport")
  const { expanded } = useToastSnapshot(store)
  const collapseRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCollapse = React.useCallback(() => {
    if (collapseRef.current) clearTimeout(collapseRef.current)
    collapseRef.current = null
  }, [])

  React.useEffect(() => clearCollapse, [clearCollapse])

  const onTouchStart = React.useCallback(() => {
    clearCollapse()
    store.setExpanded(true)
  }, [store, clearCollapse])

  const onTouchEnd = React.useCallback(() => {
    clearCollapse()
    collapseRef.current = setTimeout(() => {
      store.setExpanded(false)
    }, COLLAPSE_DELAY)
  }, [store, clearCollapse])

  const state = React.useMemo<ViewportState>(() => ({ expanded }), [expanded])

  return useRender({
    defaultComponent: GestureHandlerRootView,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        style: VIEWPORT_STYLE,
        onTouchStart,
        onTouchEnd,
        onTouchCancel: onTouchEnd,
      },
      elementProps,
    ],
  })
}

Viewport.displayName = "ToastViewport"

interface ToastRootContextValue {
  toast: ToastObject
  titleId: string
  descriptionId: string
  expanded: boolean
  behind: boolean
  swiping: boolean
  swipeDirection: SwipeDirection | undefined
  close: () => void
  setContentHeight: (height: number | null) => void
}

const ToastRootContext = React.createContext<ToastRootContextValue | null>(null)

function useToastRootContext(componentName = "Toast part") {
  const context = React.useContext(ToastRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Toast.Root`)
  }
  return context
}

interface RootState {
  transitionStatus: "starting" | "ending" | undefined
  expanded: boolean
  limited: boolean
  type: string | undefined
  swiping: boolean
  swipeDirection: SwipeDirection | undefined
}

type RootProps = Omit<
  BaseUIComponentProps<typeof Animated.View, RootState>,
  "children"
> & {
  children?: React.ReactNode
  toast: ToastObject
  swipeDirection?: SwipeDirection | SwipeDirection[] | undefined
}

const DEFAULT_SWIPE_DIRECTIONS: SwipeDirection[] = ["down", "right"]

const DISMISS_DISTANCE = 40

const DISMISS_VELOCITY = 600

const ACTIVATION_DISTANCE = 8

const SPRING = {
  damping: 30,
  stiffness: 320,
  mass: 1,
  reduceMotion: ReduceMotion.System,
}

function resistance(distance: number) {
  "worklet"
  return (distance * 24) / (Math.abs(distance) + 24)
}

function Root({
  toast,
  swipeDirection = DEFAULT_SWIPE_DIRECTIONS,
  render,
  className,
  style,
  ref,
  children,
  ...elementProps
}: RootProps) {
  const store = useToastStore("ToastRoot")
  const position = useToastPosition(toast.id)
  const { width, height } = useWindowDimensions()
  const [swiping, setSwiping] = React.useState(false)
  const [dismissDirection, setDismissDirection] = React.useState<
    SwipeDirection | undefined
  >(undefined)
  const hasContentRef = React.useRef(false)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const axis = useSharedValue(0)
  const directions = Array.isArray(swipeDirection)
    ? swipeDirection
    : [swipeDirection]
  const allowUp = directions.includes("up")
  const allowDown = directions.includes("down")
  const allowLeft = directions.includes("left")
  const allowRight = directions.includes("right")
  const titleId = `${toast.id}-title`
  const descriptionId = `${toast.id}-description`
  const { id } = toast

  const close = React.useCallback(() => {
    store.close(id)
  }, [store, id])

  const onSwipeStart = React.useCallback(() => {
    setSwiping(true)
    store.pause(`swipe-${id}`)
  }, [store, id])

  const onSwipeEnd = React.useCallback(() => {
    setSwiping(false)
    store.resume(`swipe-${id}`)
  }, [store, id])

  const onDismiss = React.useCallback(
    (direction: SwipeDirection) => {
      setDismissDirection(direction)
      store.close(id)
    },
    [store, id]
  )

  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-ACTIVATION_DISTANCE, ACTIVATION_DISTANCE])
        .activeOffsetY([-ACTIVATION_DISTANCE, ACTIVATION_DISTANCE])
        .onStart(() => {
          axis.value = 0
          scheduleOnRN(onSwipeStart)
        })
        .onUpdate((event) => {
          if (axis.value === 0) {
            axis.value =
              Math.abs(event.translationX) > Math.abs(event.translationY)
                ? 1
                : 2
          }
          if (axis.value === 1) {
            const x = event.translationX
            const allowed = x > 0 ? allowRight : allowLeft
            translateX.value = allowed ? x : resistance(x)
            translateY.value = 0
          } else {
            const y = event.translationY
            const allowed = y > 0 ? allowDown : allowUp
            translateY.value = allowed ? y : resistance(y)
            translateX.value = 0
          }
        })
        .onEnd((event) => {
          let direction: SwipeDirection | null = null
          if (axis.value === 1) {
            const x = translateX.value
            const velocity = event.velocityX
            if (
              allowRight &&
              (x > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY)
            )
              direction = "right"
            else if (
              allowLeft &&
              (x < -DISMISS_DISTANCE || velocity < -DISMISS_VELOCITY)
            )
              direction = "left"
          } else if (axis.value === 2) {
            const y = translateY.value
            const velocity = event.velocityY
            if (
              allowDown &&
              (y > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY)
            )
              direction = "down"
            else if (
              allowUp &&
              (y < -DISMISS_DISTANCE || velocity < -DISMISS_VELOCITY)
            )
              direction = "up"
          }
          if (direction === null) {
            translateX.value = withSpring(0, SPRING)
            translateY.value = withSpring(0, SPRING)
            return
          }
          const dismissed: SwipeDirection = direction
          const config = { duration: 180, reduceMotion: ReduceMotion.System }
          const done = (finished?: boolean) => {
            "worklet"
            if (finished) scheduleOnRN(onDismiss, dismissed)
          }
          if (dismissed === "left" || dismissed === "right") {
            translateX.value = withTiming(
              dismissed === "right" ? width : -width,
              config,
              done
            )
          } else {
            translateY.value = withTiming(
              dismissed === "down" ? height : -height,
              config,
              done
            )
          }
        })
        .onFinalize(() => {
          scheduleOnRN(onSwipeEnd)
        }),
    [
      allowUp,
      allowDown,
      allowLeft,
      allowRight,
      width,
      height,
      axis,
      translateX,
      translateY,
      onSwipeStart,
      onSwipeEnd,
      onDismiss,
    ]
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }))

  const setContentHeight = React.useCallback(
    (value: number | null) => {
      hasContentRef.current = value !== null
      if (value) store.setHeight(id, value)
    },
    [store, id]
  )

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      if (hasContentRef.current) return
      store.setHeight(id, event.nativeEvent.layout.height)
    },
    [store, id]
  )

  const onAccessibilityAction = React.useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (event.nativeEvent.actionName === "dismiss") close()
    },
    [close]
  )

  const behind = position.visibleIndex > 0 && !position.expanded

  const state = React.useMemo<RootState>(
    () => ({
      transitionStatus: toast.transitionStatus,
      expanded: position.expanded,
      limited: position.limited,
      type: toast.type,
      swiping,
      swipeDirection: dismissDirection,
    }),
    [
      toast.transitionStatus,
      toast.type,
      position.expanded,
      position.limited,
      swiping,
      dismissDirection,
    ]
  )

  const contextValue = React.useMemo<ToastRootContextValue>(
    () => ({
      toast,
      titleId,
      descriptionId,
      expanded: position.expanded,
      behind,
      swiping,
      swipeDirection: dismissDirection,
      close,
      setContentHeight,
    }),
    [
      toast,
      titleId,
      descriptionId,
      position.expanded,
      behind,
      swiping,
      dismissDirection,
      close,
      setContentHeight,
    ]
  )

  const hasTitle = toast.title != null

  const element = useRender({
    defaultComponent: Animated.View,
    render,
    className,
    style,
    state,
    ref: [ref, toast.ref],
    props: [
      {
        role: "alert",
        accessibilityLiveRegion:
          toast.priority === "high" ? "assertive" : "polite",
        accessibilityLabelledBy: hasTitle ? titleId : undefined,
        accessibilityActions: [{ name: "dismiss", label: "Dismiss" }],
        onAccessibilityAction,
        onAccessibilityEscape: close,
        importantForAccessibility: behind ? "no-hide-descendants" : "auto",
        accessibilityElementsHidden: behind,
        onLayout,
        style: animatedStyle,
        children: (
          <ToastRootContext.Provider value={contextValue}>
            {children}
          </ToastRootContext.Provider>
        ),
      },
      elementProps,
    ],
  })

  if (!element) return null
  return <GestureDetector gesture={gesture}>{element}</GestureDetector>
}

Root.displayName = "ToastRoot"

interface ContentState {
  expanded: boolean
  behind: boolean
}

type ContentProps = BaseUIComponentProps<typeof View, ContentState>

function Content({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ContentProps) {
  const { expanded, behind, setContentHeight } =
    useToastRootContext("ToastContent")

  React.useLayoutEffect(() => {
    setContentHeight(0)
    return () => setContentHeight(null)
  }, [setContentHeight])

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      setContentHeight(event.nativeEvent.layout.height)
    },
    [setContentHeight]
  )

  const state = React.useMemo<ContentState>(
    () => ({ expanded, behind }),
    [expanded, behind]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ onLayout }, elementProps],
  })
}

Content.displayName = "ToastContent"

interface TitleState {
  type: string | undefined
}

type TitleProps = BaseUIComponentProps<typeof Text, TitleState>

function Title({
  render,
  className,
  style,
  ref,
  children,
  ...elementProps
}: TitleProps) {
  const { toast, titleId } = useToastRootContext("ToastTitle")
  const content = children ?? toast.title
  const state = React.useMemo<TitleState>(
    () => ({ type: toast.type }),
    [toast.type]
  )
  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    enabled: content != null && content !== false,
    props: [
      { role: "heading", nativeID: titleId, children: content },
      elementProps,
    ],
  })
}

Title.displayName = "ToastTitle"

type DescriptionState = TitleState

type DescriptionProps = BaseUIComponentProps<typeof Text, DescriptionState>

function Description({
  render,
  className,
  style,
  ref,
  children,
  ...elementProps
}: DescriptionProps) {
  const { toast, descriptionId } = useToastRootContext("ToastDescription")
  const content = children ?? toast.description
  const state = React.useMemo<DescriptionState>(
    () => ({ type: toast.type }),
    [toast.type]
  )
  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    enabled: content != null && content !== false,
    props: [{ nativeID: descriptionId, children: content }, elementProps],
  })
}

Description.displayName = "ToastDescription"

interface ActionState {
  type: string | undefined
}

type ActionProps = BaseUIComponentProps<typeof Pressable, ActionState>

function Action({
  render,
  className,
  style,
  ref,
  children,
  ...elementProps
}: ActionProps) {
  const { toast } = useToastRootContext("ToastAction")
  const actionProps = toast.actionProps
  const content = children ?? actionProps?.children
  const state = React.useMemo<ActionState>(
    () => ({ type: toast.type }),
    [toast.type]
  )
  const { children: _actionChildren, ...actionRest } = actionProps ?? {}
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    enabled: content != null && content !== false,
    props: [
      { role: "button" },
      actionRest,
      elementProps,
      { children: content },
    ],
  })
}

Action.displayName = "ToastAction"

type CloseState = ActionState

type CloseProps = BaseUIComponentProps<typeof Pressable, CloseState>

function Close({ render, className, style, ref, ...elementProps }: CloseProps) {
  const { toast, close } = useToastRootContext("ToastClose")
  const onPress = React.useCallback(
    (_event: GestureResponderEvent) => {
      close()
    },
    [close]
  )
  const state = React.useMemo<CloseState>(
    () => ({ type: toast.type }),
    [toast.type]
  )
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "button", onPress }, elementProps],
  })
}

Close.displayName = "ToastClose"

export type {
  ActionProps,
  ActionState,
  CloseProps,
  CloseState,
  ContentProps,
  ContentState,
  DescriptionProps,
  DescriptionState,
  PortalProps,
  ProviderProps,
  RootProps,
  RootState,
  SwipeDirection,
  TitleProps,
  TitleState,
  ToastActionProps,
  ToastManager,
  ToastManagerAddOptions,
  ToastManagerEvent,
  ToastManagerPromiseOptions,
  ToastManagerUpdateOptions,
  ToastObject,
  ToastPosition,
  ToastRootContextValue,
  UseToastManagerReturnValue,
  ViewportProps,
  ViewportState,
}
export {
  Action,
  Close,
  Content,
  createToastManager,
  Description,
  Portal,
  Provider,
  Root,
  Title,
  useToastManager,
  useToastPosition,
  useToastRootContext,
  Viewport,
}
