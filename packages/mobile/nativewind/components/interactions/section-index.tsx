import { cn } from "cn"
import type * as React from "react"
import { View } from "react-native"
import { FadeOut, ReduceMotion, ZoomIn } from "react-native-reanimated"
import * as SectionIndexPrimitive from "@/components/primitives/section-index"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Text } from "@/components/ui/text"

function SectionIndex({
  className,
  ...props
}: React.ComponentProps<typeof SectionIndexPrimitive.Root>) {
  return (
    <SectionIndexPrimitive.Root
      className={(state) => cn("relative", resolveClassName(className, state))}
      {...props}
    />
  )
}

function SectionIndexScrollView({
  className,
  ...props
}: React.ComponentProps<typeof SectionIndexPrimitive.ScrollView>) {
  return (
    <SectionIndexPrimitive.ScrollView
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

function SectionIndexSection(
  props: React.ComponentProps<typeof SectionIndexPrimitive.Section>
) {
  return <SectionIndexPrimitive.Section {...props} />
}

function SectionIndexHeader({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      role="heading"
      className={cn("bg-background px-4 py-1.5", className)}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text className="text-sm font-semibold text-muted-foreground">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}

function SectionIndexBar({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SectionIndexPrimitive.Bar>, "children">) {
  return (
    <View
      className="absolute top-0 bottom-0 end-3 justify-center"
      style={{ pointerEvents: "box-none" }}
    >
      <SectionIndexPrimitive.Bar
        className={(state) =>
          cn(
            "items-center rounded-full px-1.5",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {(state) => (
          <>
            {state.items.map((item) => (
              <View
                key={item.key}
                className="h-4 min-w-3 items-center justify-center"
                style={{ pointerEvents: "none" }}
              >
                <Text className="text-xs font-semibold text-primary">
                  {item.label}
                </Text>
              </View>
            ))}
            {state.dragging ? (
              <AnimatedView
                entering={ZoomIn.duration(200).reduceMotion(
                  ReduceMotion.System
                )}
                exiting={FadeOut.duration(150).reduceMotion(
                  ReduceMotion.System
                )}
                className="absolute end-full me-4 size-14 items-center justify-center rounded-full border border-border bg-popover shadow-xl"
                style={{ top: state.dragY - 28, pointerEvents: "none" }}
              >
                <Text className="text-3xl font-semibold text-foreground">
                  {state.letter}
                </Text>
              </AnimatedView>
            ) : null}
          </>
        )}
      </SectionIndexPrimitive.Bar>
    </View>
  )
}

export {
  SectionIndex,
  SectionIndexBar,
  SectionIndexHeader,
  SectionIndexScrollView,
  SectionIndexSection,
}
