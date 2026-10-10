import * as TabsPrimitive from "@rn-primitives/tabs"
import { type PressableStateCallbackType, StyleSheet } from "react-native"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: { flexDirection: "column", gap: 8 },
  list: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    padding: 4,
    alignSelf: "flex-start",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  disabled: { opacity: 0.5 },
})

function Tabs({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root style={[styles.root, style]} {...props} />
}

function TabsList({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { colors } = useTheme()
  return (
    <TabsPrimitive.List
      style={[styles.list, { backgroundColor: colors.muted }, style]}
      {...props}
    />
  )
}

function TabsTrigger({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value } = TabsPrimitive.useRootContext()
  const { colors, isDark } = useTheme()
  const isActive = value === props.value
  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize.sm,
        fontWeight: "500",
        color: isActive
          ? colors.foreground
          : isDark
            ? colors.mutedForeground
            : colors.foregroundSubtle,
      }}
    >
      <TabsPrimitive.Trigger
        style={(state: PressableStateCallbackType) => [
          styles.trigger,
          props.disabled && styles.disabled,
          isActive && {
            backgroundColor: isDark ? colors.inputSubtle : colors.background,
          },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function TabsContent(
  props: React.ComponentProps<typeof TabsPrimitive.Content>
) {
  return <TabsPrimitive.Content {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
