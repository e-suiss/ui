import { cn } from "cn"
import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHaptics } from "@/components/primitives/haptics"
import * as TabsPrimitive from "@/components/primitives/tabs"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { ScreenContext } from "@/components/ui/screen"
import { Text, TextClassContext } from "@/components/ui/text"

type TabBarBadgeValue = number | string | boolean

function badgeText(badge: TabBarBadgeValue | undefined) {
  if (badge === undefined || badge === false || badge === true) return undefined
  if (typeof badge === "number") {
    if (badge <= 0) return undefined
    return badge > 99 ? "99+" : String(badge)
  }
  return badge.length > 0 ? badge : undefined
}

function TabBar({
  onValueChange,
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const haptics = useHaptics()
  const insets = useSafeAreaInsets()
  const screen = React.useContext(ScreenContext)
  const consumed = screen?.edges.includes("bottom") ? insets.bottom : 0
  const paddingBottom = Math.max(12, insets.bottom - consumed - 8)
  return (
    <TabsPrimitive.Root
      className={(state) => cn("px-4 pt-2", resolveClassName(className, state))}
      style={(state) => [
        { paddingBottom },
        typeof style === "function" ? style(state) : style,
      ]}
      onValueChange={(value, details) => {
        onValueChange?.(value, details)
        if (!details.isCanceled) haptics.selection()
      }}
      {...props}
    />
  )
}

function TabBarList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={(state) =>
        cn(
          "flex-row rounded-full border border-label/5 bg-surface-raised p-1 shadow-lg dark:border-label/10",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function TabBarBadge({ badge }: { badge: TabBarBadgeValue }) {
  const text = badgeText(badge)
  if (badge === true) {
    return (
      <View className="absolute -top-0.5 -end-1 size-2.5 rounded-full border-2 border-surface-raised bg-danger" />
    )
  }
  if (text === undefined) return null
  return (
    <View className="absolute -top-1.5 -end-3 h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-surface-raised bg-danger px-1">
      <Text className="text-3xs font-semibold text-on-accent" numberOfLines={1}>
        {text}
      </Text>
    </View>
  )
}

function TabBarItem({
  icon,
  badge,
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab> & {
  icon?: PhosphorIcon
  badge?: TabBarBadgeValue
}) {
  const text = badgeText(badge)
  return (
    <TabsPrimitive.Tab
      className={(state) =>
        cn(
          "flex-1 items-center justify-center gap-0.5 rounded-full py-1.5 active:bg-item-pressed",
          state.active && "bg-control",
          resolveClassName(className, state)
        )
      }
      accessibilityValue={text === undefined ? undefined : { text }}
      render={(renderProps, state) => (
        <TextClassContext.Provider
          value={cn(
            "text-3xs font-medium",
            state.active
              ? "text-accent"
              : state.disabled
                ? "text-label-quaternary"
                : "text-label-secondary"
          )}
        >
          <Pressable {...renderProps}>
            {icon || badge !== undefined ? (
              <View className="relative">
                {icon ? (
                  <Icon
                    as={icon}
                    weight={state.active ? "fill" : "regular"}
                    className="size-6"
                  />
                ) : null}
                {badge !== undefined ? <TabBarBadge badge={badge} /> : null}
              </View>
            ) : null}
            {typeof children === "string" || typeof children === "number" ? (
              <Text numberOfLines={1}>{children}</Text>
            ) : (
              children
            )}
          </Pressable>
        </TextClassContext.Provider>
      )}
      {...props}
    />
  )
}

export type { TabBarBadgeValue }
export { TabBar, TabBarItem, TabBarList }
