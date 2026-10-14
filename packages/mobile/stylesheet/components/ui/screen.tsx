import * as React from "react"
import { StatusBar, StyleSheet, View, type ViewProps } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { useTheme } from "@/components/ui/theme"

type ScreenEdge = "top" | "right" | "bottom" | "left"

const ALL_EDGES: readonly ScreenEdge[] = ["top", "right", "bottom", "left"]

const ScreenContext = React.createContext<{
  edges: readonly ScreenEdge[]
} | null>(null)

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, gap: 16, padding: 16 },
  scrollContent: { flexGrow: 1, gap: 16, padding: 16 },
})

function Screen({
  edges = ALL_EDGES,
  variant = "default",
  style,
  children,
  ...props
}: ViewProps & {
  edges?: readonly ScreenEdge[]
  variant?: "default" | "secondary"
}) {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const context = React.useMemo(() => ({ edges }), [edges])
  return (
    <ScreenContext.Provider value={context}>
      <View
        style={[
          styles.root,
          {
            backgroundColor:
              variant === "secondary"
                ? colors.surfaceSecondary
                : colors.surface,
            paddingTop: edges.includes("top") ? insets.top : 0,
            paddingRight: edges.includes("right") ? insets.right : 0,
            paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
            paddingLeft: edges.includes("left") ? insets.left : 0,
          },
          style,
        ]}
        {...props}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        {children}
      </View>
    </ScreenContext.Provider>
  )
}

function ScreenContent({
  scrollable = false,
  style,
  children,
  ...props
}: ViewProps & {
  scrollable?: boolean
}) {
  if (scrollable) {
    return (
      <KeyboardScrollView
        contentContainerStyle={[styles.scrollContent, style]}
        {...props}
      >
        {children}
      </KeyboardScrollView>
    )
  }
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  )
}

export type { ScreenEdge }
export { Screen, ScreenContent, ScreenContext }
