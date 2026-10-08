import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

function thumbCount(
  value: SliderPrimitive.Root.Props["value"],
  defaultValue: SliderPrimitive.Root.Props["defaultValue"]
) {
  if (Array.isArray(value)) return value.length
  if (Array.isArray(defaultValue)) return defaultValue.length
  return 2
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:**:data-[slot=slider-range]:bg-accent-disabled data-disabled:**:data-[slot=slider-track]:bg-control-disabled data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-label-quaternary select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-accent select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount(value, defaultValue) }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            className="block shrink-0 rounded-full bg-surface shadow-md ring-1 ring-label/10 transition-[width,height,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] select-none not-dark:bg-clip-padding has-focus-visible:focus-ring data-horizontal:h-5 data-horizontal:w-8 data-horizontal:active:w-9 data-horizontal:data-dragging:w-9 data-vertical:h-8 data-vertical:w-5 data-vertical:active:h-9 data-vertical:data-dragging:h-9 data-disabled:pointer-events-none data-disabled:shadow-none dark:bg-label"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
