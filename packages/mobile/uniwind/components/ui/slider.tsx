import { cn } from "cn"
import * as SliderPrimitive from "@/components/primitives/slider"
import { resolveClassName } from "@/components/primitives/use-render"

const THUMB_SIZE = {
  vertical: { active: "h-9 w-5", idle: "h-8 w-5" },
  horizontal: { active: "h-5 w-9", idle: "h-5 w-8" },
}

function thumbIndexes(
  value: SliderPrimitive.SliderValue | undefined,
  defaultValue: SliderPrimitive.SliderValue | undefined
) {
  const source = Array.isArray(value) ? value : defaultValue
  const count = Array.isArray(source) ? source.length : 1
  return Array.from({ length: count }, (_, index) => index)
}

function Slider<
  Value extends SliderPrimitive.SliderValue = SliderPrimitive.SliderValue,
>({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  accessibilityLabel,
  ...props
}: SliderPrimitive.RootProps<Value>) {
  return (
    <SliderPrimitive.Root
      className={(state) =>
        cn(
          state.orientation === "vertical" ? "h-full" : "w-full",
          resolveClassName(className, state)
        )
      }
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        className={(state) =>
          cn(
            "relative items-center justify-center",
            state.orientation === "vertical"
              ? "h-full min-h-40 w-8 flex-col"
              : "h-8 w-full flex-row"
          )
        }
      >
        <SliderPrimitive.Track
          className={(state) =>
            cn(
              "relative grow overflow-hidden rounded-full",
              state.disabled ? "bg-control-disabled" : "bg-label-quaternary",
              state.orientation === "vertical" ? "h-full w-1" : "h-1 w-full"
            )
          }
        >
          <SliderPrimitive.Indicator
            className={(state) =>
              state.disabled ? "bg-accent-disabled" : "bg-accent"
            }
          />
        </SliderPrimitive.Track>
        {thumbIndexes(value, defaultValue).map((index) => (
          <SliderPrimitive.Thumb
            key={index}
            index={index}
            getAccessibilityLabel={
              accessibilityLabel ? () => accessibilityLabel : undefined
            }
            className={(state) =>
              cn(
                "rounded-full border border-label/10 bg-surface shadow-md dark:bg-label",
                THUMB_SIZE[
                  state.orientation === "vertical" ? "vertical" : "horizontal"
                ][state.dragging && state.active ? "active" : "idle"],
                state.disabled && "shadow-none"
              )
            }
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
