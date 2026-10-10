import * as React from "react"
import { View } from "react-native"
import type { REASONS } from "./event-details"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  Orientation,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ChangeEventReason = typeof REASONS.itemPress | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

interface RootState {
  disabled: boolean
  multiple: boolean
  orientation: Orientation
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  value?: readonly string[] | undefined
  defaultValue?: readonly string[] | undefined
  onValueChange?:
    | ((groupValue: string[], eventDetails: ChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
  multiple?: boolean | undefined
  orientation?: Orientation | undefined
}

interface ToggleGroupContextValue {
  value: readonly string[]
  disabled: boolean
  multiple: boolean
  orientation: Orientation
  setItemPressed: (
    itemValue: string,
    pressed: boolean,
    eventDetails: ChangeEventDetails
  ) => boolean
}

const EMPTY_VALUE: readonly string[] = []

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
)

function useToggleGroupContext() {
  return React.useContext(ToggleGroupContext)
}

function Root({
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
}: RootProps) {
  const [value, setValue] = useControllableState<
    readonly string[],
    ChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as
      | ((value: readonly string[], eventDetails: ChangeEventDetails) => void)
      | undefined,
  })

  const setItemPressed = React.useCallback(
    (itemValue: string, pressed: boolean, eventDetails: ChangeEventDetails) =>
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

  const state = React.useMemo<RootState>(
    () => ({ disabled, multiple, orientation }),
    [disabled, multiple, orientation]
  )

  const context = React.useMemo<ToggleGroupContextValue>(
    () => ({ value, disabled, multiple, orientation, setItemPressed }),
    [value, disabled, multiple, orientation, setItemPressed]
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

Root.displayName = "ToggleGroup"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  RootProps,
  RootState,
  ToggleGroupContextValue,
}
export { Root, useToggleGroupContext }
