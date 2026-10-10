import * as React from "react"
import { Platform, StyleSheet } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as HoverCardPrimitive from "@/components/primitives/hover-card"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  positioner: { zIndex: 50 },
  content: {
    zIndex: 50,
    width: 288,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    padding: 16,
    ...shadow.lg,
  },
})

function HoverCardContent({
  style,
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
  const { colors } = useTheme()
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
            value={{ ...fontSize.sm, color: colors.popoverForeground }}
          >
            <HoverCardPrimitive.Popup
              render={
                <AnimatedView
                  entering={FadeIn.reduceMotion(ReduceMotion.System)}
                  exiting={FadeOut.reduceMotion(ReduceMotion.System)}
                />
              }
              style={(state) => [
                styles.content,
                {
                  borderColor: colors.outline,
                  backgroundColor: colors.popover,
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
