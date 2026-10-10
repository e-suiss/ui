import * as TooltipPrimitive from "@rn-primitives/tooltip"
import { cn } from "cn"
import * as React from "react"
import { Platform, StyleSheet } from "react-native"
import {
  FadeInDown,
  FadeInUp,
  FadeOut,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextClassContext } from "@/components/ui/text"

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function TooltipContent({
  className,
  sideOffset = 4,
  portalHost,
  side = "top",
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  portalHost?: string
}) {
  return (
    <TooltipPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <TooltipPrimitive.Overlay style={StyleSheet.absoluteFill} asChild>
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
            as="Pressable"
          >
            <TextClassContext.Provider value="text-xs text-background">
              <TooltipPrimitive.Content
                sideOffset={sideOffset}
                className={cn(
                  "z-50 max-w-xs flex-row items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5",
                  className
                )}
                side={side}
                {...props}
              />
            </TextClassContext.Provider>
          </AnimatedView>
        </TooltipPrimitive.Overlay>
      </FullWindowOverlay>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipTrigger }
