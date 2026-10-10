import { CaretDownIcon } from "phosphor-react-native"
import {
  Pressable,
  type PressableStateCallbackType,
  StyleSheet,
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
import { fontSize, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 21.6,
    borderWidth: 1,
  },
  item: { borderBottomWidth: 1 },
  itemInner: { overflow: "hidden" },
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
  children,
  style,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, "asChild">) {
  const { colors } = useTheme()
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        {...(props as AccordionPrimitive.RootProps)}
        style={[styles.root, { borderColor: colors.border }, style]}
        asChild
      >
        <Animated.View layout={LinearTransition.duration(200)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  )
}

function AccordionItem({
  children,
  style,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const { colors } = useTheme()
  const { value: rootValue } = AccordionPrimitive.useRootContext()
  const isOpen = Array.isArray(rootValue)
    ? rootValue.includes(value)
    : rootValue === value
  return (
    <AccordionPrimitive.Item
      style={[
        styles.item,
        { borderColor: colors.border },
        isOpen && { backgroundColor: colors.mutedSubtle },
        style,
      ]}
      value={value}
      asChild
      {...props}
    >
      <Animated.View
        style={styles.itemInner}
        layout={LinearTransition.duration(200)}
      >
        {children}
      </Animated.View>
    </AccordionPrimitive.Item>
  )
}

function AccordionTrigger({
  style,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  const { disabled: rootDisabled } = AccordionPrimitive.useRootContext()
  const { isExpanded, disabled: itemDisabled } =
    AccordionPrimitive.useItemContext()
  const isDisabled = props.disabled || rootDisabled || itemDisabled

  const progress = useDerivedValue(() =>
    isExpanded
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 200 })
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
        <AccordionPrimitive.Trigger {...props} asChild>
          <Pressable
            style={(state: PressableStateCallbackType) => [
              styles.trigger,
              isDisabled && styles.disabled,
              typeof style === "function" ? style(state) : style,
            ]}
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
          </Pressable>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextStyleContext.Provider>
  )
}

function AccordionContent({
  style,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.sm, color: colors.foreground }}
    >
      <AccordionPrimitive.Content style={styles.content} {...props}>
        <Animated.View
          exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
          style={[styles.contentInner, style]}
        >
          {children}
        </Animated.View>
      </AccordionPrimitive.Content>
    </TextStyleContext.Provider>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
