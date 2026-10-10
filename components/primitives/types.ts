import type * as React from "react"
import type {
  Image,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native"

type ComponentPropsWithAsChild<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & { asChild?: boolean }

type ViewRef = React.ComponentRef<typeof View>
type PressableRef = React.ComponentRef<typeof Pressable>
type TextRef = React.ComponentRef<typeof Text>
type ImageRef = React.ComponentRef<typeof Image>

type SlottableViewProps = ComponentPropsWithAsChild<typeof View>
type SlottablePressableProps = ComponentPropsWithAsChild<typeof Pressable>
type SlottableTextProps = ComponentPropsWithAsChild<typeof Text>
type SlottableImageProps = ComponentPropsWithAsChild<typeof Image>

type Side = "top" | "bottom"
type Align = "start" | "center" | "end"

interface Insets {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

interface ForceMountable {
  forceMount?: true | undefined
}

interface PositionedContentProps extends ForceMountable {
  style?: StyleProp<ViewStyle>
  side?: Side
  align?: Align
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  insets?: Insets
  disablePositioningStyle?: boolean
}

interface TriggerRefMethods {
  open: () => void
  close: () => void
}

type TriggerRef = PressableRef & Partial<TriggerRefMethods>

export type {
  Align,
  ComponentPropsWithAsChild,
  ForceMountable,
  ImageRef,
  Insets,
  PositionedContentProps,
  PressableRef,
  Side,
  SlottableImageProps,
  SlottablePressableProps,
  SlottableTextProps,
  SlottableViewProps,
  TextRef,
  TriggerRef,
  TriggerRefMethods,
  ViewRef,
}
