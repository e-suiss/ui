"use client"

import * as React from "react"
import {
  Label as LabelPrimitive,
  type LabelProps as LabelPrimitiveProps,
  ProgressBar as ProgressPrimitive,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components"
import { cn } from "@/lib/utils"

type ProgressContextValue = {
  percentage?: number
  isIndeterminate: boolean
  valueText?: string
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null)

function useProgress() {
  const context = React.useContext(ProgressContext)
  if (!context) {
    throw new Error("useProgress must be used within a <Progress />")
  }

  return context
}

function Progress({
  className,
  children,
  ...props
}: Omit<ProgressPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <ProgressPrimitive
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <ProgressContext.Provider
          value={{ percentage, valueText, isIndeterminate }}
        >
          {children}
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </ProgressContext.Provider>
      )}
    </ProgressPrimitive>
  )
}

function ProgressTrack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { percentage, isIndeterminate } = useProgress()

  return (
    <div
      data-slot="progress-indicator"
      className={cn("h-full bg-primary transition-[width]", className)}
      style={{
        width: isIndeterminate ? undefined : `${percentage ?? 0}%`,
        ...style,
      }}
      {...props}
    />
  )
}

function ProgressLabel({
  className,
  ...props
}: Omit<LabelPrimitiveProps, "className"> & { className?: string }) {
  return (
    <LabelPrimitive
      className={cn("text-sm", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  children?: (value: string) => React.ReactNode
}) {
  const { valueText } = useProgress()

  return (
    <span
      className={cn(
        "ms-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    >
      {children && valueText != null ? children(valueText) : valueText}
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
