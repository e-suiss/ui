import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import Animated, {
  Easing,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated"
import * as TabsPrimitive from "@/components/primitives/tabs"
import { resolveClassName } from "@/components/primitives/use-render"
import { TextClassContext } from "@/components/ui/text"

type TabsListVariant = NonNullable<
  VariantProps<typeof tabsListVariants>["variant"]
>

const TabsListContext = React.createContext<TabsListVariant>("default")

const INDICATOR_TRANSITION = LinearTransition.duration(300)
  .easing(Easing.bezier(0.32, 0.72, 0, 1))
  .reduceMotion(ReduceMotion.System)

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={(state) =>
        cn(
          "gap-2",
          state.orientation === "vertical" ? "flex-row" : "flex-col",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "relative shrink-0 flex-row items-center justify-center gap-1 self-start",
  {
    variants: {
      variant: {
        default: "rounded-xl bg-control p-1",
        line: "bg-transparent p-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsIndicator({ variant }: { variant: TabsListVariant }) {
  return (
    <TabsPrimitive.Indicator
      className={cn(
        variant === "line"
          ? "bg-label"
          : "rounded-md bg-surface-raised shadow dark:bg-label-quaternary"
      )}
      style={(state) => {
        if (variant !== "line") return undefined
        const position = state.activeTabPosition
        const size = state.activeTabSize
        if (!position || !size) return undefined
        return state.orientation === "vertical"
          ? { left: position.left + size.width + 2, width: 2 }
          : { top: position.top + size.height + 3, height: 2 }
      }}
      render={<Animated.View layout={INDICATOR_TRANSITION} />}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const resolved = variant ?? "default"
  return (
    <TabsListContext.Provider value={resolved}>
      <TabsPrimitive.List
        className={(state) =>
          cn(
            tabsListVariants({ variant: resolved }),
            state.orientation === "vertical"
              ? "flex-col items-stretch"
              : resolved === "line"
                ? "h-[2.5625rem] pb-[0.4375rem]"
                : "h-11",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <TabsIndicator variant={resolved} />
        {children}
      </TabsPrimitive.List>
    </TabsListContext.Provider>
  )
}

function TabsTrigger({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  const { value, orientation } = TabsPrimitive.useRootContext()
  const active = value === props.value
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm",
        disabled
          ? "text-label-quaternary"
          : active
            ? "text-label"
            : "text-label-secondary"
      )}
    >
      <TabsPrimitive.Tab
        disabled={disabled}
        className={(state) =>
          cn(
            "flex-row items-center justify-center gap-2 rounded-md px-3 py-1",
            orientation === "vertical"
              ? "h-9 w-full justify-start"
              : "h-full flex-1",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      className={(state) => cn("grow", resolveClassName(className, state))}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants }
