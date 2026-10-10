import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ChangeEventReason = typeof REASONS.itemPress | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

interface RootState {
  disabled: boolean
  readOnly: boolean
  required: boolean
}

interface ItemState extends RootState {
  checked: boolean
}

type IndicatorState = ItemState

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?:
    | ((value: string, eventDetails: ChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
}

type ItemProps = Omit<
  BaseUIComponentProps<typeof Pressable, ItemState>,
  "children"
> & {
  children?: React.ReactNode
  value: string
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
}

type IndicatorProps = BaseUIComponentProps<typeof View, IndicatorState> & {
  keepMounted?: boolean | undefined
}

interface RootContextValue {
  value: string | undefined
  disabled: boolean
  readOnly: boolean
  required: boolean
  setValue: (value: string, eventDetails: ChangeEventDetails) => boolean
}

interface ItemContextValue {
  state: ItemState
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Radio parts must be rendered inside RadioGroup.Root")
  }
  return context
}

const ItemContext = React.createContext<ItemContextValue | null>(null)

function useItemContext() {
  const context = React.useContext(ItemContext)
  if (!context) {
    throw new Error("Radio.Indicator must be rendered inside Radio.Root")
  }
  return context
}

function Root({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  required = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const [value, setValue] = useControllableState<
    string | undefined,
    ChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as
      | ((value: string | undefined, eventDetails: ChangeEventDetails) => void)
      | undefined,
  })

  const state = React.useMemo<RootState>(
    () => ({ disabled, readOnly, required }),
    [disabled, readOnly, required]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({ value, disabled, readOnly, required, setValue }),
    [value, disabled, readOnly, required, setValue]
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
        accessibilityRole: "radiogroup",
        accessibilityState: { disabled },
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "RadioGroup"

function Item({
  value: itemValue,
  disabled: disabledProp = false,
  readOnly: readOnlyProp = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemProps) {
  const root = useRootContext()
  const disabled = root.disabled || disabledProp
  const readOnly = root.readOnly || readOnlyProp
  const checked = root.value === itemValue
  const itemRef = React.useRef<View>(null)

  const state = React.useMemo<ItemState>(
    () => ({ checked, disabled, readOnly, required: root.required }),
    [checked, disabled, readOnly, root.required]
  )

  const context = React.useMemo<ItemContextValue>(() => ({ state }), [state])

  const onPress = (event: GestureResponderEvent) => {
    if (disabled || readOnly || checked) return
    root.setValue(
      itemValue,
      createChangeEventDetails(REASONS.itemPress, event, itemRef.current)
    )
  }

  const element = useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: [ref, itemRef],
    props: [
      {
        accessibilityRole: "radio",
        accessibilityState: { checked, disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })

  return <ItemContext.Provider value={context}>{element}</ItemContext.Provider>
}

Item.displayName = "RadioRoot"

function Indicator({
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps) {
  const { state } = useItemContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: state.checked || keepMounted,
    props: [
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Indicator.displayName = "RadioIndicator"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  IndicatorProps,
  IndicatorState,
  ItemContextValue,
  ItemProps,
  ItemState,
  RootContextValue,
  RootProps,
  RootState,
}
export { Indicator, Item, Root, useItemContext, useRootContext }
