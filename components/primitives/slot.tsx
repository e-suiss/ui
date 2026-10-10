import * as React from "react"
import type {
  PressableStateCallbackType,
  Image as RNImage,
  ImageProps as RNImageProps,
  PressableProps as RNPressableProps,
  Text as RNText,
  TextProps as RNTextProps,
  View as RNView,
  ViewProps as RNViewProps,
} from "react-native"
import { useComposedRefs } from "./hooks"
import type { PressableRef } from "./types"

type UnknownProps = Record<string, unknown>

type SlotProps = {
  children?: React.ReactNode
  ref?: React.Ref<unknown>
} & UnknownProps

type StyleCallback = (state: PressableStateCallbackType) => unknown

function isStyleCallback(value: unknown): value is StyleCallback {
  return typeof value === "function"
}

function isHandler(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function"
}

function joinStyles(first: unknown, second: unknown) {
  if (first == null || first === false) return second
  if (second == null || second === false) return first
  return [first, second]
}

function mergeStyles(slotStyle: unknown, childStyle: unknown) {
  if (isStyleCallback(slotStyle) || isStyleCallback(childStyle)) {
    return (state: PressableStateCallbackType) =>
      joinStyles(
        isStyleCallback(slotStyle) ? slotStyle(state) : slotStyle,
        isStyleCallback(childStyle) ? childStyle(state) : childStyle
      )
  }
  return joinStyles(slotStyle, childStyle)
}

const HANDLER_PATTERN = /^on[A-Z]/

function mergeProps(slotProps: UnknownProps, childProps: UnknownProps) {
  const merged: UnknownProps = { ...slotProps }

  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]

    if (childValue === undefined) continue

    if (HANDLER_PATTERN.test(key) && isHandler(childValue)) {
      merged[key] = isHandler(slotValue)
        ? (...args: unknown[]) => {
            childValue(...args)
            return slotValue(...args)
          }
        : childValue
    } else if (key === "style") {
      merged[key] = mergeStyles(slotValue, childValue)
    } else if (key === "className") {
      merged[key] = [slotValue, childValue].filter(Boolean).join(" ")
    } else {
      merged[key] = childValue
    }
  }

  return merged
}

function getElementRef(node: React.ReactNode): React.Ref<unknown> | undefined {
  if (!React.isValidElement<UnknownProps>(node)) return undefined
  return node.props.ref as React.Ref<unknown> | undefined
}

function Slot({ children, ref, ...slotProps }: SlotProps) {
  const childRef = getElementRef(children)
  const composedRef = useComposedRefs<unknown>(ref, childRef)

  if (!React.isValidElement<UnknownProps>(children)) return null

  if (children.type === React.Fragment) {
    return (
      <>
        {React.Children.map(
          children.props.children as React.ReactNode,
          (child) =>
            React.isValidElement(child) ? (
              <Slot {...slotProps} ref={ref}>
                {child}
              </Slot>
            ) : (
              child
            )
        )}
      </>
    )
  }

  const { ref: _childRef, ...childProps } = children.props

  return React.cloneElement(children, {
    ...mergeProps(slotProps, childProps),
    ref: ref ? composedRef : childRef,
  })
}

Slot.displayName = "Slot"

type TypedSlot<P, R> = (
  props: P & { children?: React.ReactNode; ref?: React.Ref<R> }
) => React.ReactNode

const View = Slot as unknown as TypedSlot<
  RNViewProps,
  React.ComponentRef<typeof RNView>
>
const Pressable = Slot as unknown as TypedSlot<
  Omit<RNPressableProps, "children">,
  PressableRef
>
const Text = Slot as unknown as TypedSlot<
  RNTextProps,
  React.ComponentRef<typeof RNText>
>
const Image = Slot as unknown as TypedSlot<
  RNImageProps,
  React.ComponentRef<typeof RNImage>
>

export type { SlotProps, TypedSlot }
export { Image, mergeProps, Pressable, Slot, Text, View }
