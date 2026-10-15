import type * as React from "react"
import { StyleSheet, View, type ViewStyle } from "react-native"
import { FadeOut, ReduceMotion, ZoomIn } from "react-native-reanimated"
import * as SectionIndexPrimitive from "@/components/primitives/section-index"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Text } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: { position: "relative" },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 6 },
  headerText: { ...fontSize.sm, fontWeight: "600" },
  barFrame: {
    position: "absolute",
    top: 0,
    bottom: 0,
    end: 12,
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  bar: {
    alignItems: "center",
    borderRadius: radius.full,
    paddingHorizontal: 6,
  },
  letter: {
    height: 16,
    minWidth: 12,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  letterText: { ...fontSize.xs, fontWeight: "600" },
  bubble: {
    position: "absolute",
    end: "100%",
    marginEnd: 16,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    pointerEvents: "none",
    ...shadow.xl,
  },
  bubbleText: { ...fontSize["3xl"], fontWeight: "600" },
})

function SectionIndex({
  style,
  ...props
}: React.ComponentProps<typeof SectionIndexPrimitive.Root>) {
  return (
    <SectionIndexPrimitive.Root
      style={(state) => [styles.root, resolveStyle(style, state) as ViewStyle]}
      {...props}
    />
  )
}

function SectionIndexScrollView({
  style,
  ...props
}: React.ComponentProps<typeof SectionIndexPrimitive.ScrollView>) {
  return (
    <SectionIndexPrimitive.ScrollView
      style={[styles.scroll, style]}
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
  style,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const { colors } = useTheme()
  return (
    <View
      role="heading"
      style={[styles.header, { backgroundColor: colors.background }, style]}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.headerText, { color: colors.mutedForeground }]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}

function SectionIndexBar({
  style,
  ...props
}: Omit<React.ComponentProps<typeof SectionIndexPrimitive.Bar>, "children">) {
  const { colors } = useTheme()
  return (
    <View style={styles.barFrame}>
      <SectionIndexPrimitive.Bar
        style={(state) => [styles.bar, resolveStyle(style, state) as ViewStyle]}
        {...props}
      >
        {(state) => (
          <>
            {state.items.map((item) => (
              <View key={item.key} style={styles.letter}>
                <Text style={[styles.letterText, { color: colors.primary }]}>
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
                style={[
                  styles.bubble,
                  {
                    top: state.dragY - 28,
                    backgroundColor: colors.popover,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.bubbleText, { color: colors.foreground }]}>
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
