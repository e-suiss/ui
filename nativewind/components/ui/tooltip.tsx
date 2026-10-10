import { cn } from "cn"
import * as React from "react"
import { Platform } from "react-native"
import {
  FadeInDown,
  FadeInUp,
  FadeOut,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as TooltipPrimitive from "@/components/primitives/tooltip"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextClassContext } from "@/components/ui/text"

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const ARROW_SIDE_CLASS = {
  top: "-bottom-1",
  bottom: "-top-1",
  left: "-right-1",
  right: "-left-1",
} as const

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
          <TextClassContext.Provider value="text-xs text-background">
            <TooltipPrimitive.Popup
              render={
                <AnimatedView
                  entering={
                    side === "top"
                      ? FadeInDown.withInitialValues({
                          transform: [{ translateY: 3 }],
                        })
                          .duration(150)
                          .reduceMotion(ReduceMotion.System)
                      : FadeInUp.withInitialValues({
                          transform: [{ translateY: -5 }],
                        }).reduceMotion(ReduceMotion.System)
                  }
                  exiting={FadeOut.reduceMotion(ReduceMotion.System)}
                />
              }
              className={(state) =>
                cn(
                  "z-50 max-w-xs flex-row items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5",
                  resolveClassName(className, state)
                )
              }
              {...props}
            >
              {children}
              <TooltipPrimitive.Arrow
                className={(state) =>
                  cn(
                    "size-2.5 rounded-[2px] bg-foreground",
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
