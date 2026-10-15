import * as React from "react"
import { StyleSheet } from "react-native"
import Animated, {
  Easing,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated"
import * as TabsPrimitive from "@/components/primitives/tabs"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

type TabsListVariant = "default" | "line"

const TabsListContext = React.createContext<TabsListVariant>("default")

const INDICATOR_TRANSITION = LinearTransition.duration(300)
  .easing(Easing.bezier(0.32, 0.72, 0, 1))
  .reduceMotion(ReduceMotion.System)

const styles = StyleSheet.create({
  root: { gap: 8 },
  rootHorizontal: { flexDirection: "column" },
  rootVertical: { flexDirection: "row" },
  list: {
    position: "relative",
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    gap: 4,
  },
  listDefault: { borderRadius: radius.xl, padding: 4, height: 44 },
  listLine: { padding: 2, height: 41, paddingBottom: 7 },
  listVertical: {
    height: "auto",
    flexDirection: "column",
    alignItems: "stretch",
  },
  indicatorDefault: { borderRadius: radius.md, ...shadow.sm },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  triggerHorizontal: { height: "100%", flexGrow: 1, flexShrink: 1 },
  triggerVertical: { height: 36, width: "100%", justifyContent: "flex-start" },
  content: { flexGrow: 1 },
})

function Tabs({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      style={(state) => [
        styles.root,
        state.orientation === "vertical"
          ? styles.rootVertical
          : styles.rootHorizontal,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function TabsIndicator({ variant }: { variant: TabsListVariant }) {
  const { colors, isDark } = useTheme()
  return (
    <TabsPrimitive.Indicator
      style={(state) => {
        if (variant !== "line") {
          return [
            styles.indicatorDefault,
            {
              backgroundColor: isDark ? colors.border : colors.card,
            },
          ]
        }
        const position = state.activeTabPosition
        const size = state.activeTabSize
        if (!position || !size) return { backgroundColor: colors.foreground }
        return [
          { backgroundColor: colors.foreground },
          state.orientation === "vertical"
            ? { left: position.left + size.width + 2, width: 2 }
            : { top: position.top + size.height + 3, height: 2 },
        ]
      }}
      render={<Animated.View layout={INDICATOR_TRANSITION} />}
    />
  )
}

function TabsList({
  style,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsListVariant
}) {
  const { colors } = useTheme()
  return (
    <TabsListContext.Provider value={variant}>
      <TabsPrimitive.List
        style={(state) => [
          styles.list,
          variant === "line"
            ? styles.listLine
            : [styles.listDefault, { backgroundColor: colors.secondary }],
          state.orientation === "vertical" && styles.listVertical,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        <TabsIndicator variant={variant} />
        {children}
      </TabsPrimitive.List>
    </TabsListContext.Provider>
  )
}

function TabsTrigger({
  style,
  disabled,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  const { value, orientation } = TabsPrimitive.useRootContext()
  const { colors } = useTheme()
  const active = value === props.value
  const color = active ? colors.foreground : colors.mutedForeground
  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize.sm,
        color,
      }}
    >
      <TabsPrimitive.Tab
        disabled={disabled}
        style={(state) => [
          styles.trigger,
          orientation === "vertical"
            ? styles.triggerVertical
            : styles.triggerHorizontal,
          disabled && { opacity: 0.5 },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function TabsContent({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      style={(state) => [
        styles.content,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export type { TabsListVariant }
export { Tabs, TabsContent, TabsList, TabsTrigger }
