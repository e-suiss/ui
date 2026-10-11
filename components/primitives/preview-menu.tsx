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
  type EntryExitAnimationFunction,
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

const MENU_SPACE = 260

const MAX_WIDTH = 360

const ENTER_DURATION = 400

const EXIT_DURATION = 300

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
  frame: PreviewMenuFrame | null
  insets: PreviewMenuInsets
  lift: (source: AnchorRect) => PreviewMenuFrame
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
  aspectRatio: number | undefined
): PreviewMenuFrame {
  const ratio = aspectRatio
    ? 1 / aspectRatio
    : source.height / Math.max(source.width, 1)
  const topLimit = insets.top + EDGE
  const bottomLimit = window.height - insets.bottom - EDGE
  let width = Math.min(window.width - EDGE * 2, MAX_WIDTH)
  let height = width * ratio
  const maxHeight = bottomLimit - topLimit - MENU_SPACE
  if (height > maxHeight) {
    height = Math.max(
      maxHeight,
      Math.min(source.height, bottomLimit - topLimit)
    )
    width = height / Math.max(ratio, 0.01)
  }
  const left = (window.width - width) / 2
  const centered = source.pageY + source.height / 2 - height / 2
  const top = Math.min(
    Math.max(centered, topLimit),
    Math.max(topLimit, bottomLimit - MENU_SPACE - height)
  )
  return { top, left, width, height, source }
}

function liftAnimation(frame: PreviewMenuFrame, entering: boolean) {
  const { source } = frame
  const dx = source.pageX + source.width / 2 - (frame.left + frame.width / 2)
  const dy = source.pageY + source.height / 2 - (frame.top + frame.height / 2)
  const sx = source.width / Math.max(frame.width, 1)
  const sy = source.height / Math.max(frame.height, 1)
  const animation: EntryExitAnimationFunction = () => {
    "worklet"
    const config = {
      duration: entering ? ENTER_DURATION : EXIT_DURATION,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
      reduceMotion: ReduceMotion.System,
    }
    const from = entering ? 1 : 0
    const to = 1 - from
    const lerp = (value: number, identity: number, amount: number) =>
      identity + (value - identity) * amount
    return {
      initialValues: {
        transform: [
          { translateX: lerp(dx, 0, from) },
          { translateY: lerp(dy, 0, from) },
          { scaleX: lerp(sx, 1, from) },
          { scaleY: lerp(sy, 1, from) },
        ],
      },
      animations: {
        transform: [
          { translateX: withTiming(lerp(dx, 0, to), config) },
          { translateY: withTiming(lerp(dy, 0, to), config) },
          { scaleX: withTiming(lerp(sx, 1, to), config) },
          { scaleY: withTiming(lerp(sy, 1, to), config) },
        ],
      },
    }
  }
  return animation
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
  const [frame, setFrame] = React.useState<PreviewMenuFrame | null>(null)
  const [lifted, setLifted] = React.useState(open)
  const contentRef = React.useRef<React.ReactNode>(null)
  const triggerNodeRef = React.useRef<HostInstance | null>(null)

  const lift = React.useCallback(
    (source: AnchorRect) => {
      const next = measureFrame(source, window, insets, aspectRatio)
      setFrame(next)
      setLifted(true)
      return next
    },
    [window, insets, aspectRatio]
  )

  React.useEffect(() => {
    if (open) {
      setLifted(true)
      return
    }
    const timeout = setTimeout(() => setLifted(false), EXIT_DURATION)
    return () => clearTimeout(timeout)
  }, [open])

  React.useLayoutEffect(() => {
    if (!open || frame) return
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
  }, [open, frame, lift])

  const context = React.useMemo<RootContextValue>(
    () => ({ open, lifted, frame, insets, lift, contentRef, triggerNodeRef }),
    [open, lifted, frame, insets, lift]
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
    () => ({ open, lifted: open || lifted, disabled }),
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
  const { frame, contentRef } = useRootContext("PreviewMenu.Preview")
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
        onStartShouldSetResponder: () => true,
        onResponderRelease: (event: GestureResponderEvent) => {
          setOpen(false, REASONS.outsidePress, event)
        },
        children: children ?? contentRef.current,
      },
      elementProps,
    ],
    enabled: frame !== null,
  })
}

Preview.displayName = "PreviewMenuPreview"

function Positioner({
  sideOffset = 12,
  collisionPadding,
  ...props
}: PositionerProps) {
  const { frame, insets } = useRootContext("PreviewMenu.Positioner")
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
    />
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
  PreviewMenuFrame,
  PreviewMenuInsets,
  PreviewProps,
  PreviewState,
  RootContextValue,
  RootProps,
  TriggerProps,
  TriggerState,
}
export { Portal, Positioner, Preview, Root, Trigger, useRootContext }
