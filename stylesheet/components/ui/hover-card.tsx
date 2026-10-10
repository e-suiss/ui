import * as React from "react"
import { Platform, StyleSheet } from "react-native"
import { Keyframe, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as HoverCardPrimitive from "@/components/primitives/hover-card"
import type { Side } from "@/components/primitives/types"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

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
const styles = StyleSheet.create({
  positioner: { zIndex: 50 },
  content: {
    zIndex: 50,
    width: 288,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    padding: 16,
    ...shadow.lg,
  },
})

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

function HoverCardContent({
  style,
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
  const { colors, isDark } = useTheme()
  return (
    <HoverCardPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <HoverCardPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          style={styles.positioner}
        >
          <TextStyleContext.Provider
            value={{ ...fontSize.base, color: colors.label }}
          >
            <HoverCardPrimitive.Popup
              render={
                <AnimatedView entering={ENTERING[side]} exiting={EXITING} />
              }
              style={(state) => [
                styles.content,
                {
                  borderColor: withAlpha(colors.label, isDark ? 0.1 : 0.05),
                  backgroundColor: colors.surfaceRaised,
                },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            />
          </TextStyleContext.Provider>
        </HoverCardPrimitive.Positioner>
      </FullWindowOverlay>
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
