"use client"

import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"
import { cn } from "@/lib/utils"

const ProgressContext = React.createContext<{
  value: number | null
  max: number
  setLabelId?: (id: string | undefined) => void
}>({ value: null, max: 100 })

function Progress({
  className,
  children,
  value = null,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const [labelId, setLabelId] = React.useState<string>()

  return (
    <ProgressContext.Provider value={{ value, max, setLabelId }}>
      <ProgressPrimitive.Root
        value={value}
        max={max}
        aria-labelledby={labelId}
        data-slot="progress"
        className={cn("cn-progress flex", className)}
        {...props}
      >
        {children}
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </ProgressPrimitive.Root>
    </ProgressContext.Provider>
  )
}

function ProgressTrack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("cn-progress-track", className)}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Indicator>) {
  const { value, max } = React.useContext(ProgressContext)

  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("cn-progress-indicator", className)}
      style={{
        ...(value !== null && { width: `${(value / max) * 100}%` }),
        ...style,
      }}
      {...props}
    />
  )
}

function ProgressLabel({
  className,
  id,
  ...props
}: React.ComponentProps<"span">) {
  const generatedId = React.useId()
  const labelId = id ?? generatedId
  const { setLabelId } = React.useContext(ProgressContext)

  React.useLayoutEffect(() => {
    setLabelId?.(labelId)
    return () => setLabelId?.(undefined)
  }, [labelId, setLabelId])

  return (
    <span
      id={labelId}
      className={cn("cn-progress-label", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { value, max } = React.useContext(ProgressContext)

  return (
    <span
      aria-hidden
      className={cn("cn-progress-value", className)}
      data-slot="progress-value"
      {...props}
    >
      {children ??
        (value === null
          ? null
          : new Intl.NumberFormat(undefined, { style: "percent" }).format(
              value / max
            ))}
    </span>
  )
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
}
