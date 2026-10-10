import { cn } from "cn"
import * as React from "react"
import { Platform } from "react-native"
import { Keyframe, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as TooltipPrimitive from "@/components/primitives/tooltip"
import type { Side } from "@/components/primitives/types"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextClassContext } from "@/components/ui/text"

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

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
const ARROW_SIDE_CLASS: Record<Side, string> = {
  top: "-bottom-[3px]",
  bottom: "-top-[3px]",
  left: "-right-[3px]",
  right: "-left-[3px]",
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  portalHost,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof TooltipPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    portalHost?: string
  }) {
  return (
    <TooltipPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <TooltipPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          className="z-50"
        >
          <TextClassContext.Provider value="text-xs text-surface">
            <TooltipPrimitive.Popup
              render={
                <AnimatedView entering={ENTERING[side]} exiting={EXITING} />
              }
              className={(state) =>
                cn(
                  "z-50 max-w-xs flex-row items-center gap-1.5 rounded-xl bg-label px-3 py-1.5",
                  resolveClassName(className, state)
                )
              }
              {...props}
            >
              {children}
              <TooltipPrimitive.Arrow
                className={(state) =>
                  cn(
                    "size-2.5 rounded-xs bg-label",
                    ARROW_SIDE_CLASS[state.side]
                  )
                }
                style={{ transform: [{ rotate: "45deg" }] }}
              />
            </TooltipPrimitive.Popup>
          </TextClassContext.Provider>
        </TooltipPrimitive.Positioner>
      </FullWindowOverlay>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipTrigger }
