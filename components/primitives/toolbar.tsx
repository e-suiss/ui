import * as React from "react"
import { Pressable, TextInput, View } from "react-native"
import type { BaseUIComponentProps, Orientation } from "./types"
import { useRender } from "./use-render"

interface ToolbarRootContextValue {
  disabled: boolean
  orientation: Orientation
}

const ToolbarRootContext = React.createContext<ToolbarRootContextValue | null>(
  null
)

function useToolbarRootContext(componentName = "Toolbar part") {
  const context = React.useContext(ToolbarRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Toolbar.Root`)
  }
  return context
}

const ToolbarGroupContext = React.createContext<{ disabled: boolean } | null>(
  null
)

interface RootState {
  disabled: boolean
  orientation: Orientation
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  disabled?: boolean | undefined
  orientation?: Orientation | undefined
}

function Root({
  disabled = false,
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const state = React.useMemo<RootState>(
    () => ({ disabled, orientation }),
    [disabled, orientation]
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
        role: "toolbar",
        accessibilityRole: "toolbar",
        accessibilityState: { disabled },
      },
      elementProps,
    ],
  })

  return (
    <ToolbarRootContext.Provider value={state}>
      {element}
    </ToolbarRootContext.Provider>
  )
}

Root.displayName = "ToolbarRoot"

type GroupState = RootState

type GroupProps = BaseUIComponentProps<typeof View, GroupState> & {
  disabled?: boolean | undefined
}

function Group({
  disabled: disabledProp = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: GroupProps) {
  const root = useToolbarRootContext("Toolbar.Group")
  const disabled = root.disabled || disabledProp
  const state = React.useMemo<GroupState>(
    () => ({ disabled, orientation: root.orientation }),
    [disabled, root.orientation]
  )
  const context = React.useMemo(() => ({ disabled }), [disabled])

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "group", accessibilityState: { disabled } }, elementProps],
  })

  return (
    <ToolbarGroupContext.Provider value={context}>
      {element}
    </ToolbarGroupContext.Provider>
  )
}

Group.displayName = "ToolbarGroup"

function useItemDisabled(componentName: string, disabledProp: boolean) {
  const root = useToolbarRootContext(componentName)
  const group = React.useContext(ToolbarGroupContext)
  return {
    orientation: root.orientation,
    disabled: root.disabled || !!group?.disabled || disabledProp,
  }
}

type ButtonState = RootState

type ButtonProps = BaseUIComponentProps<typeof Pressable, ButtonState>

function Button({
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ButtonProps) {
  const { disabled, orientation } = useItemDisabled(
    "Toolbar.Button",
    !!disabledProp
  )
  const state = React.useMemo<ButtonState>(
    () => ({ disabled, orientation }),
    [disabled, orientation]
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
        accessibilityState: { disabled },
        disabled: disabled || undefined,
      },
      elementProps,
    ],
  })
}

Button.displayName = "ToolbarButton"

type InputState = RootState

type InputProps = BaseUIComponentProps<typeof TextInput, InputState> & {
  disabled?: boolean | undefined
}

function Input({
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: InputProps) {
  const { disabled, orientation } = useItemDisabled(
    "Toolbar.Input",
    !!disabledProp
  )
  const state = React.useMemo<InputState>(
    () => ({ disabled, orientation }),
    [disabled, orientation]
  )

  return useRender({
    defaultComponent: TextInput,
    render,
    className,
    style,
    state,
    ref,
    props: [
      { accessibilityState: { disabled }, editable: !disabled },
      elementProps,
    ],
  })
}

Input.displayName = "ToolbarInput"

interface SeparatorState {
  orientation: Orientation
}

type SeparatorProps = BaseUIComponentProps<typeof View, SeparatorState> & {
  orientation?: Orientation | undefined
}

function Separator({
  orientation: orientationProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: SeparatorProps) {
  const root = useToolbarRootContext("Toolbar.Separator")
  const orientation =
    orientationProp ??
    (root.orientation === "horizontal" ? "vertical" : "horizontal")
  const state = React.useMemo<SeparatorState>(
    () => ({ orientation }),
    [orientation]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "separator" }, elementProps],
  })
}

Separator.displayName = "ToolbarSeparator"

export type {
  ButtonProps,
  ButtonState,
  GroupProps,
  GroupState,
  InputProps,
  InputState,
  RootProps,
  RootState,
  SeparatorProps,
  SeparatorState,
  ToolbarRootContextValue,
}
export { Button, Group, Input, Root, Separator, useToolbarRootContext }
