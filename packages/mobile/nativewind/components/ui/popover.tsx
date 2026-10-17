import { cn } from "cn"
import * as React from "react"
import { Platform, View, type ViewProps } from "react-native"
import { Keyframe, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PopoverPrimitive from "@/components/primitives/popover"
import type { Side } from "@/components/primitives/types"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextClassContext } from "@/components/ui/text"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const ENTER_FROM: Record<Side, { translateX: number; translateY: number }> = {
  top: { translateX: 0, translateY: 8 },
  bottom: { translateX: 0, translateY: -8 },
  left: { translateX: 8, translateY: 0 },
  right: { translateX: -8, translateY: 0 },
}

function createEntering(side: Side) {
  const from = ENTER_FROM[side]
  return new Keyframe({
    0: {
      opacity: 0,
      transform: [
        { translateX: from.translateX },
        { translateY: from.translateY },
        { scale: 0.95 },
      ],
    },
    100: {
      opacity: 1,
      transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
    },
  })
    .duration(150)
    .reduceMotion(ReduceMotion.System)
}

const ENTERING: Record<Side, ReturnType<typeof createEntering>> = {
  top: createEntering("top"),
  bottom: createEntering("bottom"),
  left: createEntering("left"),
  right: createEntering("right"),
}

const EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.95 }] },
})
  .duration(100)
  .reduceMotion(ReduceMotion.System)
function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  portalHost,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    portalHost?: string
  }) {
  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PopoverPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          className="z-50"
        >
          <TextClassContext.Provider value="text-base text-foreground">
            <PopoverPrimitive.Popup
              render={
                <AnimatedView entering={ENTERING[side]} exiting={EXITING} />
              }
              className={(state) =>
                cn(
                  "z-50 w-72 flex-col gap-4 rounded-popover border border-foreground-5 bg-popover p-popover shadow-popover dark:border-foreground-10",
                  resolveClassName(className, state)
                )
              }
              {...props}
            />
          </TextClassContext.Provider>
        </PopoverPrimitive.Positioner>
      </FullWindowOverlay>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-sm text-foreground">
      <View className={cn("flex-col gap-1", className)} {...props} />
    </TextClassContext.Provider>
  )
}

function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Title>) {
  return (
    <PopoverPrimitive.Title
      className={(state) =>
        cn(
          "text-base font-title text-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Description>) {
  return (
    <PopoverPrimitive.Description
      className={(state) =>
        cn("text-sm text-muted-foreground", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
