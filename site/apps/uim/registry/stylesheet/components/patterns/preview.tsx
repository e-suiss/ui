import type * as React from "react"
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native"
import { resolveStyle } from "@/components/primitives/use-render"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  trigger: { alignSelf: "flex-start" },
  pressed: { opacity: 0.6 },
  body: { padding: 16 },
  bodyClose: { paddingEnd: 56 },
  bodyCloseLabel: { paddingEnd: 96 },
})

function Preview({
  open,
  defaultOpen,
  onOpenChange,
  floating = true,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  floating?: boolean
  children?: React.ReactNode
}) {
  return (
    <Drawer
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => onOpenChange?.(next)}
      floating={floating}
      showSwipeHandle
    >
      {children}
    </Drawer>
  )
}

function PreviewTrigger({
  style,
  children,
  ...props
}: React.ComponentProps<typeof DrawerTrigger>) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider value={{ ...fontSize.base, color: colors.link }}>
      <DrawerTrigger
        style={(state) => [
          styles.trigger,
          resolveStyle(style, state) as ViewStyle,
        ]}
        render={(renderProps) => {
          const { style: baseStyle, ...rest } = renderProps
          return (
            <Pressable
              {...rest}
              style={({ pressed }) => [
                baseStyle as ViewStyle,
                pressed && styles.pressed,
              ]}
            />
          )
        }}
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text>{children}</Text>
        ) : (
          children
        )}
      </DrawerTrigger>
    </TextStyleContext.Provider>
  )
}

function PreviewContent({
  showCloseButton,
  closeLabel,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof DrawerContent>, "style"> & {
  style?: ViewStyle
}) {
  return (
    <DrawerContent
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
      {...props}
    >
      <View
        style={[
          styles.body,
          showCloseButton && styles.bodyClose,
          showCloseButton && closeLabel !== undefined && styles.bodyCloseLabel,
          style,
        ]}
      >
        {children}
      </View>
    </DrawerContent>
  )
}

export { Preview, PreviewContent, PreviewTrigger }
