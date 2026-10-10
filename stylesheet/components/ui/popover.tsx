import * as React from "react"
import { Platform, StyleSheet, View, type ViewProps } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PopoverPrimitive from "@/components/primitives/popover"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  positioner: { zIndex: 50 },
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
  header: { display: "flex", flexDirection: "column", gap: 4 },
  title: { ...fontSize.base, fontWeight: "500" },
  description: { ...fontSize.sm },
})

function PopoverContent({
  style,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  portalHost,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    portalHost?: string
  }) {
  const { colors } = useTheme()
  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PopoverPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          style={styles.positioner}
        >
          <TextStyleContext.Provider
            value={{ ...fontSize.sm, color: colors.popoverForeground }}
          >
            <PopoverPrimitive.Popup
              render={
                <AnimatedView
                  entering={FadeIn.duration(200).reduceMotion(
                    ReduceMotion.System
                  )}
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
        </PopoverPrimitive.Positioner>
      </FullWindowOverlay>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />
}

function PopoverTitle({
  style,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Title>) {
  const { colors } = useTheme()
  return (
    <PopoverPrimitive.Title
      style={(state) => [
        styles.title,
        { color: colors.popoverForeground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function PopoverDescription({
  style,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Description>) {
  const { colors } = useTheme()
  return (
    <PopoverPrimitive.Description
      style={(state) => [
        styles.description,
        { color: colors.mutedForeground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
