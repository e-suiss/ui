import { CaretDownIcon } from "phosphor-react-native"
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native"
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
import { fontSize, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 21.6,
    borderWidth: 1,
  },
  item: { borderBottomWidth: 1, overflow: "hidden" },
  trigger: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 24,
    borderWidth: 1,
    borderColor: "transparent",
    padding: 16,
  },
  disabled: { opacity: 0.5 },
  icon: { flexShrink: 0 },
  content: { overflow: "hidden", paddingHorizontal: 16 },
  contentInner: { paddingTop: 0, paddingBottom: 16 },
})

function Accordion({
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  const { colors } = useTheme()
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        style={(state) => [
          styles.root,
          { borderColor: colors.border },
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
        { borderColor: colors.border },
        state.open && { backgroundColor: colors.mutedSubtle },
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
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { colors } = useTheme()
  const { open } = AccordionPrimitive.useItemContext()

  const progress = useDerivedValue(() =>
    open ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })
  )
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }))

  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize.sm,
        textAlign: "left",
        fontWeight: "500",
        color: colors.foreground,
      }}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          style={(state) => [
            styles.trigger,
            state.disabled && styles.disabled,
            typeof style === "function" ? style(state) : style,
          ]}
          {...props}
        >
          {children}
          <Animated.View style={chevronStyle}>
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
      value={{ ...fontSize.sm, color: colors.foreground }}
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

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
