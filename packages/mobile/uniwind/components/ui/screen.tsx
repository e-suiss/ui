import { cn } from "cn"
import * as React from "react"
import { StatusBar, useColorScheme, View, type ViewProps } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"

type ScreenEdge = "top" | "right" | "bottom" | "left"

const ALL_EDGES: readonly ScreenEdge[] = ["top", "right", "bottom", "left"]

const ScreenContext = React.createContext<{
  edges: readonly ScreenEdge[]
} | null>(null)

function Screen({
  edges = ALL_EDGES,
  variant = "default",
  className,
  style,
  children,
  ...props
}: ViewProps & {
  edges?: readonly ScreenEdge[]
  variant?: "default" | "secondary"
}) {
  const insets = useSafeAreaInsets()
  const scheme = useColorScheme()
  const context = React.useMemo(() => ({ edges }), [edges])
  return (
    <ScreenContext.Provider value={context}>
      <View
        className={cn(
          "flex-1",
          variant === "secondary" ? "bg-muted" : "bg-background",
          className
        )}
        style={[
          {
            paddingTop: edges.includes("top") ? insets.top : 0,
            paddingRight: edges.includes("right") ? insets.right : 0,
            paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
            paddingLeft: edges.includes("left") ? insets.left : 0,
          },
          style,
        ]}
        {...props}
      >
        <StatusBar
          barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        />
        {children}
      </View>
    </ScreenContext.Provider>
  )
}

function ScreenContent({
  scrollable = false,
  className,
  children,
  ...props
}: ViewProps & {
  scrollable?: boolean
}) {
  if (scrollable) {
    return (
      <KeyboardScrollView
        contentContainerClassName={cn("grow gap-4 p-4", className)}
        {...props}
      >
        {children}
      </KeyboardScrollView>
    )
  }
  return (
    <View className={cn("flex-1 gap-4 p-4", className)} {...props}>
      {children}
    </View>
  )
}

export type { ScreenEdge }
export { Screen, ScreenContent, ScreenContext }
