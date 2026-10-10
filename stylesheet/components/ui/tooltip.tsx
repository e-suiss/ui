import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native"
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
})

function TooltipContent({
  style,
  sideOffset = 4,
  portalHost,
  side = "top",
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  portalHost?: string
}) {
  const { colors } = useTheme()
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
            <TextStyleContext.Provider
              value={{ ...fontSize.xs, color: colors.background }}
            >
              <TooltipPrimitive.Content
                sideOffset={sideOffset}
                style={StyleSheet.flatten<ViewStyle>([
                  styles.content,
                  { backgroundColor: colors.foreground },
                  style as StyleProp<ViewStyle>,
                ])}
                side={side}
                {...props}
              />
            </TextStyleContext.Provider>
          </AnimatedView>
        </TooltipPrimitive.Overlay>
      </FullWindowOverlay>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipTrigger }
