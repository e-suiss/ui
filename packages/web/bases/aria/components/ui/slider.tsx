import {
  SliderFill,
  Slider as SliderPrimitive,
  type SliderProps as SliderPrimitiveProps,
  SliderThumb,
  SliderTrack,
} from "react-aria-components"
import { cn } from "@/lib/utils"

function Slider<T extends number | number[]>({
  className,
  orientation = "horizontal",
  minValue = 0,
  maxValue = 100,
  ...props
}: Omit<SliderPrimitiveProps<T>, "className" | "children"> & {
  className?: string
}) {
  const horizontal = orientation === "horizontal" || undefined
  const vertical = orientation === "vertical" || undefined

  return (
    <SliderPrimitive
      className={cn("cn-slider data-vertical:h-full", className)}
      data-slot="slider"
      data-horizontal={horizontal}
      data-vertical={vertical}
      orientation={orientation}
      minValue={minValue}
      maxValue={maxValue}
      {...props}
    >
      {({ state, isDisabled }) => (
        <SliderTrack
          data-horizontal={horizontal}
          data-vertical={vertical}
          className="relative flex w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50"
        >
          <div
            data-slot="slider-track"
            data-horizontal={horizontal}
            data-vertical={vertical}
            className="cn-slider-track relative grow overflow-hidden select-none"
          >
            <SliderFill
              data-slot="slider-range"
              data-horizontal={horizontal}
              data-vertical={vertical}
              className="cn-slider-range select-none data-horizontal:h-full data-vertical:w-full"
            />
          </div>
          {state.values.map((_, index) => (
            <SliderThumb
              data-slot="slider-thumb"
              key={index}
              index={index}
              data-horizontal={horizontal}
              data-vertical={vertical}
              isDisabled={isDisabled}
              className="cn-slider-thumb block shrink-0 select-none"
            />
          ))}
        </SliderTrack>
      )}
    </SliderPrimitive>
  )
}

export { Slider }
