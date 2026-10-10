import * as React from "react"
import { Platform, StyleSheet, type ViewStyle } from "react-native"
import {
  FadeInDown,
  FadeInUp,
  FadeOut,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as TooltipPrimitive from "@/components/primitives/tooltip"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

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
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
  },
})

const ARROW_SIDE_STYLE: Record<TooltipPrimitive.ArrowState["side"], ViewStyle> =
  {
    top: { bottom: -4 },
    bottom: { top: -4 },
    left: { right: -4 },
    right: { left: -4 },
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
            value={{ ...fontSize.xs, color: colors.background }}
          >
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
              style={(state) => [
                styles.content,
                { backgroundColor: colors.foreground },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            >
              {children}
              <TooltipPrimitive.Arrow
                style={(state) => [
                  styles.arrow,
                  { backgroundColor: colors.foreground },
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
