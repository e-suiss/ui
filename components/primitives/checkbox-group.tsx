import * as React from "react"
import { View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ChangeEventReason = typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

interface RootState {
  disabled: boolean
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  value?: string[] | undefined
  defaultValue?: string[] | undefined
  onValueChange?:
    | ((value: string[], eventDetails: ChangeEventDetails) => void)
    | undefined
  allValues?: string[] | undefined
  disabled?: boolean | undefined
}

interface RootContextValue {
  state: RootState
  value: string[]
  allValues: string[]
  setValue: (value: string[], eventDetails: ChangeEventDetails) => void
  registerDisabled: (value: string, disabled: boolean) => () => void
  disabledStatesRef: React.RefObject<Map<string, boolean>>
}

interface UseCheckboxGroupItemParameters {
  value?: string | undefined
  parent?: boolean | undefined
  disabled: boolean
}

interface CheckboxGroupItem {
  checked: boolean
  indeterminate: boolean
  disabled: boolean
  onCheckedChange: (
    checked: boolean,
    eventDetails: BaseUIChangeEventDetails<string>
  ) => void
}

const RootContext = React.createContext<RootContextValue | null>(null)

const EMPTY_VALUES: string[] = []

function useCheckboxGroupContext() {
  return React.useContext(RootContext)
}

function useCheckboxGroupItem({
  value,
  parent = false,
  disabled,
}: UseCheckboxGroupItemParameters): CheckboxGroupItem | null {
  const group = React.useContext(RootContext)
  const registerDisabled = group?.registerDisabled

  React.useEffect(() => {
    if (!registerDisabled || parent || value === undefined) return
    return registerDisabled(value, disabled)
  }, [registerDisabled, parent, value, disabled])

  if (!group || (!parent && value === undefined)) return null

  const groupDisabled = disabled || group.state.disabled

  const toDetails = (eventDetails: BaseUIChangeEventDetails<string>) =>
    createChangeEventDetails(
      REASONS.none,
      eventDetails.event,
      eventDetails.trigger
    )

  if (parent) {
    const checkedCount = group.allValues.filter((item) =>
      group.value.includes(item)
    ).length
    const allChecked =
      group.allValues.length > 0 && checkedCount === group.allValues.length
    return {
      checked: allChecked,
      indeterminate: checkedCount > 0 && !allChecked,
      disabled: groupDisabled,
      onCheckedChange: (checked, eventDetails) => {
        const disabledStates = group.disabledStatesRef.current
        const next = checked
          ? [
              ...group.value,
              ...group.allValues.filter(
                (item) =>
                  !group.value.includes(item) && !disabledStates.get(item)
              ),
            ]
          : group.value.filter((item) => disabledStates.get(item))
        group.setValue(next, toDetails(eventDetails))
      },
    }
  }

  const itemValue = value as string
  return {
    checked: group.value.includes(itemValue),
    indeterminate: false,
    disabled: groupDisabled,
    onCheckedChange: (checked, eventDetails) => {
      const next = checked
        ? [...group.value.filter((item) => item !== itemValue), itemValue]
        : group.value.filter((item) => item !== itemValue)
      group.setValue(next, toDetails(eventDetails))
    },
  }
}

function Root({
  value: valueProp,
  defaultValue = EMPTY_VALUES,
  onValueChange,
  allValues = EMPTY_VALUES,
  disabled = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const [value, setValue] = useControllableState<string[], ChangeEventDetails>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  })
  const disabledStatesRef = React.useRef(new Map<string, boolean>())

  const registerDisabled = React.useCallback(
    (item: string, itemDisabled: boolean) => {
      disabledStatesRef.current.set(item, itemDisabled)
      return () => {
        disabledStatesRef.current.delete(item)
      }
    },
    []
  )

  const updateValue = React.useCallback(
    (next: string[], eventDetails: ChangeEventDetails) => {
      setValue(next, eventDetails)
    },
    [setValue]
  )

  const state = React.useMemo<RootState>(() => ({ disabled }), [disabled])

  const context = React.useMemo<RootContextValue>(
    () => ({
      state,
      value,
      allValues,
      setValue: updateValue,
      registerDisabled,
      disabledStatesRef,
    }),
    [state, value, allValues, updateValue, registerDisabled]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "group", accessibilityState: { disabled } }, elementProps],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "CheckboxGroup"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  CheckboxGroupItem,
  RootContextValue,
  RootProps,
  RootState,
  UseCheckboxGroupItemParameters,
}
export { Root, useCheckboxGroupContext, useCheckboxGroupItem }
