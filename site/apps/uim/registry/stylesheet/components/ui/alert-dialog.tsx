import * as React from "react"
import { Platform, StyleSheet, View, type ViewProps } from "react-native"
import {
  FadeIn,
  FadeOut,
  Keyframe,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as AlertDialogPrimitive from "@/components/primitives/alert-dialog"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const POPUP_ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.95 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})
  .duration(150)
  .reduceMotion(ReduceMotion.System)

const POPUP_EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.95 }] },
})
  .duration(100)
  .reduceMotion(ReduceMotion.System)

const AlertDialogFooterContext = React.createContext(false)

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, zIndex: 50 },
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    pointerEvents: "box-none",
  },
  containerInner: { width: "100%", maxWidth: 340, pointerEvents: "box-none" },
  containerInnerSm: { maxWidth: 320 },
  content: {
    zIndex: 50,
    width: "100%",
    flexDirection: "column",
    gap: 24,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    padding: 24,
    ...shadow.xl,
  },
  header: { flexDirection: "column", alignItems: "center", gap: 6 },
  footer: { flexDirection: "row", gap: 8 },
  footerItem: { flex: 1 },
  media: {
    marginBottom: 8,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  title: { ...fontSize.lg, fontWeight: "600", textAlign: "center" },
  description: { ...fontSize.sm, textAlign: "center" },
})

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

function AlertDialogOverlay({
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Backdrop>) {
  const { colors } = useTheme()
  return (
    <AlertDialogPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(150).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(100).reduceMotion(ReduceMotion.System)}
        />
      }
      style={(state) => [
        styles.backdrop,
        { backgroundColor: colors.scrim },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertDialogContent({
  style,
  portalHost,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Popup> & {
  portalHost?: string
  size?: "default" | "sm"
}) {
  const { colors, isDark } = useTheme()
  return (
    <AlertDialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <AlertDialogOverlay />
        <View style={styles.container}>
          <AnimatedView
            entering={POPUP_ENTERING}
            exiting={POPUP_EXITING}
            style={[
              styles.containerInner,
              size === "sm" && styles.containerInnerSm,
            ]}
          >
            <AlertDialogPrimitive.Popup
              style={(state) => [
                styles.content,
                {
                  borderColor: withAlpha(colors.label, isDark ? 0.1 : 0.05),
                  backgroundColor: colors.surfaceRaised,
                },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            />
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ style, ...props }: ViewProps) {
  return (
    <TextStyleContext.Provider value={{ textAlign: "center" }}>
      <View style={[styles.header, style]} {...props} />
    </TextStyleContext.Provider>
  )
}

function AlertDialogFooter({ style, ...props }: ViewProps) {
  return (
    <AlertDialogFooterContext.Provider value={true}>
      <View style={[styles.footer, style]} {...props} />
    </AlertDialogFooterContext.Provider>
  )
}

function AlertDialogMedia({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  return (
    <View
      style={[
        styles.media,
        { backgroundColor: colors.surfaceSecondary },
        style,
      ]}
      {...props}
    />
  )
}

function AlertDialogTitle({
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  const { colors } = useTheme()
  return (
    <AlertDialogPrimitive.Title
      style={(state) => [
        styles.title,
        { color: colors.label },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertDialogDescription({
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  const { colors } = useTheme()
  return (
    <AlertDialogPrimitive.Description
      style={(state) => [
        styles.description,
        { color: colors.labelSecondary },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertDialogAction({
  style,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const inFooter = React.useContext(AlertDialogFooterContext)
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
      style={(state) => [
        inFooter && styles.footerItem,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertDialogCancel({
  style,
  variant = "secondary",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const inFooter = React.useContext(AlertDialogFooterContext)
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
      style={(state) => [
        inFooter && styles.footerItem,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
