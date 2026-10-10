import * as React from "react"
import {
  AccessibilityInfo,
  BackHandler,
  type HostInstance,
  type LayoutRectangle,
  type MeasureOnSuccessCallback,
  useWindowDimensions,
  type ViewStyle,
} from "react-native"
import type { Align, Insets, Side } from "./types"

function useEffectEvent<TArgs extends readonly unknown[], TResult>(
  callback: (...args: TArgs) => TResult
): (...args: TArgs) => TResult {
  const callbackRef = React.useRef(callback)

  React.useLayoutEffect(() => {
    callbackRef.current = callback
  })

  return React.useCallback(
    (...args: TArgs): TResult => callbackRef.current(...args),
    []
  )
}

interface UseControllableStateParams<T> {
  prop?: T | undefined
  defaultProp?: T | undefined
  onChange?: (value: T) => void
}

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): readonly [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>,
] {
  const [uncontrolled, setUncontrolled] = React.useState<T | undefined>(
    defaultProp
  )
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolled
  const valueRef = React.useRef(value)
  valueRef.current = value
  const handleChange = useEffectEvent((next: T | undefined) => {
    onChange?.(next as T)
  })

  const setValue = React.useCallback<
    React.Dispatch<React.SetStateAction<T | undefined>>
  >(
    (action) => {
      const current = valueRef.current
      const next =
        typeof action === "function"
          ? (action as (previous: T | undefined) => T | undefined)(current)
          : action
      if (Object.is(next, current)) return
      valueRef.current = next
      if (!isControlled) setUncontrolled(next)
      handleChange(next)
    },
    [isControlled, handleChange]
  )

  return [value, setValue] as const
}

type PossibleRef<T> = React.Ref<T> | undefined

function assignRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === "function") {
    const cleanup = ref(value)
    return typeof cleanup === "function" ? cleanup : undefined
  }
  if (ref != null) {
    ref.current = value
    return () => {
      ref.current = null
    }
  }
  return undefined
}

function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => assignRef(ref, node))
    return () => {
      refs.forEach((ref, index) => {
        const cleanup = cleanups[index]
        if (cleanup) cleanup()
        else if (typeof ref === "function") ref(null)
      })
    }
  }
}

interface ComposedRefsCache<T> {
  refs: PossibleRef<T>[]
  callback: React.RefCallback<T>
}

function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  const cacheRef = React.useRef<ComposedRefsCache<T> | null>(null)
  const cached = cacheRef.current
  if (
    cached &&
    cached.refs.length === refs.length &&
    cached.refs.every((ref, index) => ref === refs[index])
  ) {
    return cached.callback
  }
  const callback = composeRefs(...refs)
  cacheRef.current = { refs, callback }
  return callback
}

type AugmentedMethods = Record<string, (...args: never[]) => unknown>

interface UseAugmentedRefParams<T> {
  ref: React.Ref<T> | undefined
  methods?: AugmentedMethods
  deps?: React.DependencyList
}

function useAugmentedRef<T extends object>({
  ref,
  methods,
}: UseAugmentedRefParams<T>): React.RefObject<T | null> {
  const augmentedRef = React.useRef<T>(null)
  const methodsRef = React.useRef(methods)
  methodsRef.current = methods

  const handle = React.useMemo(
    () =>
      new Proxy({} as T, {
        get(_target, property) {
          const extra = methodsRef.current
          if (extra && typeof property === "string" && property in extra) {
            return extra[property]
          }
          const node = augmentedRef.current
          if (!node) return undefined
          const result: unknown = Reflect.get(node, property)
          return typeof result === "function" ? result.bind(node) : result
        },
        has(_target, property) {
          const extra = methodsRef.current
          if (extra && typeof property === "string" && property in extra) {
            return true
          }
          const node = augmentedRef.current
          return node ? property in node : false
        },
      }),
    []
  )

  React.useImperativeHandle(ref, () => handle, [handle])
  return augmentedRef
}

function useAccessibilityFocus<T extends HostInstance>(enabled = true) {
  const ref = React.useRef<T>(null)

  React.useEffect(() => {
    if (!enabled) return
    const timeout = setTimeout(() => {
      const node = ref.current
      if (node) AccessibilityInfo.sendAccessibilityEvent(node, "focus")
    }, 50)
    return () => clearTimeout(timeout)
  }, [enabled])

  return ref
}

function useRestoreAccessibilityFocus(
  open: boolean,
  ref: React.RefObject<HostInstance | null>
) {
  const wasOpenRef = React.useRef(open)

  React.useEffect(() => {
    const wasOpen = wasOpenRef.current
    wasOpenRef.current = open
    if (!wasOpen || open) return
    const timeout = setTimeout(() => {
      const node = ref.current
      if (node) AccessibilityInfo.sendAccessibilityEvent(node, "focus")
    }, 50)
    return () => clearTimeout(timeout)
  }, [open, ref])
}

function useBackHandler(enabled: boolean, onBack: () => void) {
  const handleBack = useEffectEvent(onBack)

  React.useEffect(() => {
    if (!enabled) return
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack()
        return true
      }
    )
    return () => subscription.remove()
  }, [enabled, handleBack])
}

interface LayoutPosition {
  pageX: number
  pageY: number
  width: number
  height: number
}

interface Measurable {
  measure: (callback: MeasureOnSuccessCallback) => void
}

function measureLayoutPosition(
  node: Measurable | null | undefined,
  onMeasure: (position: LayoutPosition) => void
) {
  node?.measure((_x, _y, width, height, pageX, pageY) => {
    onMeasure({ pageX, pageY, width, height })
  })
}

interface WindowSize {
  width: number
  height: number
}

interface RelativePositionOptions {
  side?: Side
  align?: Align
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  insets?: Insets
}

interface GetRelativePositionArgs extends RelativePositionOptions {
  triggerPosition: LayoutPosition
  contentLayout: Pick<LayoutRectangle, "width" | "height">
  window: WindowSize
}

interface RelativePosition {
  side: Side
  top: number
  left: number
  maxWidth: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function resolveVertical({
  side = "bottom",
  sideOffset = 0,
  avoidCollisions = true,
  insets,
  triggerPosition,
  contentLayout,
  window,
}: GetRelativePositionArgs) {
  const insetTop = insets?.top ?? 0
  const insetBottom = insets?.bottom ?? 0
  const above = triggerPosition.pageY - sideOffset - contentLayout.height
  const below = triggerPosition.pageY + triggerPosition.height + sideOffset

  if (!avoidCollisions) {
    return { side, top: side === "top" ? above : below }
  }

  const minTop = insetTop
  const maxTop = window.height - insetBottom - contentLayout.height
  const fitsAbove = above >= minTop
  const fitsBelow = below <= maxTop

  let resolved: Side = side
  if (side === "top" && !fitsAbove) {
    if (fitsBelow) resolved = "bottom"
  } else if (side === "bottom" && !fitsBelow) {
    if (fitsAbove) resolved = "top"
  }

  if (!fitsAbove && !fitsBelow) {
    const spaceAbove = triggerPosition.pageY - sideOffset - insetTop
    const spaceBelow =
      window.height -
      insetBottom -
      (triggerPosition.pageY + triggerPosition.height + sideOffset)
    resolved = spaceAbove > spaceBelow ? "top" : "bottom"
  }

  const top = resolved === "top" ? above : below
  return { side: resolved, top: clamp(top, minTop, maxTop) }
}

function resolveHorizontal({
  align = "center",
  alignOffset = 0,
  avoidCollisions = true,
  insets,
  triggerPosition,
  contentLayout,
  window,
}: GetRelativePositionArgs) {
  const insetLeft = insets?.left ?? 0
  const insetRight = insets?.right ?? 0
  const maxWidth = Math.max(0, window.width - insetLeft - insetRight)
  const width = Math.min(contentLayout.width, maxWidth)

  let left = triggerPosition.pageX
  if (align === "center") {
    left = triggerPosition.pageX + triggerPosition.width / 2 - width / 2
  } else if (align === "end") {
    left = triggerPosition.pageX + triggerPosition.width - width
  }
  left += alignOffset

  if (avoidCollisions) {
    left = clamp(left, insetLeft, window.width - insetRight - width)
  }

  return { left, maxWidth }
}

function getRelativePosition(args: GetRelativePositionArgs): RelativePosition {
  const vertical = resolveVertical(args)
  const horizontal = resolveHorizontal(args)
  return { ...vertical, ...horizontal }
}

interface UseRelativePositionArgs extends RelativePositionOptions {
  triggerPosition: LayoutPosition | null
  contentLayout: LayoutRectangle | null
  disablePositioningStyle?: boolean
}

function useRelativePosition({
  triggerPosition,
  contentLayout,
  side,
  align,
  sideOffset,
  alignOffset,
  avoidCollisions,
  insets,
  disablePositioningStyle,
}: UseRelativePositionArgs): ViewStyle {
  const { width, height } = useWindowDimensions()
  const insetTop = insets?.top
  const insetBottom = insets?.bottom
  const insetLeft = insets?.left
  const insetRight = insets?.right

  return React.useMemo<ViewStyle>(() => {
    if (disablePositioningStyle) return {}
    if (!triggerPosition || !contentLayout) {
      return { position: "absolute", opacity: 0, top: height, left: 0 }
    }
    const position = getRelativePosition({
      triggerPosition,
      contentLayout,
      side,
      align,
      sideOffset,
      alignOffset,
      avoidCollisions,
      insets: {
        top: insetTop,
        bottom: insetBottom,
        left: insetLeft,
        right: insetRight,
      },
      window: { width, height },
    })
    return {
      position: "absolute",
      top: position.top,
      left: position.left,
      maxWidth: position.maxWidth,
    }
  }, [
    disablePositioningStyle,
    triggerPosition,
    contentLayout,
    side,
    align,
    sideOffset,
    alignOffset,
    avoidCollisions,
    insetTop,
    insetBottom,
    insetLeft,
    insetRight,
    width,
    height,
  ])
}

export type {
  GetRelativePositionArgs,
  LayoutPosition,
  Measurable,
  RelativePosition,
  RelativePositionOptions,
  UseAugmentedRefParams,
  UseControllableStateParams,
  UseRelativePositionArgs,
}
export {
  composeRefs,
  getRelativePosition,
  measureLayoutPosition,
  useAccessibilityFocus,
  useAugmentedRef,
  useBackHandler,
  useComposedRefs,
  useControllableState,
  useEffectEvent,
  useRelativePosition,
  useRestoreAccessibilityFocus,
}
