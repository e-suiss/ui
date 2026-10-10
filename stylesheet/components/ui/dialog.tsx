import * as DialogPrimitive from "@rn-primitives/dialog"
import { XIcon } from "phosphor-react-native"
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
import { Icon } from "@/components/ui/icon"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

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
  overlayInner: { width: "100%", maxWidth: 448, paddingHorizontal: 16 },
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
  children,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        style={[
          styles.overlay,
          { backgroundColor: colors.overlay },
          typeof style === "function" ? undefined : style,
        ]}
        {...props}
        asChild
      >
        <AnimatedView
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
        >
          <AnimatedView
            entering={FadeIn.delay(50).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            style={styles.overlayInner}
          >
            {children}
          </AnimatedView>
        </AnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  )
}

function DialogContent({
  style,
  portalHost,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string
}) {
  const { colors, isDark } = useTheme()
  const { width } = useWindowDimensions()
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          style={[
            styles.content,
            { borderColor: colors.outline, backgroundColor: colors.popover },
            width >= 640 && styles.contentSm,
            style,
          ]}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
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
            hitSlop={12}
            aria-label="Close"
          >
            <Icon
              as={XIcon}
              size={16}
              color={colors.foreground}
              style={styles.closeIcon}
            />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
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
      style={[styles.title, { color: colors.foreground }, style]}
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
      style={[styles.description, { color: colors.mutedForeground }, style]}
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
