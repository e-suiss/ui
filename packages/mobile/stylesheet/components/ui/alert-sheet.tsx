import * as React from "react"
import {
  Platform,
  Pressable,
  StyleSheet,
  type TextStyle,
  View,
  type ViewProps,
} from "react-native"
import {
  Easing,
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as AlertSheetPrimitive from "@/components/primitives/alert-dialog"
import * as DialogPrimitive from "@/components/primitives/dialog"
import { AnimatedView } from "@/components/ui/animated-view"
import { IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, zIndex: 50 },
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "flex-end",
    pointerEvents: "box-none",
  },
  frame: { width: "100%", maxWidth: 448, pointerEvents: "box-none" },
  content: { width: "100%", flexDirection: "column", gap: 8, padding: 8 },
  group: {
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: radius["2xl"],
  },
  separator: { height: 1 },
  header: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: 16,
  },
  title: { ...fontSize.sm, fontWeight: "600", textAlign: "center" },
  description: { ...fontSize.sm, textAlign: "center" },
  action: {
    minHeight: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  cancel: { borderRadius: radius["2xl"] },
})

function AlertSheet({
  dismissible = true,
  ...props
}: AlertSheetPrimitive.RootProps & { dismissible?: boolean }) {
  if (dismissible) {
    return <DialogPrimitive.Root {...props} />
  }
  return <AlertSheetPrimitive.Root {...props} />
}

const AlertSheetTrigger = AlertSheetPrimitive.Trigger

const AlertSheetPortal = AlertSheetPrimitive.Portal

function AlertSheetOverlay({
  style,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Backdrop>) {
  return (
    <AlertSheetPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(250).reduceMotion(ReduceMotion.System)}
        />
      }
      style={(state) => [
        styles.backdrop,
        { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertSheetContent({
  style,
  portalHost,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Popup> & {
  portalHost?: string
}) {
  const insets = useSafeAreaInsets()
  return (
    <AlertSheetPortal hostName={portalHost}>
      <FullWindowOverlay>
        <AlertSheetOverlay />
        <View style={styles.container}>
          <AnimatedView
            entering={SlideInDown.duration(300)
              .easing(EASING)
              .reduceMotion(ReduceMotion.System)}
            exiting={SlideOutDown.duration(250)
              .easing(EASING)
              .reduceMotion(ReduceMotion.System)}
            style={styles.frame}
          >
            <AlertSheetPrimitive.Popup
              style={(state) => [
                styles.content,
                {
                  paddingBottom: Math.max(8, insets.bottom),
                  paddingLeft: Math.max(8, insets.left),
                  paddingRight: Math.max(8, insets.right),
                },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            />
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </AlertSheetPortal>
  )
}

function AlertSheetGroup({ style, children, ...props }: ViewProps) {
  const { colors } = useTheme()
  const items = React.Children.toArray(children).filter(Boolean)
  return (
    <View
      style={[styles.group, { backgroundColor: colors.popover }, style]}
      {...props}
    >
      {items.map((child, index) => (
        <React.Fragment
          key={React.isValidElement(child) ? (child.key ?? index) : index}
        >
          {index > 0 ? (
            <View
              accessible={false}
              style={[styles.separator, { backgroundColor: colors.border }]}
            />
          ) : null}
          {child}
        </React.Fragment>
      ))}
    </View>
  )
}

function AlertSheetHeader({ style, ...props }: ViewProps) {
  return (
    <TextStyleContext.Provider value={{ textAlign: "center" }}>
      <View style={[styles.header, style]} {...props} />
    </TextStyleContext.Provider>
  )
}

function AlertSheetTitle({
  style,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Title>) {
  const { colors } = useTheme()
  return (
    <AlertSheetPrimitive.Title
      style={(state) => [
        styles.title,
        { color: colors.mutedForeground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertSheetDescription({
  style,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Description>) {
  const { colors } = useTheme()
  return (
    <AlertSheetPrimitive.Description
      style={(state) => [
        styles.description,
        { color: colors.mutedForeground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function wrapText(children: React.ReactNode) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text>{children}</Text>
  }
  return children
}

type AlertSheetActionProps = Omit<
  React.ComponentProps<typeof AlertSheetPrimitive.Close>,
  "children"
> & {
  variant?: "default" | "destructive"
  children?: React.ReactNode
}

function useActionText(variant: "default" | "destructive"): TextStyle {
  const { colors } = useTheme()
  const color = variant === "destructive" ? colors.destructive : colors.primary
  return {
    ...fontSize.lg,
    textAlign: "center",
    color,
  }
}

function AlertSheetAction({
  style,
  variant = "default",
  disabled,
  children,
  ...props
}: AlertSheetActionProps) {
  const textStyle = useActionText(variant)
  return (
    <TextStyleContext.Provider value={textStyle}>
      <IconSizeContext.Provider value={20}>
        <AlertSheetPrimitive.Close
          disabled={disabled}
          render={
            <Pressable
              style={({ pressed }) => [
                styles.action,
                pressed && { opacity: 0.8 },
                disabled && { opacity: 0.5 },
                typeof style === "function"
                  ? style({ disabled: Boolean(disabled) })
                  : style,
              ]}
            />
          }
          {...props}
        >
          {wrapText(children)}
        </AlertSheetPrimitive.Close>
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function AlertSheetCancel({
  style,
  disabled,
  children,
  ...props
}: Omit<AlertSheetActionProps, "variant">) {
  const { colors } = useTheme()
  const textStyle = useActionText("default")
  return (
    <TextStyleContext.Provider value={{ ...textStyle, fontWeight: "600" }}>
      <IconSizeContext.Provider value={20}>
        <AlertSheetPrimitive.Close
          disabled={disabled}
          render={
            <Pressable
              style={({ pressed }) => [
                styles.action,
                styles.cancel,
                { backgroundColor: colors.popover },
                pressed && { opacity: 0.8 },
                disabled && { opacity: 0.5 },
                typeof style === "function"
                  ? style({ disabled: Boolean(disabled) })
                  : style,
              ]}
            />
          }
          {...props}
        >
          {wrapText(children)}
        </AlertSheetPrimitive.Close>
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

export {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetOverlay,
  AlertSheetPortal,
  AlertSheetTitle,
  AlertSheetTrigger,
}
