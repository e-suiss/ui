import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  Image,
  type ImageLoadEvent,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  ReduceMotion,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { scheduleOnRN } from "react-native-worklets"
import { createChangeEventDetails, REASONS } from "./event-details"
import { useBackHandler } from "./hooks"
import { Portal as PortalPrimitive } from "./portal"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  ChangeEvent,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

const IMAGE_VIEWER_REASONS = {
  ...REASONS,
  accessibilityAction: "accessibility-action",
} as const

type OpenChangeReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.closePress
  | typeof REASONS.backPress
  | typeof REASONS.accessibilityEscape
  | typeof REASONS.swipe
  | typeof REASONS.imperativeAction

type IndexChangeReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.swipe
  | typeof IMAGE_VIEWER_REASONS.accessibilityAction

type OpenChangeEventDetails = BaseUIChangeEventDetails<OpenChangeReason>

type IndexChangeEventDetails = BaseUIChangeEventDetails<IndexChangeReason>

interface ImageViewerImage {
  source: ImageSourcePropType
  accessibilityLabel?: string | undefined
}

interface ImageSize {
  width: number
  height: number
}

interface RootContextValue {
  images: ImageViewerImage[]
  count: number
  open: boolean
  index: number
  setOpen: (
    open: boolean,
    reason: OpenChangeReason,
    event?: ChangeEvent
  ) => boolean
  setIndex: (
    index: number,
    reason: IndexChangeReason,
    event?: ChangeEvent
  ) => boolean
}

interface ViewerContextValue {
  current: SharedValue<number>
  scale: SharedValue<number>
  translateX: SharedValue<number>
  translateY: SharedValue<number>
  dismissX: SharedValue<number>
  dismissY: SharedValue<number>
  progress: SharedValue<number>
  controls: SharedValue<number>
}

interface RootProps {
  images: ImageViewerImage[]
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, eventDetails: OpenChangeEventDetails) => void)
    | undefined
  index?: number | undefined
  defaultIndex?: number | undefined
  onIndexChange?:
    | ((index: number, eventDetails: IndexChangeEventDetails) => void)
    | undefined
  children?: React.ReactNode
}

interface TriggerState {
  open: boolean
  index: number
}

interface PopupState {
  index: number
  count: number
}

type TriggerProps = BaseUIComponentProps<typeof Pressable, TriggerState> & {
  index?: number | undefined
}

interface PortalProps {
  children?: React.ReactNode
  hostName?: string | undefined
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState>

type BackdropProps = BaseUIComponentProps<typeof Animated.View, PopupState>

type ControlsProps = BaseUIComponentProps<typeof Animated.View, PopupState>

type PagesProps = BaseUIComponentProps<typeof View, PopupState>

type CloseProps = BaseUIComponentProps<typeof Pressable, PopupState>

const MIN_SCALE = 1

const MAX_SCALE = 4

const DOUBLE_TAP_SCALE = 2.5

const PAGE_DURATION = 250

const ZOOM_DURATION = 250

const TIMING = { duration: ZOOM_DURATION, reduceMotion: ReduceMotion.System }

const RootContext = React.createContext<RootContextValue | null>(null)

const ViewerContext = React.createContext<ViewerContextValue | null>(null)

function accessibilityStep(event: AccessibilityActionEvent) {
  if (event.nativeEvent.actionName === "increment") return 1
  if (event.nativeEvent.actionName === "decrement") return -1
  return 0
}

function useRootContext(componentName = "ImageViewer part") {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside ImageViewer.Root`)
  }
  return context
}

function useViewerContext(componentName: string) {
  const context = React.useContext(ViewerContext)
  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside ImageViewer.Popup`
    )
  }
  return context
}

function clamp(value: number, min: number, max: number) {
  "worklet"
  return Math.min(Math.max(value, min), max)
}

function Root({
  images,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  children,
}: RootProps) {
  const count = images.length
  const [open, setOpenState] = useControllableState<
    boolean,
    OpenChangeEventDetails
  >({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange })
  const [rawIndex, setIndexState] = useControllableState<
    number,
    IndexChangeEventDetails
  >({ value: indexProp, defaultValue: defaultIndex, onChange: onIndexChange })
  const index = clamp(rawIndex, 0, Math.max(0, count - 1))

  const setOpen = React.useCallback(
    (next: boolean, reason: OpenChangeReason, event?: ChangeEvent) =>
      setOpenState(next, createChangeEventDetails(reason, event)),
    [setOpenState]
  )

  const setIndex = React.useCallback(
    (next: number, reason: IndexChangeReason, event?: ChangeEvent) =>
      setIndexState(
        clamp(next, 0, Math.max(0, count - 1)),
        createChangeEventDetails(reason, event)
      ),
    [setIndexState, count]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({ images, count, open, index, setOpen, setIndex }),
    [images, count, open, index, setOpen, setIndex]
  )

  return <RootContext.Provider value={context}>{children}</RootContext.Provider>
}

Root.displayName = "ImageViewerRoot"

function Trigger({
  index = 0,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps) {
  const { open, setOpen, setIndex } = useRootContext("ImageViewer.Trigger")
  const state = React.useMemo<TriggerState>(
    () => ({ open, index }),
    [open, index]
  )
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "button",
        accessibilityState: { expanded: open },
        onPress: (event: GestureResponderEvent) => {
          setIndex(index, REASONS.triggerPress, event)
          setOpen(true, REASONS.triggerPress, event)
        },
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "ImageViewerTrigger"

function Portal({ children, hostName }: PortalProps) {
  const context = useRootContext("ImageViewer.Portal")
  const name = React.useId()
  if (!context.open) return null
  return (
    <PortalPrimitive hostName={hostName} name={`${name}-image-viewer`}>
      <RootContext.Provider value={context}>{children}</RootContext.Provider>
    </PortalPrimitive>
  )
}

Portal.displayName = "ImageViewerPortal"

function Popup({ render, className, style, ref, ...elementProps }: PopupProps) {
  const { open, index, count, setOpen } = useRootContext("ImageViewer.Popup")
  const { height } = useWindowDimensions()
  const current = useSharedValue(index)
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const dismissX = useSharedValue(0)
  const dismissY = useSharedValue(0)
  const controls = useSharedValue(1)
  const progress = useDerivedValue(() =>
    Math.min(Math.abs(dismissY.value) / Math.max(height * 0.4, 1), 1)
  )

  useBackHandler(open, () => setOpen(false, REASONS.backPress))

  const viewer = React.useMemo<ViewerContextValue>(
    () => ({
      current,
      scale,
      translateX,
      translateY,
      dismissX,
      dismissY,
      progress,
      controls,
    }),
    [
      current,
      scale,
      translateX,
      translateY,
      dismissX,
      dismissY,
      progress,
      controls,
    ]
  )

  const state = React.useMemo<PopupState>(
    () => ({ index, count }),
    [index, count]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        style: StyleSheet.absoluteFill,
        accessibilityViewIsModal: true,
        onAccessibilityEscape: () =>
          setOpen(false, REASONS.accessibilityEscape),
      },
      elementProps,
    ],
  })

  return (
    <ViewerContext.Provider value={viewer}>{element}</ViewerContext.Provider>
  )
}

Popup.displayName = "ImageViewerPopup"

function Backdrop({
  render,
  className,
  style,
  ref,
  ...elementProps
}: BackdropProps) {
  const { index, count } = useRootContext("ImageViewer.Backdrop")
  const { progress } = useViewerContext("ImageViewer.Backdrop")
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }))
  const state = React.useMemo<PopupState>(
    () => ({ index, count }),
    [index, count]
  )
  return useRender({
    defaultComponent: Animated.View,
    render,
    className,
    style,
    state,
    ref: ref as React.Ref<unknown>,
    props: [
      {
        style: [StyleSheet.absoluteFill, animatedStyle],
        pointerEvents: "none",
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Backdrop.displayName = "ImageViewerBackdrop"

function Controls({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ControlsProps) {
  const { index, count } = useRootContext("ImageViewer.Controls")
  const { progress, controls } = useViewerContext("ImageViewer.Controls")
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: controls.value * (1 - progress.value),
  }))
  const state = React.useMemo<PopupState>(
    () => ({ index, count }),
    [index, count]
  )
  return useRender({
    defaultComponent: Animated.View,
    render,
    className,
    style,
    state,
    ref: ref as React.Ref<unknown>,
    props: [{ style: animatedStyle, pointerEvents: "box-none" }, elementProps],
  })
}

Controls.displayName = "ImageViewerControls"

function Page({
  image,
  pageIndex,
  visible,
  width,
  height,
  sizes,
}: {
  image: ImageViewerImage
  pageIndex: number
  visible: boolean
  width: number
  height: number
  sizes: SharedValue<Record<number, ImageSize>>
}) {
  const { current, scale, translateX, translateY, dismissX, dismissY } =
    useViewerContext("ImageViewer.Pages")

  const animatedStyle = useAnimatedStyle(() => {
    if (current.value !== pageIndex) {
      return {
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
      }
    }
    const shrink = 1 - Math.min(Math.abs(dismissY.value) / height, 1) * 0.3
    return {
      transform: [
        { translateX: translateX.value + dismissX.value },
        { translateY: translateY.value + dismissY.value },
        { scale: scale.value * shrink },
      ],
    }
  })

  const onLoad = React.useCallback(
    (event: ImageLoadEvent) => {
      const { width: imageWidth, height: imageHeight } =
        event.nativeEvent.source
      if (imageWidth <= 0 || imageHeight <= 0) return
      sizes.modify((value) => {
        "worklet"
        value[pageIndex] = { width: imageWidth, height: imageHeight }
        return value
      })
    },
    [sizes, pageIndex]
  )

  return (
    <View style={{ width, height }}>
      {visible ? (
        <Animated.View style={[{ width, height }, animatedStyle]}>
          <Image
            source={image.source}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            style={{ width, height }}
            onLoad={onLoad}
          />
        </Animated.View>
      ) : null}
    </View>
  )
}

const PAGE_ACTIONS = [{ name: "increment" }, { name: "decrement" }]

function Pages({ render, className, style, ref, ...elementProps }: PagesProps) {
  const { images, count, index, setIndex, setOpen } =
    useRootContext("ImageViewer.Pages")
  const viewer = useViewerContext("ImageViewer.Pages")
  const {
    current,
    scale,
    translateX,
    translateY,
    dismissX,
    dismissY,
    controls,
  } = viewer
  const { width, height } = useWindowDimensions()
  const sizes = useSharedValue<Record<number, ImageSize>>({})
  const stripX = useSharedValue(-index * width)
  const mode = useSharedValue(0)
  const startScale = useSharedValue(1)
  const startX = useSharedValue(0)
  const startY = useSharedValue(0)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)

  React.useEffect(() => {
    current.value = index
    scale.value = withTiming(1, TIMING)
    translateX.value = withTiming(0, TIMING)
    translateY.value = withTiming(0, TIMING)
    stripX.value = withTiming(-index * width, {
      duration: PAGE_DURATION,
      reduceMotion: ReduceMotion.System,
    })
  }, [index, width, current, scale, translateX, translateY, stripX])

  const commitIndex = React.useCallback(
    (next: number) => {
      const applied = setIndex(next, REASONS.swipe)
      if (!applied) {
        current.value = index
        stripX.value = withTiming(-index * width, {
          duration: PAGE_DURATION,
          reduceMotion: ReduceMotion.System,
        })
      }
    },
    [setIndex, current, index, stripX, width]
  )

  const dismiss = React.useCallback(() => {
    const applied = setOpen(false, REASONS.swipe)
    if (!applied) {
      dismissX.value = withTiming(0, TIMING)
      dismissY.value = withTiming(0, TIMING)
    }
  }, [setOpen, dismissX, dismissY])

  const gesture = React.useMemo(() => {
    const bounds = (nextScale: number, x: number, y: number) => {
      "worklet"
      const size = sizes.value[current.value]
      const ratio = size ? size.width / size.height : width / height
      let fittedWidth = width
      let fittedHeight = width / ratio
      if (fittedHeight > height) {
        fittedHeight = height
        fittedWidth = height * ratio
      }
      const maxX = Math.max(0, (fittedWidth * nextScale - width) / 2)
      const maxY = Math.max(0, (fittedHeight * nextScale - height) / 2)
      return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) }
    }

    const settle = () => {
      "worklet"
      const nextScale = clamp(scale.value, MIN_SCALE, MAX_SCALE)
      const next = bounds(nextScale, translateX.value, translateY.value)
      scale.value = withTiming(nextScale, TIMING)
      translateX.value = withTiming(next.x, TIMING)
      translateY.value = withTiming(next.y, TIMING)
    }

    const pinch = Gesture.Pinch()
      .onStart((event) => {
        startScale.value = scale.value
        startX.value = translateX.value
        startY.value = translateY.value
        focalX.value = event.focalX - width / 2
        focalY.value = event.focalY - height / 2
        mode.value = 3
      })
      .onUpdate((event) => {
        const nextScale = clamp(startScale.value * event.scale, 0.8, 5)
        const ratio = nextScale / startScale.value
        const fx = event.focalX - width / 2
        const fy = event.focalY - height / 2
        scale.value = nextScale
        translateX.value = fx - (focalX.value - startX.value) * ratio
        translateY.value = fy - (focalY.value - startY.value) * ratio
      })
      .onEnd(() => {
        settle()
        mode.value = 0
      })

    const pan = Gesture.Pan()
      .onStart(() => {
        startX.value = translateX.value
        startY.value = translateY.value
        mode.value = scale.value > 1.01 ? 3 : 0
      })
      .onUpdate((event) => {
        if (event.numberOfPointers > 1) return
        if (mode.value === 3) {
          if (scale.value <= 1.01) return
          const limit = bounds(
            scale.value,
            startX.value + event.translationX,
            startY.value + event.translationY
          )
          const rawX = startX.value + event.translationX
          const rawY = startY.value + event.translationY
          translateX.value = limit.x + (rawX - limit.x) / 3
          translateY.value = limit.y + (rawY - limit.y) / 3
          return
        }
        if (mode.value === 0) {
          mode.value =
            Math.abs(event.translationX) > Math.abs(event.translationY) ? 1 : 2
        }
        if (mode.value === 1) {
          const atStart = current.value === 0 && event.translationX > 0
          const atEnd = current.value === count - 1 && event.translationX < 0
          const offset =
            atStart || atEnd ? event.translationX / 3 : event.translationX
          stripX.value = -current.value * width + offset
        } else {
          dismissX.value = event.translationX
          dismissY.value = event.translationY
        }
      })
      .onEnd((event) => {
        if (mode.value === 3) {
          settle()
        } else if (mode.value === 1) {
          let target = current.value
          if (event.translationX < -width / 4 || event.velocityX < -500) {
            target = Math.min(count - 1, target + 1)
          } else if (event.translationX > width / 4 || event.velocityX > 500) {
            target = Math.max(0, target - 1)
          }
          stripX.value = withTiming(-target * width, {
            duration: PAGE_DURATION,
            reduceMotion: ReduceMotion.System,
          })
          if (target !== current.value) {
            current.value = target
            scheduleOnRN(commitIndex, target)
          }
        } else if (mode.value === 2) {
          if (
            Math.abs(event.translationY) > height * 0.15 ||
            Math.abs(event.velocityY) > 800
          ) {
            const direction = event.translationY < 0 ? -1 : 1
            dismissY.value = withTiming(direction * height, {
              duration: 200,
              reduceMotion: ReduceMotion.System,
            })
            scheduleOnRN(dismiss)
          } else {
            dismissX.value = withTiming(0, TIMING)
            dismissY.value = withTiming(0, TIMING)
          }
        }
        mode.value = 0
      })

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd((event, success) => {
        if (!success) return
        if (scale.value > 1.01) {
          scale.value = withTiming(1, TIMING)
          translateX.value = withTiming(0, TIMING)
          translateY.value = withTiming(0, TIMING)
          return
        }
        const fx = event.x - width / 2
        const fy = event.y - height / 2
        const next = bounds(
          DOUBLE_TAP_SCALE,
          fx * (1 - DOUBLE_TAP_SCALE),
          fy * (1 - DOUBLE_TAP_SCALE)
        )
        scale.value = withTiming(DOUBLE_TAP_SCALE, TIMING)
        translateX.value = withTiming(next.x, TIMING)
        translateY.value = withTiming(next.y, TIMING)
      })

    const singleTap = Gesture.Tap().onEnd((_event, success) => {
      if (!success) return
      controls.value = withTiming(controls.value > 0.5 ? 0 : 1, TIMING)
    })

    return Gesture.Simultaneous(
      pinch,
      pan,
      Gesture.Exclusive(doubleTap, singleTap)
    )
  }, [
    width,
    height,
    count,
    sizes,
    current,
    scale,
    translateX,
    translateY,
    dismissX,
    dismissY,
    controls,
    stripX,
    mode,
    startScale,
    startX,
    startY,
    focalX,
    focalY,
    commitIndex,
    dismiss,
  ])

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: stripX.value }],
  }))

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const step = accessibilityStep(event)
    if (step === 0) return
    setIndex(index + step, IMAGE_VIEWER_REASONS.accessibilityAction, event)
  }

  const state = React.useMemo<PopupState>(
    () => ({ index, count }),
    [index, count]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        style: StyleSheet.absoluteFill,
        accessible: true,
        accessibilityRole: "adjustable",
        accessibilityLabel:
          images[index]?.accessibilityLabel ?? `Image ${index + 1}`,
        accessibilityValue: { text: `${index + 1} of ${count}` },
        accessibilityActions: PAGE_ACTIONS,
        onAccessibilityAction,
        children: (
          <Animated.View
            style={[
              { flexDirection: "row", width: width * count, height },
              stripStyle,
            ]}
          >
            {images
              .map((image, pageIndex) => ({ image, pageIndex }))
              .map(({ image, pageIndex }) => (
                <Page
                  key={pageIndex}
                  image={image}
                  pageIndex={pageIndex}
                  visible={Math.abs(pageIndex - index) <= 1}
                  width={width}
                  height={height}
                  sizes={sizes}
                />
              ))}
          </Animated.View>
        ),
      },
      elementProps,
    ],
  })

  return <GestureDetector gesture={gesture}>{element}</GestureDetector>
}

Pages.displayName = "ImageViewerPages"

function Close({ render, className, style, ref, ...elementProps }: CloseProps) {
  const { index, count, setOpen } = useRootContext("ImageViewer.Close")
  const state = React.useMemo<PopupState>(
    () => ({ index, count }),
    [index, count]
  )
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "button",
        accessibilityLabel: "Close",
        onPress: (event: GestureResponderEvent) =>
          setOpen(false, REASONS.closePress, event),
      },
      elementProps,
    ],
  })
}

Close.displayName = "ImageViewerClose"

export type {
  BackdropProps,
  CloseProps,
  ControlsProps,
  ImageViewerImage,
  IndexChangeEventDetails,
  IndexChangeReason,
  OpenChangeEventDetails,
  OpenChangeReason,
  PagesProps,
  PopupProps,
  PopupState,
  PortalProps,
  RootContextValue,
  RootProps,
  TriggerProps,
  TriggerState,
}
export {
  Backdrop,
  Close,
  Controls,
  IMAGE_VIEWER_REASONS,
  Pages,
  Popup,
  Portal,
  Root,
  Trigger,
  useRootContext,
}
