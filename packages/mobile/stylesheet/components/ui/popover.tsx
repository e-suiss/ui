import * as React from "react"
import { Platform, StyleSheet, View, type ViewProps } from "react-native"
import { Keyframe, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PopoverPrimitive from "@/components/primitives/popover"
import type { Side } from "@/components/primitives/types"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, metrics, useTheme } from "@/components/ui/theme"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

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
    flexDirection: "column",
    gap: 16,
    borderRadius: metrics.radius.popover,
    borderWidth: 1,
    padding: metrics.padding.popover,
    ...metrics.shadow.popover,
  },
  header: { flexDirection: "column", gap: 4 },
  title: { ...fontSize.base, fontWeight: metrics.fontWeight.title },
  description: { ...fontSize.sm },
})

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

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
  const { colors, isDark } = useTheme()
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
            value={{ ...fontSize.base, color: colors.foreground }}
          >
            <PopoverPrimitive.Popup
              render={
                <AnimatedView entering={ENTERING[side]} exiting={EXITING} />
              }
              style={(state) => [
                styles.content,
                {
                  borderColor: withAlpha(
                    colors.foreground,
                    isDark ? 0.1 : 0.05
                  ),
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
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.sm, color: colors.foreground }}
    >
      <View style={[styles.header, style]} {...props} />
    </TextStyleContext.Provider>
  )
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
        { color: colors.foreground },
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
