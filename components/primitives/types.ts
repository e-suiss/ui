import type * as React from "react"
import type {
  GestureResponderEvent,
  HostInstance,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from "react-native"

type Side = "top" | "bottom" | "left" | "right"
type Align = "start" | "center" | "end"
type Orientation = "horizontal" | "vertical"

type ComponentRenderFn<Props, State> = (
  props: Props,
  state: State
) => React.ReactElement<unknown>

type RenderProp<Props, State> =
  | React.ReactElement
  | ComponentRenderFn<Props, State>

type ClassNameProp<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined

type StyleOf<ElementType extends React.ElementType> =
  React.ComponentProps<ElementType> extends { style?: infer S }
    ? Exclude<S, (...args: never[]) => unknown>
    : StyleProp<ViewStyle>

type StyleValue<Style, State> =
  | Style
  | ((state: State) => Style | undefined)
  | undefined

type HostProps<ElementType extends React.ElementType> = Omit<
  React.ComponentPropsWithRef<ElementType>,
  "className" | "style"
> & {
  className?: string | undefined
  style?: StyleOf<ElementType> | undefined
}

type BaseUIComponentProps<
  ElementType extends React.ElementType,
  State,
  RenderFunctionProps = HostProps<ElementType>,
> = Omit<React.ComponentPropsWithRef<ElementType>, "className" | "style"> & {
  className?: ClassNameProp<State>
  style?: StyleValue<StyleOf<ElementType>, State>
  render?: RenderProp<RenderFunctionProps, State> | undefined
}

type ChangeEvent =
  | GestureResponderEvent
  | NativeSyntheticEvent<unknown>
  | undefined

type BaseUIChangeEventDetails<
  Reason extends string = string,
  CustomProperties extends object = Record<never, never>,
> = {
  reason: Reason
  event: ChangeEvent
  cancel: () => void
  readonly isCanceled: boolean
  trigger: HostInstance | undefined
} & CustomProperties

type BaseUIGenericEventDetails<
  Reason extends string = string,
  CustomProperties extends object = Record<never, never>,
> = {
  reason: Reason
  event: ChangeEvent
} & CustomProperties

type Padding =
  | number
  | {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }

interface OffsetFunctionData {
  side: Side
  align: Align
  anchor: { width: number; height: number }
  positioner: { width: number; height: number }
}

type OffsetFunction = (data: OffsetFunctionData) => number

interface SideFlipMode {
  side?: "flip" | "none" | undefined
  align?: "flip" | "shift" | "none" | undefined
  fallbackAxisSide?: "start" | "end" | "none" | undefined
}

interface SideShiftMode {
  side?: "shift" | "none" | undefined
  align?: "shift" | "none" | undefined
  fallbackAxisSide?: "start" | "end" | "none" | undefined
}

type CollisionAvoidance = SideFlipMode | SideShiftMode

interface AnchorRect {
  pageX: number
  pageY: number
  width: number
  height: number
}

interface MeasurableAnchor {
  measure: (
    callback: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => void
  ) => void
}

type PositionerAnchor =
  | AnchorRect
  | React.RefObject<MeasurableAnchor | null>
  | null
  | undefined

interface PositionerParameters {
  anchor?: PositionerAnchor
  side?: Side | undefined
  align?: Align | undefined
  sideOffset?: number | OffsetFunction | undefined
  alignOffset?: number | OffsetFunction | undefined
  collisionPadding?: Padding | undefined
  collisionAvoidance?: CollisionAvoidance | undefined
  arrowPadding?: number | undefined
}

interface PortalParameters {
  keepMounted?: boolean | undefined
  hostName?: string | undefined
}

export type {
  Align,
  AnchorRect,
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  BaseUIGenericEventDetails,
  ChangeEvent,
  ClassNameProp,
  CollisionAvoidance,
  ComponentRenderFn,
  HostProps,
  MeasurableAnchor,
  OffsetFunction,
  OffsetFunctionData,
  Orientation,
  Padding,
  PortalParameters,
  PositionerAnchor,
  PositionerParameters,
  RenderProp,
  Side,
  SideFlipMode,
  SideShiftMode,
  StyleOf,
  StyleValue,
}
