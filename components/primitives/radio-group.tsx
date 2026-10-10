import * as React from "react"
import { View } from "react-native"
import type { REASONS } from "./event-details"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type RadioGroupChangeEventReason =
  | typeof REASONS.itemPress
  | typeof REASONS.none

type RadioGroupChangeEventDetails =
  BaseUIChangeEventDetails<RadioGroupChangeEventReason>

interface RadioGroupState {
  disabled: boolean
  readOnly: boolean
  required: boolean
}

type RadioGroupProps<Value = unknown> = Omit<
  BaseUIComponentProps<typeof View, RadioGroupState>,
  "value"
> & {
  value?: Value | undefined
  defaultValue?: Value | undefined
  onValueChange?:
    | ((value: Value, eventDetails: RadioGroupChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
}

interface RadioGroupContextValue {
  value: unknown
  disabled: boolean
  readOnly: boolean
  required: boolean
  setValue: (
    value: unknown,
    eventDetails: RadioGroupChangeEventDetails
  ) => boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
)

function useRadioGroupContext() {
  return React.useContext(RadioGroupContext)
}

function RadioGroup<Value = unknown>({
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
}: RadioGroupProps<Value>) {
  const [value, setValue] = useControllableState<
    unknown,
    RadioGroupChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as
      | ((value: unknown, eventDetails: RadioGroupChangeEventDetails) => void)
      | undefined,
  })

  const state = React.useMemo<RadioGroupState>(
    () => ({ disabled, readOnly, required }),
    [disabled, readOnly, required]
  )

  const context = React.useMemo<RadioGroupContextValue>(
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

  return (
    <RadioGroupContext.Provider value={context}>
      {element}
    </RadioGroupContext.Provider>
  )
}

RadioGroup.displayName = "RadioGroup"

export type {
  RadioGroupChangeEventDetails,
  RadioGroupChangeEventReason,
  RadioGroupContextValue,
  RadioGroupProps,
  RadioGroupState,
}
export { RadioGroup, RadioGroupContext, useRadioGroupContext }
