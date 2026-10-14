import * as React from "react"
import { type LayoutRectangle, View } from "react-native"
import type { REASONS } from "./event-details"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  Orientation,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ToggleGroupChangeEventReason =
  | typeof REASONS.itemPress
  | typeof REASONS.none

type ToggleGroupChangeEventDetails =
  BaseUIChangeEventDetails<ToggleGroupChangeEventReason>

interface ToggleGroupState {
  disabled: boolean
  multiple: boolean
  orientation: Orientation
}

type ToggleGroupProps = BaseUIComponentProps<typeof View, ToggleGroupState> & {
  value?: readonly string[] | undefined
  defaultValue?: readonly string[] | undefined
  onValueChange?:
    | ((
        groupValue: string[],
        eventDetails: ToggleGroupChangeEventDetails
      ) => void)
    | undefined
  disabled?: boolean | undefined
  multiple?: boolean | undefined
  orientation?: Orientation | undefined
}

interface ToggleGroupItemRecord {
  layout: LayoutRectangle
  disabled: boolean
}

type ToggleGroupIndicatorProps = BaseUIComponentProps<
  typeof View,
  ToggleGroupState
>

interface ToggleGroupContextValue {
  value: readonly string[]
  disabled: boolean
  multiple: boolean
  orientation: Orientation
  state: ToggleGroupState
  items: ReadonlyMap<string, ToggleGroupItemRecord>
  setItem: (itemValue: string, record: ToggleGroupItemRecord | null) => void
  setItemPressed: (
    itemValue: string,
    pressed: boolean,
    eventDetails: ToggleGroupChangeEventDetails
  ) => boolean
}

const EMPTY_VALUE: readonly string[] = []

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
)

function useToggleGroupContext() {
  return React.useContext(ToggleGroupContext)
}

function isSameRecord(
  a: ToggleGroupItemRecord | undefined,
  b: ToggleGroupItemRecord
) {
  return (
    a !== undefined &&
    a.disabled === b.disabled &&
    a.layout.x === b.layout.x &&
    a.layout.y === b.layout.y &&
    a.layout.width === b.layout.width &&
    a.layout.height === b.layout.height
  )
}

function ToggleGroup({
  value: valueProp,
  defaultValue = EMPTY_VALUE,
  onValueChange,
  disabled = false,
  multiple = false,
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: ToggleGroupProps) {
  const [value, setValue] = useControllableState<
    readonly string[],
    ToggleGroupChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as
      | ((
          value: readonly string[],
          eventDetails: ToggleGroupChangeEventDetails
        ) => void)
      | undefined,
  })

  const setItemPressed = React.useCallback(
    (
      itemValue: string,
      pressed: boolean,
      eventDetails: ToggleGroupChangeEventDetails
    ) =>
      setValue((current) => {
        if (pressed) {
          if (current.includes(itemValue)) return current
          return multiple ? [...current, itemValue] : [itemValue]
        }
        if (!current.includes(itemValue)) return current
        return current.filter((entry) => entry !== itemValue)
      }, eventDetails),
    [multiple, setValue]
  )

  const [items, setItems] = React.useState<
    ReadonlyMap<string, ToggleGroupItemRecord>
  >(() => new Map())

  const setItem = React.useCallback(
    (itemValue: string, record: ToggleGroupItemRecord | null) => {
      setItems((current) => {
        if (record === null) {
          if (!current.has(itemValue)) return current
          const next = new Map(current)
          next.delete(itemValue)
          return next
        }
        if (isSameRecord(current.get(itemValue), record)) return current
        const next = new Map(current)
        next.set(itemValue, record)
        return next
      })
    },
    []
  )

  const state = React.useMemo<ToggleGroupState>(
    () => ({ disabled, multiple, orientation }),
    [disabled, multiple, orientation]
  )

  const context = React.useMemo<ToggleGroupContextValue>(
    () => ({
      value,
      disabled,
      multiple,
      orientation,
      state,
      items,
      setItem,
      setItemPressed,
    }),
    [
      value,
      disabled,
      multiple,
      orientation,
      state,
      items,
      setItem,
      setItemPressed,
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
        role: multiple ? "group" : "radiogroup",
        accessibilityState: { disabled },
      },
      elementProps,
    ],
  })

  return (
    <ToggleGroupContext.Provider value={context}>
      {element}
    </ToggleGroupContext.Provider>
  )
}

ToggleGroup.displayName = "ToggleGroup"

function ToggleGroupIndicator({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ToggleGroupIndicatorProps) {
  const group = useToggleGroupContext()
  if (!group) {
    throw new Error("ToggleGroupIndicator must be rendered inside ToggleGroup")
  }
  const selected =
    !group.multiple && group.value.length === 1 ? group.value[0] : undefined
  const record = selected === undefined ? undefined : group.items.get(selected)
  const layout = record && !record.disabled ? record.layout : undefined

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: group.state,
    ref,
    enabled: layout !== undefined,
    props: [
      {
        pointerEvents: "none",
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
        style: layout
          ? {
              position: "absolute",
              left: layout.x,
              top: layout.y,
              width: layout.width,
              height: layout.height,
            }
          : undefined,
      },
      elementProps,
    ],
  })
}

ToggleGroupIndicator.displayName = "ToggleGroupIndicator"

export type {
  ToggleGroupChangeEventDetails,
  ToggleGroupChangeEventReason,
  ToggleGroupContextValue,
  ToggleGroupIndicatorProps,
  ToggleGroupItemRecord,
  ToggleGroupProps,
  ToggleGroupState,
}
export { ToggleGroup, ToggleGroupIndicator, useToggleGroupContext }
