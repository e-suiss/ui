"use client"

import { Slider as SliderPrimitive } from "radix-ui"
import type * as React from "react"
import { cn } from "@/lib/utils"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root>

function thumbCount(
  value: SliderProps["value"],
  defaultValue: SliderProps["defaultValue"]
) {
  if (Array.isArray(value)) return value.length
  if (Array.isArray(defaultValue)) return defaultValue.length
  return 1
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  disabled,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      className={cn(
        "cn-slider relative flex w-full touch-none items-center select-none data-vertical:h-full data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="cn-slider-track relative grow overflow-hidden"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="cn-slider-range absolute select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount(value, defaultValue) }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-disabled={disabled || undefined}
          className="cn-slider-thumb block shrink-0 select-none"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
