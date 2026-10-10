import * as React from "react"
import { Platform, StyleSheet, type ViewStyle } from "react-native"
import { Keyframe, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as TooltipPrimitive from "@/components/primitives/tooltip"
import type { Side } from "@/components/primitives/types"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

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
const styles = StyleSheet.create({
  positioner: { zIndex: 50 },
  content: {
    zIndex: 50,
    maxWidth: 320,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  arrow: {
    width: 10,
    height: 10,
    borderRadius: radius.xs,
    transform: [{ rotate: "45deg" }],
  },
})

const ARROW_SIDE_STYLE: Record<Side, ViewStyle> = {
  top: { bottom: -3 },
  bottom: { top: -3 },
  left: { right: -3 },
  right: { left: -3 },
}

function TooltipContent({
  style,
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
  const { colors } = useTheme()
  return (
    <TooltipPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <TooltipPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          style={styles.positioner}
        >
          <TextStyleContext.Provider
            value={{ ...fontSize.xs, color: colors.surface }}
          >
            <TooltipPrimitive.Popup
              render={
                <AnimatedView entering={ENTERING[side]} exiting={EXITING} />
              }
              style={(state) => [
                styles.content,
                { backgroundColor: colors.label },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            >
              {children}
              <TooltipPrimitive.Arrow
                style={(state) => [
                  styles.arrow,
                  { backgroundColor: colors.label },
                  ARROW_SIDE_STYLE[state.side],
                ]}
              />
            </TooltipPrimitive.Popup>
          </TextStyleContext.Provider>
        </TooltipPrimitive.Positioner>
      </FullWindowOverlay>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipTrigger }
