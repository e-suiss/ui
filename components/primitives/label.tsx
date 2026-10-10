import type * as React from "react"
import {
  Pressable,
  Text as RNText,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { Slot } from "./slot"
import type {
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  TextRef,
} from "./types"

type RootProps = Omit<
  SlottablePressableProps,
  "children" | "hitSlop" | "style"
> & {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

type TextProps = SlottableTextProps & {
  nativeID?: string
}

type RootRef = PressableRef

function Root({
  asChild,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const Component = asChild ? Slot : Pressable
  return <Component ref={ref} {...props} />
}

Root.displayName = "LabelRoot"

function Text({
  asChild,
  ref,
  ...props
}: TextProps & React.RefAttributes<TextRef>) {
  const Component = asChild ? Slot : RNText
  return <Component ref={ref} {...props} />
}

Text.displayName = "LabelText"

export type { RootProps, RootRef, TextProps, TextRef }
export { Root, Text }
