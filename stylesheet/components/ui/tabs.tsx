import { StyleSheet } from "react-native"
import * as TabsPrimitive from "@/components/primitives/tabs"
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
  return (
    <TabsPrimitive.Root
      style={(state) => [
        styles.root,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function TabsList({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { colors } = useTheme()
  return (
    <TabsPrimitive.List
      style={(state) => [
        styles.list,
        { backgroundColor: colors.muted },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function TabsTrigger({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
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
      <TabsPrimitive.Tab
        style={(state) => [
          styles.trigger,
          state.disabled && styles.disabled,
          state.active && {
            backgroundColor: isDark ? colors.inputSubtle : colors.background,
          },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function TabsContent(props: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
