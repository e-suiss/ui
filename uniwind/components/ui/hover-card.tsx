import { cn } from "cn"
import * as React from "react"
import { Platform } from "react-native"
import { Keyframe, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as HoverCardPrimitive from "@/components/primitives/hover-card"
import type { Side } from "@/components/primitives/types"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextClassContext } from "@/components/ui/text"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

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
function HoverCardContent({
  className,
  align = "center",
  alignOffset = 4,
  side = "bottom",
  sideOffset = 4,
  portalHost,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof HoverCardPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    portalHost?: string
  }) {
  return (
    <HoverCardPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <HoverCardPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          className="z-50"
        >
          <TextClassContext.Provider value="text-base text-label">
            <HoverCardPrimitive.Popup
              render={
                <AnimatedView entering={ENTERING[side]} exiting={EXITING} />
              }
              className={(state) =>
                cn(
                  "z-50 w-72 rounded-2xl border border-label/5 bg-surface-raised p-4 shadow-lg dark:border-label/10",
                  resolveClassName(className, state)
                )
              }
              {...props}
            />
          </TextClassContext.Provider>
        </HoverCardPrimitive.Positioner>
      </FullWindowOverlay>
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
