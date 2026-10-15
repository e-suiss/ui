import { CaretDownIcon } from "phosphor-react-native"
import * as React from "react"
import {
  type GestureResponderEvent,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native"
import Animated, {
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated"
import * as AccordionPrimitive from "@/components/primitives/accordion"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type AccordionVariant = "default" | "filled"

const styles = StyleSheet.create({
  root: { width: "100%", flexDirection: "column" },
  filled: { overflow: "hidden", borderRadius: radius["2xl"] },
  item: { marginStart: 16, overflow: "hidden" },
  itemSeparated: { borderTopWidth: 1 },
  header: { flexDirection: "row" },
  trigger: {
    minHeight: 44,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    paddingVertical: 11,
    paddingEnd: 16,
  },
  icon: { flexShrink: 0 },
  content: { overflow: "hidden" },
  contentInner: { gap: 16, paddingEnd: 40, paddingBottom: 12 },
})

function Accordion({
  style,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
  variant?: AccordionVariant
}) {
  const { colors } = useTheme()
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        style={(state) => [
          styles.root,
          variant === "filled" && [
            styles.filled,
            { backgroundColor: colors.muted },
          ],
          typeof style === "function" ? style(state) : style,
        ]}
        render={<Animated.View layout={LinearTransition.duration(200)} />}
        {...props}
      />
    </LayoutAnimationConfig>
  )
}

function AccordionItem({
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const { colors } = useTheme()
  return (
    <AccordionPrimitive.Item
      style={(state) => [
        styles.item,
        state.index > 0 && [
          styles.itemSeparated,
          { borderColor: colors.border },
        ],
        typeof style === "function" ? style(state) : style,
      ]}
      render={<Animated.View layout={LinearTransition.duration(200)} />}
      {...props}
    />
  )
}

function AccordionTrigger({
  style,
  children,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { colors } = useTheme()
  const { open, disabled } = AccordionPrimitive.useItemContext()
  const [pressed, setPressed] = React.useState(false)

  const progress = useDerivedValue(() =>
    open ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })
  )
  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }))

  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize.base,
        flexShrink: 1,
        textAlign: "left",
        color: colors.foreground,
        textDecorationLine: pressed && !disabled ? "underline" : "none",
      }}
    >
      <AccordionPrimitive.Header style={styles.header}>
        <AccordionPrimitive.Trigger
          style={(state) => [
            styles.trigger,
            disabled && { opacity: 0.5 },
            typeof style === "function" ? style(state) : style,
          ]}
          onPressIn={(event: GestureResponderEvent) => {
            setPressed(true)
            onPressIn?.(event)
          }}
          onPressOut={(event: GestureResponderEvent) => {
            setPressed(false)
            onPressOut?.(event)
          }}
          {...props}
        >
          {children}
          <Animated.View style={caretStyle}>
            <Icon
              as={CaretDownIcon}
              size={16}
              color={colors.mutedForeground}
              style={styles.icon}
            />
          </Animated.View>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextStyleContext.Provider>
  )
}

function AccordionContent({
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Panel>, "style"> & {
  style?: StyleProp<ViewStyle>
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.sm, color: colors.mutedForeground }}
    >
      <AccordionPrimitive.Panel style={styles.content} {...props}>
        <Animated.View
          exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
          style={[styles.contentInner, style]}
        >
          {children}
        </Animated.View>
      </AccordionPrimitive.Panel>
    </TextStyleContext.Provider>
  )
}

export type { AccordionVariant }
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
