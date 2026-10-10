import * as PopoverPrimitive from "@rn-primitives/popover"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  content: {
    zIndex: 50,
    width: 288,
    flexDirection: "column",
    gap: 16,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    padding: 16,
    ...shadow.lg,
  },
})

function PopoverContent({
  style,
  align = "center",
  sideOffset = 4,
  portalHost,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  portalHost?: string
}) {
  const { colors } = useTheme()
  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PopoverPrimitive.Overlay style={StyleSheet.absoluteFill} asChild>
          <AnimatedView
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextStyleContext.Provider
              value={{ ...fontSize.sm, color: colors.popoverForeground }}
            >
              <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                style={StyleSheet.flatten<ViewStyle>([
                  styles.content,
                  {
                    borderColor: colors.outline,
                    backgroundColor: colors.popover,
                  },
                  style as StyleProp<ViewStyle>,
                ])}
                {...props}
              />
            </TextStyleContext.Provider>
          </AnimatedView>
        </PopoverPrimitive.Overlay>
      </FullWindowOverlay>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
