import * as React from "react"
import {
  type GestureResponderEvent,
  I18nManager,
  Keyboard,
  type KeyboardEvent,
  type LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native"
import { REASONS } from "./event-details"
import {
  type FloatingRootValue,
  measureAnchorRect,
  useOptionalFloatingRootContext,
} from "./floating-root"
import type {
  Align,
  AnchorRect,
  BaseUIComponentProps,
  CollisionAvoidance,
  OffsetFunction,
  Padding,
  PositionerAnchor,
  PositionerParameters,
  Side,
} from "./types"
import { useRender } from "./use-render"

interface Size {
  width: number
  height: number
}

interface Point {
  x: number
  y: number
}

interface ResolvedPadding {
  top: number
  right: number
  bottom: number
  left: number
}

interface ComputePositionArgs {
  anchor: AnchorRect
  popup: Size
  boundary: Size
  side?: Side | undefined
  align?: Align | undefined
  sideOffset?: number | OffsetFunction | undefined
  alignOffset?: number | OffsetFunction | undefined
  collisionPadding?: Padding | undefined
  collisionAvoidance?: CollisionAvoidance | undefined
  arrowPadding?: number | undefined
  arrowSize?: Size | null | undefined
  rtl?: boolean | undefined
}

interface ArrowPosition {
  x: number | undefined
  y: number | undefined
  uncentered: boolean
}

interface ComputedPosition {
  x: number
  y: number
  side: Side
  align: Align
  availableWidth: number
  availableHeight: number
  anchorHidden: boolean
  transformOrigin: Point
  arrow: ArrowPosition
}

const DEFAULT_COLLISION_AVOIDANCE: CollisionAvoidance = {
  side: "flip",
  align: "flip",
  fallbackAxisSide: "end",
}

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function resolvePadding(padding: Padding | undefined): ResolvedPadding {
  if (typeof padding === "number") {
    return { top: padding, right: padding, bottom: padding, left: padding }
  }
  return {
    top: padding?.top ?? 0,
    right: padding?.right ?? 0,
    bottom: padding?.bottom ?? 0,
    left: padding?.left ?? 0,
  }
}

function isVertical(side: Side) {
  return side === "top" || side === "bottom"
}

function alignedPosition(
  align: Align,
  start: number,
  end: number,
  center: number
) {
  if (align === "start") return start
  if (align === "end") return end
  return center
}

function swapAlign(align: Align): Align {
  if (align === "start") return "end"
  if (align === "end") return "start"
  return align
}

function computePosition({
  anchor,
  popup,
  boundary,
  side: requestedSide = "bottom",
  align: requestedAlign = "center",
  sideOffset = 0,
  alignOffset = 0,
  collisionPadding = 5,
  collisionAvoidance = DEFAULT_COLLISION_AVOIDANCE,
  arrowPadding = 5,
  arrowSize,
  rtl = false,
}: ComputePositionArgs): ComputedPosition {
  const padding = resolvePadding(collisionPadding)
  const sideMode = collisionAvoidance.side ?? "flip"
  const alignMode = collisionAvoidance.align ?? "flip"
  const fallbackAxisSide = collisionAvoidance.fallbackAxisSide ?? "none"
  const minX = padding.left
  const maxX = boundary.width - padding.right - popup.width
  const minY = padding.top
  const maxY = boundary.height - padding.bottom - popup.height

  function resolveOffset(
    value: number | OffsetFunction,
    side: Side,
    align: Align
  ) {
    if (typeof value === "number") return value
    return value({
      side: side,
      align,
      anchor: { width: anchor.width, height: anchor.height },
      positioner: { width: popup.width, height: popup.height },
    })
  }

  function place(side: Side, align: Align): Point {
    const mainOffset = resolveOffset(sideOffset, side, align)
    const crossOffset = resolveOffset(alignOffset, side, align)
    if (isVertical(side)) {
      const start = rtl
        ? anchor.pageX + anchor.width - popup.width
        : anchor.pageX
      const end = rtl ? anchor.pageX : anchor.pageX + anchor.width - popup.width
      const center = anchor.pageX + anchor.width / 2 - popup.width / 2
      const x =
        alignedPosition(align, start, end, center) +
        (rtl ? -crossOffset : crossOffset)
      const y =
        side === "top"
          ? anchor.pageY - mainOffset - popup.height
          : anchor.pageY + anchor.height + mainOffset
      return { x, y }
    }
    const start = anchor.pageY
    const end = anchor.pageY + anchor.height - popup.height
    const center = anchor.pageY + anchor.height / 2 - popup.height / 2
    const y = alignedPosition(align, start, end, center) + crossOffset
    const x =
      side === "left"
        ? anchor.pageX - mainOffset - popup.width
        : anchor.pageX + anchor.width + mainOffset
    return { x, y }
  }

  function fitsMain(side: Side, point: Point) {
    return isVertical(side)
      ? point.y >= minY && point.y <= maxY
      : point.x >= minX && point.x <= maxX
  }

  function fitsCross(side: Side, point: Point) {
    return isVertical(side)
      ? point.x >= minX && point.x <= maxX
      : point.y >= minY && point.y <= maxY
  }

  function mainSpace(side: Side, align: Align) {
    const offset = resolveOffset(sideOffset, side, align)
    if (side === "top") return anchor.pageY - offset - padding.top
    if (side === "bottom") {
      return (
        boundary.height -
        padding.bottom -
        (anchor.pageY + anchor.height + offset)
      )
    }
    if (side === "left") return anchor.pageX - offset - padding.left
    return (
      boundary.width - padding.right - (anchor.pageX + anchor.width + offset)
    )
  }

  const preferred = requestedSide
  let side = preferred

  if (sideMode === "flip") {
    const candidates: Side[] = [preferred, OPPOSITE_SIDE[preferred]]
    if (fallbackAxisSide !== "none") {
      let perpendicular: Side[] = ["top", "bottom"]
      if (isVertical(preferred)) {
        perpendicular = rtl ? ["right", "left"] : ["left", "right"]
      }
      if (fallbackAxisSide === "end") perpendicular.reverse()
      candidates.push(...perpendicular)
    }
    const fitting = candidates.find((candidate) =>
      fitsMain(candidate, place(candidate, requestedAlign))
    )
    if (fitting) {
      side = fitting
    } else {
      const opposite = OPPOSITE_SIDE[preferred]
      side =
        mainSpace(opposite, requestedAlign) >
        mainSpace(preferred, requestedAlign)
          ? opposite
          : preferred
    }
  }

  let align = requestedAlign
  if (
    alignMode === "flip" &&
    align !== "center" &&
    !fitsCross(side, place(side, align))
  ) {
    const swapped = swapAlign(align)
    if (fitsCross(side, place(side, swapped))) align = swapped
  }

  const placed = place(side, align)
  let { x, y } = placed

  if (alignMode !== "none") {
    if (isVertical(side)) x = clamp(x, minX, maxX)
    else y = clamp(y, minY, maxY)
  }

  if (sideMode !== "none") {
    if (isVertical(side)) y = clamp(y, minY, maxY)
    else x = clamp(x, minX, maxX)
  }

  const boundaryWidth = Math.max(
    0,
    boundary.width - padding.left - padding.right
  )
  const boundaryHeight = Math.max(
    0,
    boundary.height - padding.top - padding.bottom
  )
  const space = Math.max(0, mainSpace(side, align))
  const availableWidth = isVertical(side) ? boundaryWidth : space
  const availableHeight = isVertical(side) ? space : boundaryHeight

  const anchorCenterX = anchor.pageX + anchor.width / 2 - x
  const anchorCenterY = anchor.pageY + anchor.height / 2 - y

  const transformOrigin: Point = isVertical(side)
    ? {
        x: clamp(anchorCenterX, 0, popup.width),
        y: side === "top" ? popup.height : 0,
      }
    : {
        x: side === "left" ? popup.width : 0,
        y: clamp(anchorCenterY, 0, popup.height),
      }

  const arrowWidth = arrowSize?.width ?? 0
  const arrowHeight = arrowSize?.height ?? 0
  let arrow: ArrowPosition
  if (isVertical(side)) {
    const ideal = anchorCenterX - arrowWidth / 2
    const arrowX = clamp(
      ideal,
      arrowPadding,
      popup.width - arrowPadding - arrowWidth
    )
    arrow = { x: arrowX, y: undefined, uncentered: arrowX !== ideal }
  } else {
    const ideal = anchorCenterY - arrowHeight / 2
    const arrowY = clamp(
      ideal,
      arrowPadding,
      popup.height - arrowPadding - arrowHeight
    )
    arrow = { x: undefined, y: arrowY, uncentered: arrowY !== ideal }
  }

  const anchorHidden =
    anchor.pageX + anchor.width <= 0 ||
    anchor.pageY + anchor.height <= 0 ||
    anchor.pageX >= boundary.width ||
    anchor.pageY >= boundary.height

  return {
    x,
    y,
    side: side,
    align,
    availableWidth,
    availableHeight,
    anchorHidden,
    transformOrigin,
    arrow,
  }
}

function isSameSize(previous: Size | null, next: Size | null) {
  if (!previous || !next) return previous === next
  return previous.width === next.width && previous.height === next.height
}

function isAnchorRect(anchor: PositionerAnchor): anchor is AnchorRect {
  return anchor != null && "pageX" in anchor
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

function useResolvedAnchor(
  open: boolean,
  anchor: PositionerAnchor,
  fallback: AnchorRect | null
): AnchorRect | null {
  const { width, height } = useWindowDimensions()
  const [measured, setMeasured] = React.useState<AnchorRect | null>(null)
  const anchorRef = anchor != null && !isAnchorRect(anchor) ? anchor : null

  React.useEffect(() => {
    if (!open || !anchorRef || width <= 0 || height <= 0) {
      setMeasured(null)
      return
    }
    measureAnchorRect(anchorRef.current, (rect) => {
      setMeasured((previous) => (isSameRect(previous, rect) ? previous : rect))
    })
  }, [open, anchorRef, width, height])

  if (isAnchorRect(anchor)) return anchor
  if (anchorRef) return measured
  return fallback
}

function useKeyboardTop() {
  const [top, setTop] = React.useState<number | null>(null)

  React.useEffect(() => {
    const show = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow"
    const hide = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"
    const onShow = (event: KeyboardEvent) => {
      setTop(event.endCoordinates.screenY)
    }
    const onHide = () => {
      setTop(null)
    }
    const subscriptions = [
      Keyboard.addListener(show, onShow),
      Keyboard.addListener("keyboardDidChangeFrame", onShow),
      Keyboard.addListener(hide, onHide),
    ]
    return () => {
      for (const subscription of subscriptions) subscription.remove()
    }
  }, [])

  return top
}

interface UsePositionerParameters extends PositionerParameters {
  open: boolean
  anchor?: PositionerAnchor
  fallbackAnchor?: AnchorRect | null | undefined
}

interface PositionerContextValue {
  open: boolean
  side: Side
  align: Align
  anchorHidden: boolean
  isPositioned: boolean
  availableWidth: number
  availableHeight: number
  anchorWidth: number
  anchorHeight: number
  transformOrigin: Point
  arrow: ArrowPosition
  arrowStyle: ViewStyle
  setArrowSize: (size: Size | null) => void
}

interface UsePositionerReturnValue extends PositionerContextValue {
  anchor: AnchorRect | null
  style: ViewStyle
  onLayout: (event: LayoutChangeEvent) => void
}

function usePositioner({
  open,
  anchor: anchorParameter,
  fallbackAnchor = null,
  side = "bottom",
  align = "center",
  sideOffset = 0,
  alignOffset = 0,
  collisionPadding = 5,
  collisionAvoidance = DEFAULT_COLLISION_AVOIDANCE,
  arrowPadding = 5,
}: UsePositionerParameters): UsePositionerReturnValue {
  const window = useWindowDimensions()
  const keyboardTop = useKeyboardTop()
  const boundaryHeight =
    keyboardTop !== null && keyboardTop < window.height
      ? keyboardTop
      : window.height
  const rtl = I18nManager.isRTL
  const anchor = useResolvedAnchor(open, anchorParameter, fallbackAnchor)
  const [popupSize, setPopupSize] = React.useState<Size | null>(null)
  const [arrowSize, setArrowSizeState] = React.useState<Size | null>(null)

  React.useEffect(() => {
    if (!open) setPopupSize(null)
  }, [open])

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setPopupSize((previous) =>
      isSameSize(previous, { width, height }) ? previous : { width, height }
    )
  }, [])

  const setArrowSize = React.useCallback((size: Size | null) => {
    setArrowSizeState((previous) =>
      isSameSize(previous, size) ? previous : size
    )
  }, [])

  const position =
    open && anchor && popupSize
      ? computePosition({
          anchor,
          popup: popupSize,
          boundary: { width: window.width, height: boundaryHeight },
          side,
          align,
          sideOffset,
          alignOffset,
          collisionPadding,
          collisionAvoidance,
          arrowPadding,
          arrowSize,
          rtl,
        })
      : null

  const padding = resolvePadding(collisionPadding)
  const maxWidth = Math.max(0, window.width - padding.left - padding.right)

  let style: ViewStyle
  if (!open) {
    style = { position: "absolute", display: "none" }
  } else if (!position) {
    style = {
      position: "absolute",
      top: window.height,
      left: 0,
      maxWidth,
      opacity: 0,
    }
  } else {
    style = {
      position: "absolute",
      top: position.y,
      left: position.x,
      maxWidth,
    }
  }

  const arrowStyle: ViewStyle = position
    ? {
        position: "absolute",
        ...(position.arrow.x !== undefined ? { left: position.arrow.x } : null),
        ...(position.arrow.y !== undefined ? { top: position.arrow.y } : null),
      }
    : { position: "absolute", opacity: 0 }

  return {
    style,
    onLayout,
    open,
    side: position?.side ?? side,
    align: position?.align ?? align,
    anchorHidden: position?.anchorHidden ?? false,
    isPositioned: position !== null,
    availableWidth: position?.availableWidth ?? maxWidth,
    availableHeight:
      position?.availableHeight ??
      Math.max(0, boundaryHeight - padding.top - padding.bottom),
    anchor,
    anchorWidth: anchor?.width ?? 0,
    anchorHeight: anchor?.height ?? 0,
    transformOrigin: position?.transformOrigin ?? { x: 0, y: 0 },
    arrow: position?.arrow ?? { x: undefined, y: undefined, uncentered: false },
    arrowStyle,
    setArrowSize,
  }
}

const PositionerContext = React.createContext<PositionerContextValue | null>(
  null
)

function useOptionalPositionerContext() {
  return React.useContext(PositionerContext)
}

function usePositionerContext(componentName = "Popup") {
  const context = React.useContext(PositionerContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside a Positioner`)
  }
  return context
}

interface PositionerState {
  open: boolean
  side: Side
  align: Align
  anchorHidden: boolean
}

type PositionerProps = BaseUIComponentProps<typeof View, PositionerState> &
  PositionerParameters & {
    root?: FloatingRootValue | undefined
    dismissOnOutsidePress?: boolean | undefined
  }

function claimResponder() {
  return true
}

interface OutsidePressLayerProps {
  anchor: AnchorRect | null
  onPress: (event: GestureResponderEvent) => void
}

function OutsidePressLayer({ anchor, onPress }: OutsidePressLayerProps) {
  const window = useWindowDimensions()
  if (!anchor || anchor.width <= 0 || anchor.height <= 0) {
    return (
      <Pressable
        accessible={false}
        importantForAccessibility="no"
        style={StyleSheet.absoluteFill}
        onPress={onPress}
      />
    )
  }
  const left = Math.max(0, anchor.pageX)
  const top = Math.max(0, anchor.pageY)
  const right = Math.min(window.width, anchor.pageX + anchor.width)
  const bottom = Math.min(window.height, anchor.pageY + anchor.height)
  const regions: Record<string, ViewStyle> = {
    above: { top: 0, left: 0, right: 0, height: top },
    below: { top: bottom, left: 0, right: 0, bottom: 0 },
    before: { top, left: 0, width: left, height: bottom - top },
    after: { top, left: right, right: 0, height: bottom - top },
  }
  return Object.entries(regions).map(([key, region]) => (
    <Pressable
      key={key}
      accessible={false}
      importantForAccessibility="no"
      style={[styles.region, region]}
      onPress={onPress}
    />
  ))
}

function Positioner({
  root: rootParameter,
  anchor,
  side,
  align,
  sideOffset,
  alignOffset,
  collisionPadding,
  collisionAvoidance,
  arrowPadding,
  dismissOnOutsidePress = true,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PositionerProps) {
  const context = useOptionalFloatingRootContext()
  const root = rootParameter ?? context
  if (!root) {
    throw new Error("Positioner must be rendered inside its Root component")
  }
  const { open, setOpen } = root

  const positioner = usePositioner({
    open,
    anchor,
    fallbackAnchor: root.anchor,
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    collisionAvoidance,
    arrowPadding,
  })

  const state = React.useMemo<PositionerState>(
    () => ({
      open,
      side: positioner.side,
      align: positioner.align,
      anchorHidden: positioner.anchorHidden,
    }),
    [open, positioner.side, positioner.align, positioner.anchorHidden]
  )

  const {
    anchor: anchorRect,
    style: positionStyle,
    onLayout,
    side: resolvedSide,
    align: resolvedAlign,
    anchorHidden,
    isPositioned,
    availableWidth,
    availableHeight,
    anchorWidth,
    anchorHeight,
    transformOrigin,
    arrow,
    arrowStyle,
    setArrowSize,
  } = positioner

  const contextValue = React.useMemo<PositionerContextValue>(
    () => ({
      open,
      side: resolvedSide,
      align: resolvedAlign,
      anchorHidden,
      isPositioned,
      availableWidth,
      availableHeight,
      anchorWidth,
      anchorHeight,
      transformOrigin,
      arrow,
      arrowStyle,
      setArrowSize,
    }),
    [
      open,
      resolvedSide,
      resolvedAlign,
      anchorHidden,
      isPositioned,
      availableWidth,
      availableHeight,
      anchorWidth,
      anchorHeight,
      transformOrigin,
      arrow,
      arrowStyle,
      setArrowSize,
    ]
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
        style: positionStyle,
        onLayout,
        onStartShouldSetResponder: claimResponder,
      },
      elementProps,
    ],
  })

  const onOutsidePress = React.useCallback(
    (event: GestureResponderEvent) => {
      setOpen(false, REASONS.outsidePress, event)
    },
    [setOpen]
  )

  return (
    <PositionerContext.Provider value={contextValue}>
      {open && dismissOnOutsidePress ? (
        <OutsidePressLayer anchor={anchorRect} onPress={onOutsidePress} />
      ) : null}
      {element}
    </PositionerContext.Provider>
  )
}

Positioner.displayName = "Positioner"

const styles = StyleSheet.create({
  region: { position: "absolute" },
})

export type {
  ArrowPosition,
  ComputedPosition,
  ComputePositionArgs,
  Point,
  PositionerContextValue,
  PositionerProps,
  PositionerState,
  Size,
  UsePositionerParameters,
  UsePositionerReturnValue,
}
export {
  computePosition,
  Positioner,
  PositionerContext,
  resolvePadding,
  useOptionalPositionerContext,
  usePositioner,
  usePositionerContext,
}
