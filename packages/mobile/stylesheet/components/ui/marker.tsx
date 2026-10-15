import * as React from "react"
import { StyleSheet, View, type ViewProps } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

type MarkerVariant = "default" | "separator" | "border"

const MarkerContext = React.createContext<MarkerVariant>("default")

const styles = StyleSheet.create({
  root: {
    minHeight: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  border: { borderBottomWidth: 1, paddingBottom: 8 },
  line: { height: 1, minWidth: 0, flex: 1 },
  icon: {
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { minWidth: 0, flexShrink: 1 },
  contentSeparator: { flexShrink: 0, textAlign: "center" },
})

function MarkerLine() {
  const { colors } = useTheme()
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[styles.line, { backgroundColor: colors.border }]}
    />
  )
}

function Marker({
  style,
  variant = "default",
  render,
  children,
  ...props
}: ViewProps & {
  variant?: MarkerVariant
  render?: RenderProp<Record<string, unknown>, Record<string, never>>
}) {
  const { colors } = useTheme()
  const separator = variant === "separator"
  const element = useRender({
    defaultComponent: View,
    render,
    props: [
      {
        style: [
          styles.root,
          variant === "border" && [
            styles.border,
            { borderColor: colors.border },
          ],
          style,
        ],
        children: (
          <>
            {separator ? <MarkerLine /> : null}
            {children}
            {separator ? <MarkerLine /> : null}
          </>
        ),
      },
      props,
    ],
  })
  return (
    <MarkerContext.Provider value={variant}>
      <TextStyleContext.Provider
        value={{
          ...fontSize.sm,
          textAlign: "left",
          color: colors.mutedForeground,
        }}
      >
        <IconSizeContext.Provider value={16}>
          {element}
        </IconSizeContext.Provider>
      </TextStyleContext.Provider>
    </MarkerContext.Provider>
  )
}

function MarkerIcon({ style, ...props }: ViewProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.icon, style]}
      {...props}
    />
  )
}

function MarkerContent({ style, ...props }: React.ComponentProps<typeof Text>) {
  const variant = React.useContext(MarkerContext)
  return (
    <Text
      style={[
        styles.content,
        variant === "separator" && styles.contentSeparator,
        style,
      ]}
      {...props}
    />
  )
}

export { Marker, MarkerContent, MarkerIcon }
