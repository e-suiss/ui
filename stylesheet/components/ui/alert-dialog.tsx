import * as React from "react"
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
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

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, zIndex: 50 },
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    pointerEvents: "box-none",
  },
  containerInner: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },
  content: {
    zIndex: 50,
    width: "100%",
    maxWidth: 320,
    flexDirection: "column",
    gap: 24,
    borderRadius: radius["4xl"],
    borderWidth: 1,
    padding: 24,
    ...shadow.xl,
  },
  contentSm: { maxWidth: 448 },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  headerSm: { alignItems: "flex-start" },
  footer: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: 8,
  },
  footerSm: { flexDirection: "row", justifyContent: "flex-end" },
  title: { ...fontSize.lg, fontWeight: "500" },
  description: { ...fontSize.sm },
})

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
          entering={FadeIn.duration(200)
            .delay(50)
            .reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
        />
      }
      style={(state) => [
        styles.backdrop,
        { backgroundColor: colors.overlay },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertDialogContent({
  style,
  portalHost,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Popup> & {
  portalHost?: string
}) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  return (
    <AlertDialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <AlertDialogOverlay />
        <View style={styles.container}>
          <AnimatedView
            entering={FadeIn.duration(200)
              .delay(50)
              .reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            style={styles.containerInner}
          >
            <AlertDialogPrimitive.Popup
              style={(state) => [
                styles.content,
                {
                  borderColor: colors.outline,
                  backgroundColor: colors.popover,
                },
                width >= 640 && styles.contentSm,
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
  const { width } = useWindowDimensions()
  const isSm = width >= 640
  return (
    <TextStyleContext.Provider value={{ textAlign: isSm ? "left" : "center" }}>
      <View
        style={[styles.header, isSm && styles.headerSm, style]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function AlertDialogFooter({ style, ...props }: ViewProps) {
  const { width } = useWindowDimensions()
  return (
    <View
      style={[styles.footer, width >= 640 && styles.footerSm, style]}
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
        { color: colors.foreground },
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
        { color: colors.mutedForeground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function AlertDialogAction({
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

function AlertDialogCancel({
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
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
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
