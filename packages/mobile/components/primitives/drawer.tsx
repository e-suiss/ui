import * as React from "react"
import {
  type LayoutChangeEvent,
  Pressable,
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
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { scheduleOnRN } from "react-native-worklets"
import {
  Close as DialogClose,
  type CloseProps as DialogCloseProps,
  Description as DialogDescription,
  type DescriptionProps as DialogDescriptionProps,
  Portal as DialogPortal,
  DialogRootContext,
  type DialogRootContextValue,
  Title as DialogTitle,
  type TitleProps as DialogTitleProps,
  Trigger as DialogTrigger,
  type TriggerProps as DialogTriggerProps,
  useDialogRoot,
} from "./dialog"
import { createChangeEventDetails, REASONS } from "./event-details"
import { type FocusTarget, useFloatingPopup } from "./floating-root"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  ChangeEvent,
  PortalParameters,
} from "./types"
import { useRender } from "./use-render"

type SwipeDirection = "up" | "down" | "left" | "right"

type SnapPoint = number | string

type OpenChangeReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.closePress
  | typeof REASONS.backPress
  | typeof REASONS.accessibilityEscape
  | typeof REASONS.imperativeAction
  | typeof REASONS.swipe
  | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<OpenChangeReason>

type SnapPointChangeEventDetails = BaseUIChangeEventDetails<OpenChangeReason>

interface RootActions {
  close: () => void
  unmount: () => void
}

interface RootProps {
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<RootActions | null> | undefined
  modal?: boolean | "trap-focus" | undefined
  disablePointerDismissal?: boolean | undefined
  swipeDirection?: SwipeDirection | undefined
  snapPoints?: SnapPoint[] | undefined
  snapToSequentialPoints?: boolean | undefined
  snapPoint?: SnapPoint | null | undefined
  defaultSnapPoint?: SnapPoint | null | undefined
  onSnapPointChange?:
    | ((
        snapPoint: SnapPoint | null,
        eventDetails: SnapPointChangeEventDetails
      ) => void)
    | undefined
  children?: React.ReactNode
}

interface DrawerProviderContextValue {
  active: boolean
  setDrawerOpen: (drawer: object, open: boolean) => void
}

const DrawerProviderContext =
  React.createContext<DrawerProviderContextValue | null>(null)

interface DrawerRootContextValue {
  dialog: DialogRootContextValue
  modal: boolean | "trap-focus"
  swipeDirection: SwipeDirection
  horizontal: boolean
  snapPoints: SnapPoint[] | undefined
  snapToSequentialPoints: boolean
  activeSnapPoint: SnapPoint | null
  setActiveSnapPoint: (
    snapPoint: SnapPoint | null,
    reason?: OpenChangeReason,
    event?: ChangeEvent
  ) => boolean
  expanded: boolean
  nested: boolean
  nestedDrawerOpen: boolean
  setNestedDrawerOpen: (drawer: object, open: boolean) => void
  swiping: boolean
  setSwiping: (swiping: boolean) => void
  viewportSize: number
  popupSize: number
  setPopupSize: (size: number) => void
  settle: () => void
  settleKey: number
  offset: SharedValue<number>
  restOffset: SharedValue<number>
  swipeProgress: Readonly<SharedValue<number>>
}

const DrawerRootContext = React.createContext<DrawerRootContextValue | null>(
  null
)

function useDrawerRootContext(componentName = "Drawer part") {
  const context = React.useContext(DrawerRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Drawer.Root`)
  }
  return context
}

const SPRING = {
  damping: 32,
  stiffness: 320,
  mass: 1,
  reduceMotion: ReduceMotion.System,
}

const REM = 16

function resolveSnapPoint(point: SnapPoint, viewport: number): number | null {
  if (typeof point === "number") {
    if (!Number.isFinite(point) || point <= 0) return null
    return point <= 1 ? point * viewport : point
  }
  const match = /^(\d+(?:\.\d+)?)(px|rem)$/.exec(point.trim())
  if (!match) return null
  const value = Number(match[1])
  return match[2] === "rem" ? value * REM : value
}

function isSameSnapPoint(a: SnapPoint | null, b: SnapPoint | null) {
  return a === b
}

function useDrawerRegistry() {
  const [openDrawers, setOpenDrawers] = React.useState<ReadonlySet<object>>(
    () => new Set()
  )

  const setDrawerOpen = React.useCallback((drawer: object, open: boolean) => {
    setOpenDrawers((previous) => {
      if (previous.has(drawer) === open) return previous
      const next = new Set(previous)
      if (open) next.add(drawer)
      else next.delete(drawer)
      return next
    })
  }, [])

  return [openDrawers.size > 0, setDrawerOpen] as const
}

function Root({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  actionsRef,
  modal = true,
  disablePointerDismissal,
  swipeDirection = "down",
  snapPoints,
  snapToSequentialPoints = false,
  snapPoint: snapPointProp,
  defaultSnapPoint,
  onSnapPointChange,
  children,
}: RootProps) {
  const parent = React.useContext(DrawerRootContext)
  const provider = React.useContext(DrawerProviderContext)
  const dialog = useDialogRoot({
    role: "dialog",
    modal: modal !== false,
    disablePointerDismissal,
    open,
    defaultOpen,
    onOpenChange: onOpenChange as RootProps["onOpenChange"] as never,
    onOpenChangeComplete,
    actionsRef,
  })
  const isOpen = dialog.root.open
  const horizontal = swipeDirection === "left" || swipeDirection === "right"
  const { width, height } = useWindowDimensions()
  const viewportSize = horizontal ? width : height
  const [token] = React.useState(() => ({}))

  const initialSnapPoint = defaultSnapPoint ?? snapPoints?.[0] ?? null
  const [uncontrolledSnapPoint, setUncontrolledSnapPoint] =
    React.useState<SnapPoint | null>(initialSnapPoint)
  const snapControlled = snapPointProp !== undefined
  const activeSnapPoint = snapControlled
    ? (snapPointProp ?? null)
    : uncontrolledSnapPoint

  const [swiping, setSwiping] = React.useState(false)
  const [popupSize, setPopupSizeState] = React.useState(0)
  const [settleKey, setSettleKey] = React.useState(0)
  const [nestedDrawerOpen, setNestedDrawerOpen] = useDrawerRegistry()

  const offset = useSharedValue(0)
  const restOffset = useSharedValue(0)
  const sizeValue = useSharedValue(0)

  const swipeProgress = useDerivedValue(() => {
    const range = sizeValue.value - restOffset.value
    if (sizeValue.value <= 0 || range <= 0) return 0
    const progress = (offset.value - restOffset.value) / range
    return Math.min(1, Math.max(0, progress))
  })

  const previousOpenRef = React.useRef(isOpen)
  React.useEffect(() => {
    const wasOpen = previousOpenRef.current
    previousOpenRef.current = isOpen
    if (wasOpen === isOpen) return
    if (isOpen) {
      if (!snapControlled) setUncontrolledSnapPoint(initialSnapPoint)
      return
    }
    setPopupSizeState(0)
    sizeValue.value = 0
    offset.value = 0
  }, [isOpen, snapControlled, initialSnapPoint, offset, sizeValue])

  React.useEffect(() => {
    provider?.setDrawerOpen(token, isOpen)
  }, [provider, token, isOpen])

  React.useEffect(() => {
    return () => provider?.setDrawerOpen(token, false)
  }, [provider, token])

  React.useEffect(() => {
    parent?.setNestedDrawerOpen(token, isOpen)
  }, [parent, token, isOpen])

  React.useEffect(() => {
    return () => parent?.setNestedDrawerOpen(token, false)
  }, [parent, token])

  const setActiveSnapPoint = React.useCallback(
    (
      next: SnapPoint | null,
      reason: OpenChangeReason = REASONS.none,
      event?: ChangeEvent
    ) => {
      if (isSameSnapPoint(next, activeSnapPoint)) return false
      const details = createChangeEventDetails(
        reason,
        event,
        dialog.root.triggerRef.current
      )
      onSnapPointChange?.(next, details)
      if (details.isCanceled) return false
      if (!snapControlled) setUncontrolledSnapPoint(next)
      return true
    },
    [activeSnapPoint, onSnapPointChange, snapControlled, dialog.root.triggerRef]
  )

  const settle = React.useCallback(() => {
    setSettleKey((key) => key + 1)
  }, [])

  const setPopupSize = React.useCallback(
    (size: number) => {
      sizeValue.value = size
      setPopupSizeState((previous) =>
        Math.abs(previous - size) < 0.5 ? previous : size
      )
    },
    [sizeValue]
  )

  const expanded = React.useMemo(() => {
    if (!snapPoints || snapPoints.length === 0) return true
    if (activeSnapPoint === null) return false
    const active = resolveSnapPoint(activeSnapPoint, viewportSize)
    const largest = Math.max(
      ...snapPoints.map((point) => resolveSnapPoint(point, viewportSize) ?? 0)
    )
    return active !== null && active >= largest
  }, [snapPoints, activeSnapPoint, viewportSize])

  const value = React.useMemo<DrawerRootContextValue>(
    () => ({
      dialog,
      modal,
      swipeDirection,
      horizontal,
      snapPoints,
      snapToSequentialPoints,
      activeSnapPoint,
      setActiveSnapPoint,
      expanded,
      nested: parent !== null,
      nestedDrawerOpen,
      setNestedDrawerOpen,
      swiping,
      setSwiping,
      viewportSize,
      popupSize,
      setPopupSize,
      settle,
      settleKey,
      offset,
      restOffset,
      swipeProgress,
    }),
    [
      dialog,
      modal,
      swipeDirection,
      horizontal,
      snapPoints,
      snapToSequentialPoints,
      activeSnapPoint,
      setActiveSnapPoint,
      expanded,
      parent,
      nestedDrawerOpen,
      setNestedDrawerOpen,
      swiping,
      viewportSize,
      popupSize,
      setPopupSize,
      settle,
      settleKey,
      offset,
      restOffset,
      swipeProgress,
    ]
  )

  return (
    <DialogRootContext.Provider value={dialog}>
      <DrawerRootContext.Provider value={value}>
        {children}
      </DrawerRootContext.Provider>
    </DialogRootContext.Provider>
  )
}

Root.displayName = "DrawerRoot"

interface ProviderProps {
  children?: React.ReactNode
}

function Provider({ children }: ProviderProps) {
  const [active, setDrawerOpen] = useDrawerRegistry()
  const value = React.useMemo<DrawerProviderContextValue>(
    () => ({ active, setDrawerOpen }),
    [active, setDrawerOpen]
  )
  return (
    <DrawerProviderContext.Provider value={value}>
      {children}
    </DrawerProviderContext.Provider>
  )
}

Provider.displayName = "DrawerProvider"

interface IndentState {
  active: boolean
}

type IndentProps = BaseUIComponentProps<typeof View, IndentState>

function useIndentState(): IndentState {
  const provider = React.useContext(DrawerProviderContext)
  const active = provider?.active ?? false
  return React.useMemo(() => ({ active }), [active])
}

function Indent({
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndentProps) {
  const state = useIndentState()
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

Indent.displayName = "DrawerIndent"

type IndentBackgroundProps = BaseUIComponentProps<typeof View, IndentState>

function IndentBackground({
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndentBackgroundProps) {
  const state = useIndentState()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      { accessible: false, importantForAccessibility: "no-hide-descendants" },
      elementProps,
    ],
  })
}

IndentBackground.displayName = "DrawerIndentBackground"

type TriggerProps = DialogTriggerProps

function Trigger(props: TriggerProps) {
  useDrawerRootContext("DrawerTrigger")
  return <DialogTrigger {...props} />
}

Trigger.displayName = "DrawerTrigger"

interface PortalProps extends PortalParameters {
  children?: React.ReactNode
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const context = useDrawerRootContext("DrawerPortal")
  return (
    <DialogPortal keepMounted={keepMounted} hostName={hostName}>
      <DrawerRootContext.Provider value={context}>
        {children}
      </DrawerRootContext.Provider>
    </DialogPortal>
  )
}

Portal.displayName = "DrawerPortal"

interface BackdropState {
  open: boolean
  swiping: boolean
}

type BackdropProps = BaseUIComponentProps<typeof Pressable, BackdropState> & {
  forceRender?: boolean | undefined
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function Backdrop({
  forceRender = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: BackdropProps) {
  const { dialog, nested, swiping, swipeProgress } =
    useDrawerRootContext("DrawerBackdrop")
  const { open, setOpen } = dialog.root
  const { disablePointerDismissal } = dialog

  const onPress = React.useCallback(
    (event: Parameters<NonNullable<BackdropProps["onPress"]>>[0]) => {
      if (disablePointerDismissal) return
      setOpen(false, REASONS.outsidePress, event)
    },
    [disablePointerDismissal, setOpen]
  )

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - swipeProgress.value,
  }))

  const state = React.useMemo<BackdropState>(
    () => ({ open, swiping }),
    [open, swiping]
  )

  return useRender({
    defaultComponent: AnimatedPressable,
    render,
    className,
    style,
    state,
    ref,
    enabled: open && (!nested || forceRender),
    props: [
      {
        accessible: false,
        importantForAccessibility: "no",
        onPress,
        style: animatedStyle,
      },
      elementProps,
    ],
  })
}

Backdrop.displayName = "DrawerBackdrop"

interface ViewportState {
  open: boolean
  nested: boolean
  nestedDrawerOpen: boolean
}

type ViewportProps = BaseUIComponentProps<typeof View, ViewportState>

const VIEWPORT_STYLE: ViewStyle = { pointerEvents: "box-none" }

function Viewport({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ViewportProps) {
  const { dialog, nested, nestedDrawerOpen } =
    useDrawerRootContext("DrawerViewport")
  const { open } = dialog.root
  const state = React.useMemo<ViewportState>(
    () => ({ open, nested, nestedDrawerOpen }),
    [open, nested, nestedDrawerOpen]
  )
  return useRender({
    defaultComponent: GestureHandlerRootView,
    render,
    className,
    style,
    state,
    ref,
    props: [{ style: VIEWPORT_STYLE }, elementProps],
  })
}

Viewport.displayName = "DrawerViewport"

interface PopupState {
  open: boolean
  expanded: boolean
  nested: boolean
  nestedDrawerOpen: boolean
  swipeDirection: SwipeDirection
  swiping: boolean
}

type PopupProps = Omit<
  BaseUIComponentProps<typeof Animated.View, PopupState>,
  "children"
> & {
  children?: React.ReactNode
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
}

const HIDDEN_STYLE: ViewStyle = { display: "none" }

const MEASURING_STYLE: ViewStyle = { opacity: 0 }

const ACTIVATION_DISTANCE = 10

const FAIL_DISTANCE = 24

const VELOCITY_PROJECTION = 0.2

function claimResponder() {
  return true
}

function rubberBand(distance: number) {
  "worklet"
  return (distance * 80) / (distance + 80)
}

function pickTargetIndex(
  position: number,
  velocity: number,
  stops: readonly number[],
  currentIndex: number,
  sequential: boolean
) {
  "worklet"
  const projected = position + velocity * VELOCITY_PROJECTION
  let lower = 0
  let upper = stops.length - 1
  if (sequential) {
    lower = Math.max(0, currentIndex - 1)
    upper = Math.min(stops.length - 1, currentIndex + 1)
  }
  let best = lower
  let bestDistance = Number.POSITIVE_INFINITY
  for (let index = lower; index <= upper; index += 1) {
    const distance = Math.abs((stops[index] ?? 0) - projected)
    if (distance < bestDistance) {
      best = index
      bestDistance = distance
    }
  }
  return best
}

interface Stop {
  offset: number
  snapPoint: SnapPoint | null
}

function useStops(context: DrawerRootContextValue) {
  const { snapPoints, viewportSize, popupSize, activeSnapPoint } = context
  return React.useMemo(() => {
    const stops: Stop[] = []
    if (snapPoints && snapPoints.length > 0) {
      for (const point of snapPoints) {
        const size = resolveSnapPoint(point, viewportSize)
        if (size === null) continue
        const offset = Math.max(0, popupSize - Math.min(size, popupSize))
        stops.push({ offset, snapPoint: point })
      }
      stops.sort((a, b) => a.offset - b.offset)
    } else {
      stops.push({ offset: 0, snapPoint: null })
    }
    const restIndex = Math.max(
      0,
      stops.findIndex((stop) =>
        isSameSnapPoint(stop.snapPoint, activeSnapPoint)
      )
    )
    const rest = stops[restIndex]?.offset ?? 0
    const largest = snapPoints?.reduce<number>(
      (max, point) => Math.max(max, resolveSnapPoint(point, viewportSize) ?? 0),
      0
    )
    return { stops, restIndex, rest, largest: largest || undefined }
  }, [snapPoints, viewportSize, popupSize, activeSnapPoint])
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
  const context = useDrawerRootContext("DrawerPopup")
  const {
    dialog,
    swipeDirection,
    horizontal,
    snapPoints,
    snapToSequentialPoints,
    setActiveSnapPoint,
    expanded,
    nested,
    nestedDrawerOpen,
    swiping,
    setSwiping,
    popupSize,
    setPopupSize,
    settle,
    settleKey,
    offset,
    restOffset,
  } = context
  const { root, role, titleId, titleRef, hasTitle } = dialog
  const { open, setOpen } = root
  const popup = useFloatingPopup({
    root,
    ref: ref as React.Ref<never>,
    role,
    initialFocus: initialFocus ?? titleRef,
    finalFocus,
  })
  const { stops, restIndex, rest, largest } = useStops(context)
  const hasSnapPoints = snapPoints !== undefined && snapPoints.length > 0
  const sign = swipeDirection === "down" || swipeDirection === "right" ? 1 : -1
  const measuredRef = React.useRef(false)

  React.useEffect(() => {
    if (!open) measuredRef.current = false
  }, [open])

  React.useEffect(() => {
    if (popupSize <= 0 || settleKey < 0) return
    restOffset.value = rest
    if (!measuredRef.current) {
      measuredRef.current = true
      offset.value = rest
      return
    }
    offset.value = withSpring(rest, SPRING)
  }, [popupSize, rest, settleKey, offset, restOffset])

  const requestClose = React.useCallback(() => {
    const applied = setOpen(false, REASONS.swipe)
    if (!applied) settle()
  }, [setOpen, settle])

  const commitStop = React.useCallback(
    (index: number) => {
      const stop = stops[index]
      if (stop) setActiveSnapPoint(stop.snapPoint, REASONS.swipe)
      settle()
    },
    [stops, setActiveSnapPoint, settle]
  )

  const startOffset = useSharedValue(0)

  const gesture = React.useMemo(() => {
    const offsets = stops.map((stop) => stop.offset)
    offsets.push(popupSize)
    const closeIndex = offsets.length - 1
    const minOffset = offsets[0] ?? 0
    const pan = Gesture.Pan()
      .enabled(open && popupSize > 0)
      .onStart(() => {
        startOffset.value = offset.value
        scheduleOnRN(setSwiping, true)
      })
      .onUpdate((event) => {
        const delta =
          (horizontal ? event.translationX : event.translationY) * sign
        const next = startOffset.value + delta
        offset.value =
          next < minOffset ? minOffset - rubberBand(minOffset - next) : next
      })
      .onEnd((event) => {
        const velocity = (horizontal ? event.velocityX : event.velocityY) * sign
        const index = pickTargetIndex(
          offset.value,
          velocity,
          offsets,
          restIndex,
          snapToSequentialPoints
        )
        if (index === closeIndex) scheduleOnRN(requestClose)
        else scheduleOnRN(commitStop, index)
      })
      .onFinalize(() => {
        scheduleOnRN(setSwiping, false)
      })
    if (horizontal) {
      return pan
        .activeOffsetX([-ACTIVATION_DISTANCE, ACTIVATION_DISTANCE])
        .failOffsetY([-FAIL_DISTANCE, FAIL_DISTANCE])
    }
    return pan
      .activeOffsetY([-ACTIVATION_DISTANCE, ACTIVATION_DISTANCE])
      .failOffsetX([-FAIL_DISTANCE, FAIL_DISTANCE])
  }, [
    stops,
    popupSize,
    open,
    horizontal,
    sign,
    restIndex,
    snapToSequentialPoints,
    offset,
    startOffset,
    setSwiping,
    requestClose,
    commitStop,
  ])

  const animatedStyle = useAnimatedStyle(() => {
    const value = offset.value * sign
    return {
      transform: horizontal ? [{ translateX: value }] : [{ translateY: value }],
    }
  })

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout
      setPopupSize(horizontal ? width : height)
    },
    [horizontal, setPopupSize]
  )

  const sizeStyle = React.useMemo<ViewStyle | undefined>(() => {
    if (!hasSnapPoints || largest === undefined) return undefined
    return horizontal ? { width: largest } : { height: largest }
  }, [hasSnapPoints, largest, horizontal])

  const state = React.useMemo<PopupState>(
    () => ({
      open,
      expanded,
      nested,
      nestedDrawerOpen,
      swipeDirection,
      swiping,
    }),
    [open, expanded, nested, nestedDrawerOpen, swipeDirection, swiping]
  )

  const element = useRender({
    defaultComponent: Animated.View,
    render,
    className,
    style,
    state,
    ref: popup.ref,
    props: [
      popup.props,
      {
        accessibilityLabelledBy: hasTitle ? titleId : undefined,
        onStartShouldSetResponder: claimResponder,
        onLayout,
        style: [sizeStyle, animatedStyle],
      },
      elementProps,
      hasSnapPoints && popupSize <= 0 ? { style: MEASURING_STYLE } : undefined,
      open ? undefined : { style: HIDDEN_STYLE },
    ],
  })

  if (!element) return null
  return <GestureDetector gesture={gesture}>{element}</GestureDetector>
}

Popup.displayName = "DrawerPopup"

type ContentState = Record<never, never>

type ContentProps = BaseUIComponentProps<typeof View, ContentState>

const EMPTY_STATE: ContentState = {}

function Content({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ContentProps) {
  useDrawerRootContext("DrawerContent")
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: elementProps,
  })
}

Content.displayName = "DrawerContent"

interface SwipeAreaState {
  open: boolean
  swiping: boolean
  swipeDirection: SwipeDirection
  disabled: boolean
}

type SwipeAreaProps = BaseUIComponentProps<typeof View, SwipeAreaState> & {
  disabled?: boolean | undefined
  swipeDirection?: SwipeDirection | undefined
}

const OPPOSITE: Record<SwipeDirection, SwipeDirection> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
}

const OPEN_DISTANCE = 40

const OPEN_VELOCITY = 400

function SwipeArea({
  disabled = false,
  swipeDirection: swipeDirectionProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: SwipeAreaProps) {
  const { dialog, swipeDirection: rootDirection } =
    useDrawerRootContext("DrawerSwipeArea")
  const { open, setOpen } = dialog.root
  const swipeDirection = swipeDirectionProp ?? OPPOSITE[rootDirection]
  const horizontal = swipeDirection === "left" || swipeDirection === "right"
  const sign = swipeDirection === "down" || swipeDirection === "right" ? 1 : -1
  const [swiping, setSwiping] = React.useState(false)

  const requestOpen = React.useCallback(() => {
    setOpen(true, REASONS.swipe)
  }, [setOpen])

  const gesture = React.useMemo(() => {
    const pan = Gesture.Pan()
      .enabled(!disabled && !open)
      .onStart(() => {
        scheduleOnRN(setSwiping, true)
      })
      .onEnd((event) => {
        const distance =
          (horizontal ? event.translationX : event.translationY) * sign
        const velocity = (horizontal ? event.velocityX : event.velocityY) * sign
        if (distance > OPEN_DISTANCE || velocity > OPEN_VELOCITY) {
          scheduleOnRN(requestOpen)
        }
      })
      .onFinalize(() => {
        scheduleOnRN(setSwiping, false)
      })
    if (horizontal) {
      return pan.activeOffsetX(
        sign > 0 ? ACTIVATION_DISTANCE : -ACTIVATION_DISTANCE
      )
    }
    return pan.activeOffsetY(
      sign > 0 ? ACTIVATION_DISTANCE : -ACTIVATION_DISTANCE
    )
  }, [disabled, open, horizontal, sign, requestOpen])

  const state = React.useMemo<SwipeAreaState>(
    () => ({ open, swiping, swipeDirection, disabled }),
    [open, swiping, swipeDirection, disabled]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ accessible: false, collapsable: false }, elementProps],
  })

  if (!element) return null
  return <GestureDetector gesture={gesture}>{element}</GestureDetector>
}

SwipeArea.displayName = "DrawerSwipeArea"

type TitleProps = DialogTitleProps

function Title(props: TitleProps) {
  useDrawerRootContext("DrawerTitle")
  return <DialogTitle {...props} />
}

Title.displayName = "DrawerTitle"

type DescriptionProps = DialogDescriptionProps

function Description(props: DescriptionProps) {
  useDrawerRootContext("DrawerDescription")
  return <DialogDescription {...props} />
}

Description.displayName = "DrawerDescription"

type CloseProps = DialogCloseProps

function Close(props: CloseProps) {
  useDrawerRootContext("DrawerClose")
  return <DialogClose {...props} />
}

Close.displayName = "DrawerClose"

function useDrawerSwipeProgress() {
  return useDrawerRootContext("useDrawerSwipeProgress").swipeProgress
}

export type {
  BackdropProps,
  BackdropState,
  ChangeEventDetails,
  CloseProps,
  ContentProps,
  ContentState,
  DescriptionProps,
  DrawerRootContextValue,
  IndentBackgroundProps,
  IndentProps,
  IndentState,
  OpenChangeReason,
  PopupProps,
  PopupState,
  PortalProps,
  ProviderProps,
  RootActions,
  RootProps,
  SnapPoint,
  SnapPointChangeEventDetails,
  SwipeAreaProps,
  SwipeAreaState,
  SwipeDirection,
  TitleProps,
  TriggerProps,
  ViewportProps,
  ViewportState,
}
export {
  Backdrop,
  Close,
  Content,
  Description,
  DrawerRootContext,
  Indent,
  IndentBackground,
  Popup,
  Portal,
  Provider,
  Root,
  resolveSnapPoint,
  SwipeArea,
  Title,
  Trigger,
  useDrawerRootContext,
  useDrawerSwipeProgress,
  Viewport,
}
