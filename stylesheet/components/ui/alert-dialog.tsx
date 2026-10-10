import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog"
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
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  overlayInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
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
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof AlertDialogPrimitive.Overlay>,
  "asChild"
> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <FullWindowOverlay>
      <AlertDialogPrimitive.Overlay
        style={[styles.overlay, { backgroundColor: colors.overlay }, style]}
        {...props}
        asChild
      >
        <AnimatedView
          entering={FadeIn.duration(200)
            .delay(50)
            .reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
          style={styles.overlayInner}
        >
          {children}
        </AnimatedView>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  )
}

function AlertDialogContent({
  style,
  portalHost,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  portalHost?: string
}) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          style={[
            styles.content,
            { borderColor: colors.outline, backgroundColor: colors.popover },
            width >= 640 && styles.contentSm,
            style,
          ]}
          {...props}
        />
      </AlertDialogOverlay>
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
      style={[styles.title, { color: colors.foreground }, style]}
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
      style={[styles.description, { color: colors.mutedForeground }, style]}
      {...props}
    />
  )
}

function AlertDialogAction({
  style,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action {...props} asChild>
      <Button style={style}>{children}</Button>
    </AlertDialogPrimitive.Action>
  )
}

function AlertDialogCancel({
  style,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel {...props} asChild>
      <Button variant="outline" style={style}>
        {children}
      </Button>
    </AlertDialogPrimitive.Cancel>
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
