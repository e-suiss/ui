import { cn } from "cn"
import * as React from "react"
import { Platform } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as HoverCardPrimitive from "@/components/primitives/hover-card"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextClassContext } from "@/components/ui/text"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function HoverCardContent({
  className,
  align = "center",
  alignOffset = 0,
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
          <TextClassContext.Provider value="text-sm text-popover-foreground">
            <HoverCardPrimitive.Popup
              render={
                <AnimatedView
                  entering={FadeIn.reduceMotion(ReduceMotion.System)}
                  exiting={FadeOut.reduceMotion(ReduceMotion.System)}
                />
              }
              className={(state) =>
                cn(
                  "z-50 w-72 rounded-3xl border border-foreground-5 bg-popover p-4 shadow-lg dark:border-foreground-10",
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
