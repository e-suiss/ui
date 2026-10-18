"use client"

import * as React from "react"
import {
  Input as InputPrimitive,
  NumberField as NumberFieldPrimitive,
  type NumberFieldProps as NumberFieldPrimitiveProps,
} from "react-aria-components"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

type StepperContextProps = {
  canChange: (direction: 1 | -1) => boolean
  change: (direction: 1 | -1) => boolean
}

const StepperContext = React.createContext<StepperContextProps | null>(null)

function useStepper() {
  const context = React.useContext(StepperContext)

  if (!context) {
    throw new Error("useStepper must be used within a <Stepper />")
  }

  return context
}

const START_DELAY = 400
const FIRST_TICK = 180
const MIN_TICK = 35
const ACCELERATION = 0.86

function Stepper({
  value: valueProp,
  defaultValue = 0,
  onValueChange: onChange,
  min: minValue = Number.NEGATIVE_INFINITY,
  max: maxValue = Number.POSITIVE_INFINITY,
  step = 1,
  disabled: isDisabled = false,
  format,
  className,
  ...props
}: Omit<
  NumberFieldPrimitiveProps,
  | "value"
  | "defaultValue"
  | "onChange"
  | "minValue"
  | "maxValue"
  | "isDisabled"
  | "formatOptions"
  | "className"
> & {
  className?: string
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  format?: Intl.NumberFormatOptions
}) {
  const generatedId = React.useId()
  const inputId = props.id ?? generatedId
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolledValue
  const valueRef = React.useRef(value)
  React.useLayoutEffect(() => {
    valueRef.current = value
  })

  const setValue = React.useCallback(
    (next: number) => {
      valueRef.current = next
      if (valueProp === undefined) setUncontrolledValue(next)
      onChange?.(next)
    },
    [valueProp, onChange]
  )

  const canChange = React.useCallback(
    (direction: 1 | -1) =>
      !isDisabled &&
      (direction === 1
        ? valueRef.current < maxValue
        : valueRef.current > minValue),
    [isDisabled, minValue, maxValue]
  )

  const change = React.useCallback(
    (direction: 1 | -1) => {
      if (!canChange(direction)) return false
      const precision = Math.max(0, -Math.floor(Math.log10(step)))
      const next = Number(
        (valueRef.current + direction * step).toFixed(precision)
      )
      setValue(Math.min(Math.max(next, minValue), maxValue))
      return true
    },
    [canChange, step, minValue, maxValue, setValue]
  )

  return (
    <StepperContext.Provider value={{ canChange, change }}>
      <NumberFieldPrimitive
        data-slot="stepper"
        value={value}
        onChange={(next) => {
          if (!Number.isNaN(next)) setValue(next)
        }}
        minValue={Number.isFinite(minValue) ? minValue : undefined}
        maxValue={Number.isFinite(maxValue) ? maxValue : undefined}
        step={step}
        isDisabled={isDisabled}
        formatOptions={format}
        className={cn("flex items-center gap-3", className)}
        id={inputId}
        aria-labelledby={props["aria-label"] ? undefined : inputId}
        {...props}
      />
    </StepperContext.Provider>
  )
}

function StepperInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof InputPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <InputPrimitive
      data-slot="stepper-input"
      className={cn(
        "h-8 w-16 min-w-0 rounded-md bg-transparent px-1 text-end text-base tabular-nums outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function StepperGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="stepper-group"
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-[3px] rounded-lg bg-secondary p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function StepperButton({
  direction,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "onClick"> & { direction: 1 | -1 }) {
  const { canChange, change } = useStepper()
  const timerRef = React.useRef(0)

  const stop = React.useCallback(() => {
    window.clearTimeout(timerRef.current)
  }, [])

  React.useEffect(() => stop, [stop])

  const repeat = (count: number) => {
    timerRef.current = window.setTimeout(
      () => {
        if (change(direction)) repeat(count + 1)
      },
      count === 0
        ? START_DELAY
        : Math.max(MIN_TICK, FIRST_TICK * ACCELERATION ** count)
    )
  }

  return (
    <button
      type="button"
      data-slot={direction === 1 ? "stepper-increment" : "stepper-decrement"}
      disabled={!canChange(direction)}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        stop()
        if (change(direction)) repeat(0)
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onClick={(event) => {
        if (event.detail === 0) change(direction)
      }}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        "relative flex h-full w-9 touch-manipulation items-center justify-center rounded-md bg-card text-card-foreground shadow-sm outline-none select-none after:absolute after:inset-x-0 after:-inset-y-2.25 after:content-[''] focus-visible:ring-3 focus-visible:ring-ring/50 active:shadow-none disabled:shadow-none dark:bg-border dark:shadow-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function StepperDecrement({
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <StepperButton direction={-1} aria-label="Decrease" {...props}>
      {children ?? (
        <IconPlaceholder
          lucide="MinusIcon"
          tabler="IconMinus"
          hugeicons="MinusSignIcon"
          phosphor="MinusIcon"
          remixicon="RiSubtractLine"
        />
      )}
    </StepperButton>
  )
}

function StepperIncrement({
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <StepperButton direction={1} aria-label="Increase" {...props}>
      {children ?? (
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
        />
      )}
    </StepperButton>
  )
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="stepper-separator"
      className={cn("h-4.5 w-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

export {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
}
