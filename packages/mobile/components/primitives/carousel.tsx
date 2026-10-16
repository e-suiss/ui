import * as React from "react"
import {
  AccessibilityInfo,
  AppState,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native"
import { useEffectEvent } from "./hooks"
import type { BaseUIComponentProps, Orientation } from "./types"
import { useRender } from "./use-render"

type CarouselEvent = "select" | "reInit"

type CarouselListener = (api: CarouselApi) => void

interface CarouselOptions {
  loop?: boolean | undefined
  align?: "start" | "center" | undefined
  dragFree?: boolean | undefined
}

interface CarouselApi {
  scrollTo: (index: number, jump?: boolean) => void
  scrollPrev: (jump?: boolean) => void
  scrollNext: (jump?: boolean) => void
  canScrollPrev: () => boolean
  canScrollNext: () => boolean
  selectedScrollSnap: () => number
  scrollSnapList: () => number[]
  on: (event: CarouselEvent, listener: CarouselListener) => CarouselApi
  off: (event: CarouselEvent, listener: CarouselListener) => CarouselApi
}

interface CarouselAutoplay {
  enabled: boolean
  delay: number
  playing: boolean
  running: boolean
  setPlaying: (playing: boolean) => void
}

interface ItemLayout {
  start: number
  size: number
}

interface RootContextValue {
  api: CarouselApi
  orientation: Orientation
  options: CarouselOptions
  viewportSize: number
  snaps: number[]
  selectedIndex: number
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollTo: (index: number, jump?: boolean) => void
  scrollPrev: (jump?: boolean) => void
  scrollNext: (jump?: boolean) => void
  autoplay: CarouselAutoplay
  scrollRef: React.RefObject<React.ComponentRef<typeof ScrollView> | null>
  setViewportSize: (size: number) => void
  setContentSize: (size: number) => void
  setItemLayout: (index: number, layout: ItemLayout | null) => void
  onOffset: (offset: number) => void
  setDragging: (dragging: boolean) => void
}

interface RootState {
  orientation: Orientation
  selectedIndex: number
  playing: boolean
}

interface ItemState {
  index: number
}

interface ControlState {
  disabled: boolean
}

interface DotState {
  active: boolean
  index: number
}

interface PlayButtonState {
  playing: boolean
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  orientation?: Orientation | undefined
  opts?: CarouselOptions | undefined
  setApi?: ((api: CarouselApi) => void) | undefined
  autoplay?: boolean | number | undefined
}

type ViewportProps = BaseUIComponentProps<typeof View, RootState>

type ContentProps = Omit<
  React.ComponentProps<typeof ScrollView>,
  "horizontal" | "className"
> & {
  className?: string | undefined
}

type ItemProps = BaseUIComponentProps<typeof View, ItemState> & {
  basis?: number | undefined
}

type ControlProps = BaseUIComponentProps<typeof Pressable, ControlState>

type DotProps = BaseUIComponentProps<typeof Pressable, DotState> & {
  index: number
}

type PlayButtonProps = BaseUIComponentProps<typeof Pressable, PlayButtonState>

const DEFAULT_DELAY = 5000

const PROGRAMMATIC_TIMEOUT = 700

const RootContext = React.createContext<RootContextValue | null>(null)

const ItemIndexContext = React.createContext(0)

function useRootContext(componentName = "Carousel part") {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Carousel.Root`)
  }
  return context
}

function computeSnaps(
  layouts: ReadonlyMap<number, ItemLayout>,
  viewportSize: number,
  contentSize: number,
  align: "start" | "center"
) {
  if (viewportSize <= 0 || layouts.size === 0) return []
  const ordered = [...layouts.entries()].sort(([a], [b]) => a - b)
  const end = Math.max(
    contentSize,
    ...ordered.map(([, layout]) => layout.start + layout.size)
  )
  const max = Math.max(0, end - viewportSize)
  const snaps: number[] = []
  for (const [, layout] of ordered) {
    const raw =
      align === "center"
        ? layout.start + layout.size / 2 - viewportSize / 2
        : layout.start
    const offset = Math.min(Math.max(raw, 0), max)
    const previous = snaps.at(-1)
    if (previous === undefined || Math.abs(offset - previous) > 1) {
      snaps.push(offset)
    }
  }
  return snaps
}

function nearestSnap(snaps: number[], offset: number) {
  let nearest = 0
  let distance = Number.POSITIVE_INFINITY
  snaps.forEach((snap, index) => {
    const current = Math.abs(snap - offset)
    if (current < distance) {
      distance = current
      nearest = index
    }
  })
  return nearest
}

function Root({
  orientation = "horizontal",
  opts,
  setApi,
  autoplay = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const scrollRef = React.useRef<React.ComponentRef<typeof ScrollView>>(null)
  const [viewportSize, setViewportSizeState] = React.useState(0)
  const [contentSize, setContentSizeState] = React.useState(0)
  const [layouts, setLayouts] = React.useState<ReadonlyMap<number, ItemLayout>>(
    () => new Map()
  )
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(Boolean(autoplay))
  const [dragging, setDragging] = React.useState(false)
  const [active, setActive] = React.useState(
    AppState.currentState !== "background"
  )
  const pendingRef = React.useRef<number | null>(null)
  const pendingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const listenersRef = React.useRef(
    new Map<CarouselEvent, Set<CarouselListener>>()
  )
  const loop = Boolean(opts?.loop)
  const align = opts?.align ?? "start"
  const delay = typeof autoplay === "number" ? autoplay : DEFAULT_DELAY
  const enabled = Boolean(autoplay)
  const running = enabled && playing && !dragging && active

  const snaps = React.useMemo(
    () => computeSnaps(layouts, viewportSize, contentSize, align),
    [layouts, viewportSize, contentSize, align]
  )
  const lastIndex = Math.max(0, snaps.length - 1)
  const index = Math.min(selectedIndex, lastIndex)
  const canScrollPrev = loop ? snaps.length > 1 : index > 0
  const canScrollNext = loop ? snaps.length > 1 : index < lastIndex
  const scrollable = snaps.length > 1

  const stateRef = React.useRef({ snaps, index, canScrollPrev, canScrollNext })
  stateRef.current = { snaps, index, canScrollPrev, canScrollNext }

  const scrollTo = React.useCallback(
    (target: number, jump = false) => {
      const current = stateRef.current
      if (current.snaps.length === 0) return
      const next = Math.min(Math.max(target, 0), current.snaps.length - 1)
      const offset = current.snaps[next]
      if (offset === undefined) return
      pendingRef.current = next
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current)
      pendingTimerRef.current = setTimeout(() => {
        pendingRef.current = null
      }, PROGRAMMATIC_TIMEOUT)
      scrollRef.current?.scrollTo(
        orientation === "horizontal"
          ? { x: offset, y: 0, animated: !jump }
          : { x: 0, y: offset, animated: !jump }
      )
      setSelectedIndex(next)
    },
    [orientation]
  )

  const scrollPrev = React.useCallback(
    (jump = false) => {
      const current = stateRef.current
      if (current.index > 0) scrollTo(current.index - 1, jump)
      else if (loop) scrollTo(current.snaps.length - 1, jump)
    },
    [loop, scrollTo]
  )

  const scrollNext = React.useCallback(
    (jump = false) => {
      const current = stateRef.current
      if (current.index < current.snaps.length - 1) {
        scrollTo(current.index + 1, jump)
      } else if (loop) scrollTo(0, jump)
    },
    [loop, scrollTo]
  )

  const api = React.useMemo<CarouselApi>(() => {
    const value: CarouselApi = {
      scrollTo,
      scrollPrev,
      scrollNext,
      canScrollPrev: () => stateRef.current.canScrollPrev,
      canScrollNext: () => stateRef.current.canScrollNext,
      selectedScrollSnap: () => stateRef.current.index,
      scrollSnapList: () => stateRef.current.snaps.slice(),
      on: (event, listener) => {
        const listeners = listenersRef.current
        const set = listeners.get(event) ?? new Set()
        set.add(listener)
        listeners.set(event, set)
        return value
      },
      off: (event, listener) => {
        listenersRef.current.get(event)?.delete(listener)
        return value
      },
    }
    return value
  }, [scrollTo, scrollPrev, scrollNext])

  const emit = useEffectEvent((event: CarouselEvent) => {
    for (const listener of listenersRef.current.get(event) ?? []) {
      listener(api)
    }
  })

  React.useEffect(() => {
    setApi?.(api)
  }, [api, setApi])

  const emittedRef = React.useRef<{ index: number; snaps: number[] | null }>({
    index: -1,
    snaps: null,
  })

  React.useEffect(() => {
    const emitted = emittedRef.current
    if (emitted.snaps !== snaps) {
      emitted.snaps = snaps
      emit("reInit")
    }
    if (emitted.index !== index) {
      emitted.index = index
      emit("select")
    }
  })

  React.useEffect(
    () => () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current)
    },
    []
  )

  React.useEffect(() => {
    if (!enabled) return
    let mounted = true
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (mounted && reduced) setPlaying(false)
    })
    const subscription = AppState.addEventListener("change", (state) => {
      setActive(state === "active")
    })
    return () => {
      mounted = false
      subscription.remove()
    }
  }, [enabled])

  const remainingRef = React.useRef({ index: 0, time: delay })

  React.useEffect(() => {
    if (!running || !scrollable) return
    const current = index
    if (remainingRef.current.index !== current) {
      remainingRef.current = { index: current, time: delay }
    }
    const start = Date.now()
    const timer = setTimeout(() => {
      if (stateRef.current.index !== current) return
      remainingRef.current = { index: -1, time: delay }
      if (stateRef.current.canScrollNext) scrollNext()
      else scrollTo(0)
    }, remainingRef.current.time)
    return () => {
      clearTimeout(timer)
      if (remainingRef.current.index === current) {
        remainingRef.current.time = Math.max(
          0,
          remainingRef.current.time - (Date.now() - start)
        )
      }
    }
  }, [running, scrollable, index, delay, scrollNext, scrollTo])

  const setViewportSize = React.useCallback((size: number) => {
    setViewportSizeState((current) => (current === size ? current : size))
  }, [])

  const setContentSize = React.useCallback((size: number) => {
    setContentSizeState((current) => (current === size ? current : size))
  }, [])

  const setItemLayout = React.useCallback(
    (itemIndex: number, layout: ItemLayout | null) => {
      setLayouts((current) => {
        const previous = current.get(itemIndex)
        if (layout === null) {
          if (!previous) return current
          const next = new Map(current)
          next.delete(itemIndex)
          return next
        }
        if (
          previous &&
          previous.start === layout.start &&
          previous.size === layout.size
        ) {
          return current
        }
        const next = new Map(current)
        next.set(itemIndex, layout)
        return next
      })
    },
    []
  )

  const onOffset = React.useCallback((offset: number) => {
    const current = stateRef.current
    if (current.snaps.length === 0) return
    const nearest = nearestSnap(current.snaps, offset)
    const pending = pendingRef.current
    if (pending !== null) {
      if (nearest !== pending) return
      pendingRef.current = null
    }
    setSelectedIndex(nearest)
  }, [])

  const setDraggingState = React.useCallback((next: boolean) => {
    if (next) pendingRef.current = null
    setDragging(next)
  }, [])

  const autoplayValue = React.useMemo<CarouselAutoplay>(
    () => ({ enabled, delay, playing, running, setPlaying }),
    [enabled, delay, playing, running]
  )

  const options = React.useMemo<CarouselOptions>(
    () => ({ loop, align, dragFree: Boolean(opts?.dragFree) }),
    [loop, align, opts?.dragFree]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({
      api,
      orientation,
      options,
      viewportSize,
      snaps,
      selectedIndex: index,
      canScrollPrev,
      canScrollNext,
      scrollTo,
      scrollPrev,
      scrollNext,
      autoplay: autoplayValue,
      scrollRef,
      setViewportSize,
      setContentSize,
      setItemLayout,
      onOffset,
      setDragging: setDraggingState,
    }),
    [
      api,
      orientation,
      options,
      viewportSize,
      snaps,
      index,
      canScrollPrev,
      canScrollNext,
      scrollTo,
      scrollPrev,
      scrollNext,
      autoplayValue,
      setViewportSize,
      setContentSize,
      setItemLayout,
      onOffset,
      setDraggingState,
    ]
  )

  const state = React.useMemo<RootState>(
    () => ({ orientation, selectedIndex: index, playing: running }),
    [orientation, index, running]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: elementProps,
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "CarouselRoot"

const VIEWPORT_STYLE = { overflow: "hidden" } as const

function Viewport({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ViewportProps) {
  const { orientation, selectedIndex, autoplay } =
    useRootContext("Carousel.Viewport")
  const state = React.useMemo<RootState>(
    () => ({ orientation, selectedIndex, playing: autoplay.running }),
    [orientation, selectedIndex, autoplay.running]
  )
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ style: VIEWPORT_STYLE }, elementProps],
  })
}

Viewport.displayName = "CarouselViewport"

const MOMENTUM_GRACE = 100

function Content({
  children,
  onLayout,
  onContentSizeChange,
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  ...props
}: ContentProps) {
  const {
    orientation,
    options,
    snaps,
    scrollRef,
    setViewportSize,
    setContentSize,
    onOffset,
    setDragging,
  } = useRootContext("Carousel.Content")
  const horizontal = orientation === "horizontal"
  const releaseRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelRelease = React.useCallback(() => {
    if (releaseRef.current) clearTimeout(releaseRef.current)
    releaseRef.current = null
  }, [])

  React.useEffect(() => cancelRelease, [cancelRelease])

  const readOffset = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    horizontal
      ? event.nativeEvent.contentOffset.x
      : event.nativeEvent.contentOffset.y

  const items = React.Children.toArray(children).map((child, index) => (
    <ItemIndexContext.Provider
      key={
        React.isValidElement(child) && child.key !== null ? child.key : index
      }
      value={index}
    >
      {child}
    </ItemIndexContext.Provider>
  ))

  return (
    <ScrollView
      ref={scrollRef}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      snapToOffsets={options.dragFree ? undefined : snaps}
      decelerationRate={options.dragFree ? "normal" : "fast"}
      disableIntervalMomentum={!options.dragFree}
      scrollEventThrottle={16}
      onLayout={(event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout
        setViewportSize(horizontal ? width : height)
        onLayout?.(event)
      }}
      onContentSizeChange={(width, height) => {
        setContentSize(horizontal ? width : height)
        onContentSizeChange?.(width, height)
      }}
      onScroll={(event) => {
        onOffset(readOffset(event))
        onScroll?.(event)
      }}
      onScrollBeginDrag={(event) => {
        cancelRelease()
        setDragging(true)
        onScrollBeginDrag?.(event)
      }}
      onScrollEndDrag={(event) => {
        onOffset(readOffset(event))
        cancelRelease()
        releaseRef.current = setTimeout(() => {
          releaseRef.current = null
          setDragging(false)
        }, MOMENTUM_GRACE)
        onScrollEndDrag?.(event)
      }}
      onMomentumScrollBegin={(event) => {
        cancelRelease()
        onMomentumScrollBegin?.(event)
      }}
      onMomentumScrollEnd={(event) => {
        cancelRelease()
        setDragging(false)
        onOffset(readOffset(event))
        onMomentumScrollEnd?.(event)
      }}
      {...props}
    >
      {items}
    </ScrollView>
  )
}

Content.displayName = "CarouselContent"

function Item({
  basis = 1,
  render,
  className,
  style,
  ref,
  onLayout,
  ...elementProps
}: ItemProps) {
  const index = React.useContext(ItemIndexContext)
  const { orientation, viewportSize, setItemLayout } =
    useRootContext("Carousel.Item")
  const horizontal = orientation === "horizontal"
  const size = viewportSize * basis

  React.useEffect(
    () => () => setItemLayout(index, null),
    [index, setItemLayout]
  )

  const state = React.useMemo<ItemState>(() => ({ index }), [index])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        style: horizontal ? { width: size } : { height: size },
        onLayout: (event: LayoutChangeEvent) => {
          const layout = event.nativeEvent.layout
          setItemLayout(index, {
            start: horizontal ? layout.x : layout.y,
            size: horizontal ? layout.width : layout.height,
          })
          onLayout?.(event)
        },
      },
      elementProps,
    ],
  })
}

Item.displayName = "CarouselItem"

function Previous({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ControlProps) {
  const { canScrollPrev, scrollPrev } = useRootContext("Carousel.Previous")
  const disabled = !canScrollPrev
  const state = React.useMemo<ControlState>(() => ({ disabled }), [disabled])
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
        accessibilityLabel: "Previous slide",
        accessibilityState: { disabled },
        disabled,
        onPress: () => scrollPrev(),
      },
      elementProps,
    ],
  })
}

Previous.displayName = "CarouselPrevious"

function Next({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ControlProps) {
  const { canScrollNext, scrollNext } = useRootContext("Carousel.Next")
  const disabled = !canScrollNext
  const state = React.useMemo<ControlState>(() => ({ disabled }), [disabled])
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
        accessibilityLabel: "Next slide",
        accessibilityState: { disabled },
        disabled,
        onPress: () => scrollNext(),
      },
      elementProps,
    ],
  })
}

Next.displayName = "CarouselNext"

function Dot({
  index,
  render,
  className,
  style,
  ref,
  ...elementProps
}: DotProps) {
  const { selectedIndex, scrollTo } = useRootContext("Carousel.Dot")
  const active = index === selectedIndex
  const state = React.useMemo<DotState>(
    () => ({ active, index }),
    [active, index]
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
        accessibilityLabel: `Go to slide ${index + 1}`,
        accessibilityState: { selected: active },
        onPress: () => scrollTo(index),
      },
      elementProps,
    ],
  })
}

Dot.displayName = "CarouselDot"

function PlayButton({
  render,
  className,
  style,
  ref,
  ...elementProps
}: PlayButtonProps) {
  const { autoplay } = useRootContext("Carousel.PlayButton")
  const { playing, setPlaying } = autoplay
  const state = React.useMemo<PlayButtonState>(() => ({ playing }), [playing])
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
        accessibilityLabel: playing ? "Pause slideshow" : "Play slideshow",
        onPress: () => setPlaying(!playing),
      },
      elementProps,
    ],
    enabled: autoplay.enabled,
  })
}

PlayButton.displayName = "CarouselPlayButton"

export type {
  CarouselApi,
  CarouselAutoplay,
  CarouselEvent,
  CarouselListener,
  CarouselOptions,
  ContentProps,
  ControlProps,
  ControlState,
  DotProps,
  DotState,
  ItemProps,
  ItemState,
  PlayButtonProps,
  PlayButtonState,
  RootContextValue,
  RootProps,
  RootState,
  ViewportProps,
}
export {
  Content,
  Dot,
  Item,
  Next,
  PlayButton,
  Previous,
  Root,
  useRootContext,
  Viewport,
}
