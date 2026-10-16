import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type HostInstance,
  Pressable,
  useWindowDimensions,
} from "react-native"
import Animated, {
  Easing,
  type EntryAnimationsValues,
  type EntryExitAnimationFunction,
  type ExitAnimationsValues,
  ReduceMotion,
  withTiming,
} from "react-native-reanimated"
import { REASONS } from "./event-details"
import { useHaptics } from "./haptics"
import { useComposedRefs } from "./hooks"
import {
  Portal as MenuPortal,
  Positioner as MenuPositioner,
  type PositionerProps as MenuPositionerProps,
  MenuRootImpl,
  type RootProps as MenuRootProps,
  type PortalProps,
  useMenuRootContext,
} from "./menu"
import type { AnchorRect, BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

const EDGE = 16

const GAP = 12

const MENU_SPACE = 260

const MENU_MIN_HEIGHT = 88

const MENU_SCALE = 0.4

const MAX_WIDTH = 360

const ENTER_DURATION = 400

const EXIT_DURATION = 300

const HANDOFF_DELAY = 240

interface PreviewMenuInsets {
  top: number
  bottom: number
}

interface PreviewMenuFrame {
  top: number
  left: number
  width: number
  height: number
  source: AnchorRect
}

interface RootContextValue {
  open: boolean
  lifted: boolean
  ready: boolean
  frame: PreviewMenuFrame | null
  insets: PreviewMenuInsets
  lift: (source: AnchorRect) => PreviewMenuFrame
  setLifted: (lifted: boolean) => void
  setMenuHeight: (height: number) => void
  contentRef: React.RefObject<React.ReactNode>
  triggerNodeRef: React.RefObject<HostInstance | null>
}

interface TriggerState {
  open: boolean
  lifted: boolean
  disabled: boolean
}

interface PreviewState {
  open: boolean
}

type RootProps = MenuRootProps & {
  aspectRatio?: number | undefined
  insets?: PreviewMenuInsets | undefined
}

type TriggerProps = BaseUIComponentProps<typeof Pressable, TriggerState>

type PreviewProps = BaseUIComponentProps<typeof Animated.View, PreviewState>

type PositionerProps = Omit<MenuPositionerProps, "anchor" | "side" | "align">

type PreviewLayer = "source" | "preview"

const NO_INSETS: PreviewMenuInsets = { top: 0, bottom: 0 }

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext(componentName = "PreviewMenu part") {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside PreviewMenu.Root`)
  }
  return context
}

function measureFrame(
  source: AnchorRect,
  window: { width: number; height: number },
  insets: PreviewMenuInsets,
  aspectRatio: number | undefined,
  menuHeight: number | null
): PreviewMenuFrame {
  const ratio = aspectRatio
    ? 1 / aspectRatio
    : source.height / Math.max(source.width, 1)
  const topLimit = insets.top + EDGE
  const bottomLimit = window.height - insets.bottom - EDGE
  const available = bottomLimit - topLimit
  const fit = (reserve: number) => {
    let width = Math.min(window.width - EDGE * 2, MAX_WIDTH)
    let height = width * ratio
    const maxHeight = available - reserve
    if (height > maxHeight) {
      height = Math.max(maxHeight, Math.min(source.height, available))
      width = height / Math.max(ratio, 0.01)
    }
    return { width, height }
  }
  const base = fit(MENU_SPACE)
  const menuMax = Math.max(available - base.height - GAP, MENU_MIN_HEIGHT)
  const menu = Math.min(menuHeight ?? MENU_SPACE - GAP, menuMax)
  const { width, height } = fit(menu + GAP)
  const left = (window.width - width) / 2
  const top = topLimit + Math.max(0, (available - height - GAP - menu) / 2)
  return { top, left, width, height, source }
}

function timing(entering: boolean) {
  "worklet"
  return {
    duration: entering ? ENTER_DURATION : EXIT_DURATION,
    easing: Easing.bezier(0.32, 0.72, 0, 1),
    reduceMotion: ReduceMotion.System,
  }
}

function liftAnimation(frame: PreviewMenuFrame, entering: boolean) {
  const { source } = frame
  const dx = source.pageX + source.width / 2 - (frame.left + frame.width / 2)
  const dy = source.pageY + source.height / 2 - (frame.top + frame.height / 2)
  const sx = source.width / Math.max(frame.width, 1)
  const sy = source.height / Math.max(frame.height, 1)
  const hidden = { translateX: dx, translateY: dy, scaleX: sx, scaleY: sy }
  const shown = { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 }
  const animation: EntryExitAnimationFunction = () => {
    "worklet"
    const config = timing(entering)
    const from = entering ? hidden : shown
    const to = entering ? shown : hidden
    return {
      initialValues: {
        transform: [
          { translateX: from.translateX },
          { translateY: from.translateY },
          { scaleX: from.scaleX },
          { scaleY: from.scaleY },
        ],
      },
      animations: {
        transform: [
          { translateX: withTiming(to.translateX, config) },
          { translateY: withTiming(to.translateY, config) },
          { scaleX: withTiming(to.scaleX, config) },
          { scaleY: withTiming(to.scaleY, config) },
        ],
      },
    }
  }
  return animation
}

function layerAnimation(
  frame: PreviewMenuFrame,
  layer: PreviewLayer,
  entering: boolean
) {
  const { source } = frame
  const sx = source.width / Math.max(frame.width, 1)
  const sy = source.height / Math.max(frame.height, 1)
  const cover = Math.max(1 / Math.max(sx, 0.01), 1 / Math.max(sy, 0.01))
  const start = Math.max(sx, sy)
  const atSource =
    layer === "source"
      ? {
          opacity: 1,
          scaleX: 1 / Math.max(sx, 0.01),
          scaleY: 1 / Math.max(sy, 0.01),
        }
      : {
          opacity: 0,
          scaleX: start / Math.max(sx, 0.01),
          scaleY: start / Math.max(sy, 0.01),
        }
  const atFrame =
    layer === "source"
      ? { opacity: 0, scaleX: cover, scaleY: cover }
      : { opacity: 1, scaleX: 1, scaleY: 1 }
  const animation: EntryExitAnimationFunction = () => {
    "worklet"
    const config = timing(entering)
    const from = entering ? atSource : atFrame
    const to = entering ? atFrame : atSource
    return {
      initialValues: {
        opacity: from.opacity,
        transform: [{ scaleX: from.scaleX }, { scaleY: from.scaleY }],
      },
      animations: {
        opacity: withTiming(to.opacity, config),
        transform: [
          { scaleX: withTiming(to.scaleX, config) },
          { scaleY: withTiming(to.scaleY, config) },
        ],
      },
    }
  }
  return animation
}

function menuAnimation(
  frame: PreviewMenuFrame,
  gap: number,
  entering: boolean
) {
  const { source } = frame
  const anchorX = frame.left + frame.width / 2
  const anchorY = frame.top + frame.height + gap
  const dx = source.pageX + source.width / 2 - anchorX
  const dy = source.pageY + source.height - anchorY
  const animation = (values: EntryAnimationsValues | ExitAnimationsValues) => {
    "worklet"
    const config = timing(entering)
    const layout = entering
      ? {
          x: (values as EntryAnimationsValues).targetGlobalOriginX,
          y: (values as EntryAnimationsValues).targetGlobalOriginY,
          width: (values as EntryAnimationsValues).targetWidth,
          height: (values as EntryAnimationsValues).targetHeight,
        }
      : {
          x: (values as ExitAnimationsValues).currentGlobalOriginX,
          y: (values as ExitAnimationsValues).currentGlobalOriginY,
          width: (values as ExitAnimationsValues).currentWidth,
          height: (values as ExitAnimationsValues).currentHeight,
        }
    const ax = anchorX - (layout.x + layout.width / 2)
    const ay = anchorY - (layout.y + layout.height / 2)
    const hidden = {
      opacity: 0,
      translateX: dx + (1 - MENU_SCALE) * ax,
      translateY: dy + (1 - MENU_SCALE) * ay,
      scale: MENU_SCALE,
    }
    const shown = { opacity: 1, translateX: 0, translateY: 0, scale: 1 }
    const from = entering ? hidden : shown
    const to = entering ? shown : hidden
    return {
      initialValues: {
        opacity: from.opacity,
        transform: [
          { translateX: from.translateX },
          { translateY: from.translateY },
          { scale: from.scale },
        ],
      },
      animations: {
        opacity: withTiming(to.opacity, config),
        transform: [
          { translateX: withTiming(to.translateX, config) },
          { translateY: withTiming(to.translateY, config) },
          { scale: withTiming(to.scale, config) },
        ],
      },
    }
  }
  return animation as EntryExitAnimationFunction
}

function Root({
  aspectRatio,
  insets = NO_INSETS,
  children,
  ...props
}: RootProps) {
  return (
    <MenuRootImpl parent="context-menu" {...props}>
      <RootState aspectRatio={aspectRatio} insets={insets}>
        {children}
      </RootState>
    </MenuRootImpl>
  )
}

Root.displayName = "PreviewMenuRoot"

function RootState({
  aspectRatio,
  insets,
  children,
}: {
  aspectRatio: number | undefined
  insets: PreviewMenuInsets
  children: RootProps["children"]
}) {
  const { floating } = useMenuRootContext("PreviewMenu.Root")
  const { open } = floating
  const window = useWindowDimensions()
  const [source, setSource] = React.useState<AnchorRect | null>(null)
  const [menuHeight, setMenuHeightState] = React.useState<number | null>(null)
  const [lifted, setLifted] = React.useState(false)
  const contentRef = React.useRef<React.ReactNode>(null)
  const triggerNodeRef = React.useRef<HostInstance | null>(null)

  const frame = React.useMemo(
    () =>
      source
        ? measureFrame(source, window, insets, aspectRatio, menuHeight)
        : null,
    [source, window, insets, aspectRatio, menuHeight]
  )

  const lift = React.useCallback(
    (next: AnchorRect) => {
      setSource(next)
      return measureFrame(next, window, insets, aspectRatio, menuHeight)
    },
    [window, insets, aspectRatio, menuHeight]
  )

  const setMenuHeight = React.useCallback((height: number) => {
    if (height > 0) setMenuHeightState(height)
  }, [])

  React.useEffect(() => {
    if (open) return
    const timeout = setTimeout(() => {
      setLifted(false)
      setMenuHeightState(null)
      setSource(null)
    }, HANDOFF_DELAY)
    return () => clearTimeout(timeout)
  }, [open])

  React.useLayoutEffect(() => {
    if (!open || source) return
    let attempts = 0
    let timeout: ReturnType<typeof setTimeout> | undefined
    const measure = () => {
      triggerNodeRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
        if (width > 0 && height > 0) {
          lift({ pageX, pageY, width, height })
        } else if (attempts < 10) {
          attempts += 1
          timeout = setTimeout(measure, 50)
        }
      })
    }
    measure()
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [open, source, lift])

  const ready = open && frame !== null && menuHeight !== null

  const context = React.useMemo<RootContextValue>(
    () => ({
      open,
      lifted,
      ready,
      frame,
      insets,
      lift,
      setLifted,
      setMenuHeight,
      contentRef,
      triggerNodeRef,
    }),
    [open, lifted, ready, frame, insets, lift, setMenuHeight]
  )

  return (
    <RootContext.Provider value={context}>
      {typeof children === "function"
        ? children({ payload: floating.payload })
        : children}
    </RootContext.Provider>
  )
}

const ACCESSIBILITY_ACTIONS = [{ name: "longpress" }]

function Trigger({
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  children,
  ...elementProps
}: TriggerProps) {
  const { floating } = useMenuRootContext("PreviewMenu.Trigger")
  const { open, lifted, lift, contentRef, triggerNodeRef } = useRootContext(
    "PreviewMenu.Trigger"
  )
  const { openAt } = floating
  const haptics = useHaptics()
  const disabled = !!disabledProp || floating.disabled
  contentRef.current = children as React.ReactNode
  const composedRef = useComposedRefs<HostInstance>(
    ref as React.Ref<HostInstance> | undefined,
    floating.triggerRef,
    triggerNodeRef
  )

  const show = React.useCallback(
    (event?: GestureResponderEvent | AccessibilityActionEvent) => {
      const node = triggerNodeRef.current
      if (disabled || !node) return
      node.measure((_x, _y, width, height, pageX, pageY) => {
        const frame = lift({ pageX, pageY, width, height })
        const opened = openAt(
          {
            pageX: frame.left,
            pageY: frame.top,
            width: frame.width,
            height: frame.height,
          },
          REASONS.triggerLongPress,
          event
        )
        if (opened) haptics.impact("medium")
      })
    },
    [disabled, triggerNodeRef, lift, openAt, haptics]
  )

  const state = React.useMemo<TriggerState>(
    () => ({ open, lifted, disabled }),
    [open, lifted, disabled]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: composedRef,
    props: [
      {
        accessibilityRole: "button",
        accessibilityActions: ACCESSIBILITY_ACTIONS,
        accessibilityState: { expanded: open, disabled },
        onAccessibilityAction: (event: AccessibilityActionEvent) => {
          if (event.nativeEvent.actionName === "longpress") show(event)
        },
        onLongPress: (event: GestureResponderEvent) => show(event),
        disabled: disabled || undefined,
        children,
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "PreviewMenuTrigger"

function Portal({ children, ...props }: PortalProps) {
  const context = useRootContext("PreviewMenu.Portal")
  return (
    <MenuPortal {...props}>
      <RootContext.Provider value={context}>{children}</RootContext.Provider>
    </MenuPortal>
  )
}

Portal.displayName = "PreviewMenuPortal"

function Preview({
  render,
  className,
  style,
  ref,
  children,
  ...elementProps
}: PreviewProps) {
  const { floating } = useMenuRootContext("PreviewMenu.Preview")
  const { frame, ready, contentRef, setLifted } = useRootContext(
    "PreviewMenu.Preview"
  )
  const { open, setOpen } = floating
  const entering = React.useMemo(
    () => (frame ? liftAnimation(frame, true) : undefined),
    [frame]
  )
  const exiting = React.useMemo(
    () => (frame ? liftAnimation(frame, false) : undefined),
    [frame]
  )
  const state = React.useMemo<PreviewState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: Animated.View,
    render,
    className,
    style,
    state,
    ref: ref as React.Ref<unknown>,
    props: [
      {
        entering,
        exiting,
        style: frame
          ? {
              position: "absolute",
              top: frame.top,
              left: frame.left,
              width: frame.width,
              height: frame.height,
            }
          : undefined,
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
        onLayout: () => setLifted(true),
        onStartShouldSetResponder: () => true,
        onResponderRelease: (event: GestureResponderEvent) => {
          setOpen(false, REASONS.outsidePress, event)
        },
        children: children ?? contentRef.current,
      },
      elementProps,
    ],
    enabled: ready && frame !== null,
  })
}

Preview.displayName = "PreviewMenuPreview"

function useLayer(layer: PreviewLayer) {
  const { frame, contentRef } = useRootContext("PreviewMenu layer")
  return React.useMemo(() => {
    if (!frame) return null
    const { source } = frame
    return {
      entering: layerAnimation(frame, layer, true),
      exiting: layerAnimation(frame, layer, false),
      style:
        layer === "source"
          ? {
              position: "absolute" as const,
              width: source.width,
              height: source.height,
              left: (frame.width - source.width) / 2,
              top: (frame.height - source.height) / 2,
            }
          : {
              position: "absolute" as const,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
      content: layer === "source" ? contentRef.current : null,
    }
  }, [frame, layer, contentRef])
}

function Positioner({
  sideOffset = GAP,
  collisionPadding,
  children,
  ...props
}: PositionerProps) {
  const { frame, insets, ready, setMenuHeight } = useRootContext(
    "PreviewMenu.Positioner"
  )
  const anchor = React.useMemo<AnchorRect | undefined>(
    () =>
      frame
        ? {
            pageX: frame.left,
            pageY: frame.top,
            width: frame.width,
            height: frame.height,
          }
        : undefined,
    [frame]
  )
  const gap = typeof sideOffset === "number" ? sideOffset : GAP
  const entering = React.useMemo(
    () => (frame ? menuAnimation(frame, gap, true) : undefined),
    [frame, gap]
  )
  const exiting = React.useMemo(
    () => (frame ? menuAnimation(frame, gap, false) : undefined),
    [frame, gap]
  )
  return (
    <MenuPositioner
      anchor={anchor}
      side="bottom"
      align="center"
      sideOffset={sideOffset}
      collisionPadding={
        collisionPadding ?? {
          top: insets.top + EDGE,
          bottom: insets.bottom + EDGE,
          left: EDGE,
          right: EDGE,
        }
      }
      {...props}
    >
      <Animated.View
        key={ready ? "shown" : "measuring"}
        entering={ready ? entering : undefined}
        exiting={ready ? exiting : undefined}
        style={ready ? undefined : { opacity: 0 }}
        onLayout={(event) => setMenuHeight(event.nativeEvent.layout.height)}
      >
        {children as React.ReactNode}
      </Animated.View>
    </MenuPositioner>
  )
}

Positioner.displayName = "PreviewMenuPositioner"

export type {
  BackdropProps,
  GroupLabelProps,
  GroupProps,
  ItemProps,
  ItemState,
  PopupProps,
  PopupState,
  SeparatorProps,
} from "./menu"
export {
  Backdrop,
  Group,
  GroupLabel,
  Item,
  Popup,
  Separator,
  useMenuRootContext,
} from "./menu"
export type {
  PositionerProps,
  PreviewLayer,
  PreviewMenuFrame,
  PreviewMenuInsets,
  PreviewProps,
  PreviewState,
  RootContextValue,
  RootProps,
  TriggerProps,
  TriggerState,
}
export { Portal, Positioner, Preview, Root, Trigger, useLayer, useRootContext }
