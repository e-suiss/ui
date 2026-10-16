import * as React from "react"
import { useEffectEvent } from "./hooks"
import type { BaseUIChangeEventDetails } from "./types"

interface CancelableDetails {
  readonly isCanceled: boolean
}

interface UseControllableStateParameters<
  T,
  Details extends CancelableDetails = BaseUIChangeEventDetails,
> {
  value?: T | undefined
  defaultValue: T
  onChange?: ((value: T, details: Details) => void) | undefined
}

type ControllableStateSetter<T, Details> = (
  next: T | ((previous: T) => T),
  details: Details
) => boolean

function useControllableState<
  T,
  Details extends CancelableDetails = BaseUIChangeEventDetails,
>({
  value: valueProp,
  defaultValue,
  onChange,
}: UseControllableStateParameters<T, Details>): readonly [
  T,
  ControllableStateSetter<T, Details>,
] {
  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled
  const valueRef = React.useRef(value)
  valueRef.current = value

  const handleChange = useEffectEvent((next: T, details: Details) => {
    onChange?.(next, details)
  })

  const setValue = React.useCallback<ControllableStateSetter<T, Details>>(
    (action, details) => {
      const current = valueRef.current
      const next =
        typeof action === "function"
          ? (action as (previous: T) => T)(current)
          : action
      if (Object.is(next, current)) return false
      handleChange(next, details)
      if (details.isCanceled) return false
      if (!isControlled) {
        valueRef.current = next
        setUncontrolled(next)
      }
      return true
    },
    [isControlled, handleChange]
  )

  return [value, setValue] as const
}

export type {
  CancelableDetails,
  ControllableStateSetter,
  UseControllableStateParameters,
}
export { useControllableState }
