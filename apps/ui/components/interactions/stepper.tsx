"use client"

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { MinusIcon, PlusIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

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
  onValueChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled = false,
  className,
  ...props
}: Omit<
  NumberFieldPrimitive.Root.Props,
  "value" | "defaultValue" | "onValueChange" | "step"
> & {
  step?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolledValue
  const valueRef = React.useRef(value)
  valueRef.current = value

  const setValue = React.useCallback(
    (next: number) => {
      valueRef.current = next
      if (valueProp === undefined) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const canChange = React.useCallback(
    (direction: 1 | -1) =>
      !disabled &&
      (direction === 1 ? valueRef.current < max : valueRef.current > min),
    [disabled, min, max]
  )

  const change = React.useCallback(
    (direction: 1 | -1) => {
      if (!canChange(direction)) return false
      const precision = Math.max(0, -Math.floor(Math.log10(step)))
      const next = Number(
        (valueRef.current + direction * step).toFixed(precision)
      )
      setValue(Math.min(Math.max(next, min), max))
      return true
    },
    [canChange, step, min, max, setValue]
  )

  return (
    <StepperContext.Provider value={{ canChange, change }}>
      <NumberFieldPrimitive.Root
        data-slot="stepper"
        value={value}
        onValueChange={(next) => {
          if (next !== null) setValue(next)
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn("flex items-center gap-3", className)}
        {...props}
      />
    </StepperContext.Provider>
  )
}

function StepperInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="stepper-input"
      className={cn(
        "h-8 w-16 min-w-0 rounded-md bg-transparent px-1 text-end text-base tabular-nums outline-none focus-visible:focus-ring data-disabled:text-label-quaternary",
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
        "inline-flex h-8 shrink-0 items-center rounded-lg bg-control",
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
        "relative flex h-full w-12 touch-manipulation items-center justify-center text-label outline-none select-none first:rounded-s-lg last:rounded-e-lg after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] focus-visible:focus-ring active:bg-control-pressed disabled:text-label-quaternary [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
      {children ?? <MinusIcon weight="bold" />}
    </StepperButton>
  )
}

function StepperIncrement({
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <StepperButton direction={1} aria-label="Increase" {...props}>
      {children ?? <PlusIcon weight="bold" />}
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
      className={cn("h-4.5 w-px shrink-0 bg-separator", className)}
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
