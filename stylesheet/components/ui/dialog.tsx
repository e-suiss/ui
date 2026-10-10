import { XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as DialogPrimitive from "@/components/primitives/dialog"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

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
    width: "100%",
    maxWidth: 448,
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },
  content: {
    zIndex: 50,
    marginHorizontal: "auto",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: 24,
    borderRadius: radius["4xl"],
    borderWidth: 1,
    padding: 24,
    ...shadow.xl,
  },
  contentSm: { maxWidth: 448 },
  close: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  closeIcon: { flexShrink: 0 },
  header: { display: "flex", flexDirection: "column", gap: 6 },
  footer: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: 8,
  },
  footerSm: { flexDirection: "row", justifyContent: "flex-end" },
  title: { ...fontSize.base, lineHeight: 16, fontWeight: "500" },
  description: { ...fontSize.sm },
})

function DialogOverlay({
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  const { colors } = useTheme()
  return (
    <DialogPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
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

function DialogContent({
  style,
  portalHost,
  showCloseButton = true,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  portalHost?: string
  showCloseButton?: boolean
}) {
  const { colors, isDark } = useTheme()
  const { width } = useWindowDimensions()
  return (
    <DialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <DialogOverlay />
        <View style={styles.container}>
          <AnimatedView
            entering={FadeIn.delay(50).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            style={styles.containerInner}
          >
            <DialogPrimitive.Popup
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
            >
              {children}
              {showCloseButton ? (
                <DialogPrimitive.Close
                  render={
                    <Pressable
                      style={({ pressed }) => [
                        styles.close,
                        {
                          backgroundColor: pressed
                            ? isDark
                              ? colors.mutedSubtle
                              : colors.muted
                            : colors.secondary,
                        },
                      ]}
                    />
                  }
                  hitSlop={12}
                  accessibilityLabel="Close"
                >
                  <Icon
                    as={XIcon}
                    size={16}
                    color={colors.foreground}
                    style={styles.closeIcon}
                  />
                </DialogPrimitive.Close>
              ) : null}
            </DialogPrimitive.Popup>
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </DialogPortal>
  )
}

function DialogHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />
}

function DialogFooter({ style, ...props }: ViewProps) {
  const { width } = useWindowDimensions()
  return (
    <View
      style={[styles.footer, width >= 640 && styles.footerSm, style]}
      {...props}
    />
  )
}

function DialogTitle({
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  const { colors } = useTheme()
  return (
    <DialogPrimitive.Title
      style={(state) => [
        styles.title,
        { color: colors.foreground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function DialogDescription({
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  const { colors } = useTheme()
  return (
    <DialogPrimitive.Description
      style={(state) => [
        styles.description,
        { color: colors.mutedForeground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
