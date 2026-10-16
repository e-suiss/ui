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
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
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
            className="relative grow overflow-hidden rounded-full bg-border select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
          >
            <SliderFill
              data-slot="slider-range"
              data-horizontal={horizontal}
              data-vertical={vertical}
              className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
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
              className="block shrink-0 rounded-full bg-background shadow-md data-horizontal:top-1/2 data-vertical:left-1/2 ring-1 ring-foreground/10 transition-[width,height,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] select-none not-dark:bg-clip-padding has-focus-visible:ring-3 has-focus-visible:ring-ring/50 data-horizontal:h-5 data-horizontal:w-8 data-horizontal:active:w-9 data-horizontal:data-dragging:w-9 data-vertical:h-8 data-vertical:w-5 data-vertical:active:h-9 data-vertical:data-dragging:h-9 data-disabled:pointer-events-none data-disabled:shadow-none dark:bg-foreground"
            />
          ))}
        </SliderTrack>
      )}
    </SliderPrimitive>
  )
}

export { Slider }
