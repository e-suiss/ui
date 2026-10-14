import { XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native"
import {
  FadeIn,
  FadeOut,
  Keyframe,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as DialogPrimitive from "@/components/primitives/dialog"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

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

const DialogCloseContext = React.createContext({
  hasCloseButton: false,
  hasCloseLabel: false,
})

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
  containerInner: {
    width: "100%",
    maxWidth: 448,
    pointerEvents: "box-none",
  },
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
  close: { position: "absolute", top: 19, right: 16 },
  closeLabel: { ...fontSize.base },
  header: { flexDirection: "column", gap: 6 },
  headerClose: { paddingRight: 32 },
  headerCloseLabel: { paddingRight: 72 },
  footer: { flexDirection: "column-reverse", gap: 8 },
  footerSm: { flexDirection: "row", justifyContent: "flex-end" },
  title: { ...fontSize.base, fontWeight: "600" },
  description: { ...fontSize.sm },
})

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

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

function DialogCloseButton({ closeLabel }: { closeLabel?: string }) {
  const { colors } = useTheme()
  return (
    <DialogPrimitive.Close
      render={
        <Button
          variant={closeLabel ? "plain" : "ghost"}
          size={closeLabel ? "sm" : "icon-sm"}
          style={({ pressed }) => [
            styles.close,
            !closeLabel && {
              backgroundColor: pressed
                ? colors.separator
                : colors.surfaceTertiary,
            },
          ]}
        />
      }
      hitSlop={8}
      accessibilityLabel={closeLabel ? undefined : "Close"}
    >
      {closeLabel ? (
        <Text style={styles.closeLabel}>{closeLabel}</Text>
      ) : (
        <Icon as={XIcon} size={16} color={colors.label} />
      )}
    </DialogPrimitive.Close>
  )
}

function DialogContent({
  style,
  portalHost,
  showCloseButton = true,
  closeLabel,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  portalHost?: string
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const { colors, isDark } = useTheme()
  const closeContext = React.useMemo(
    () => ({
      hasCloseButton: showCloseButton,
      hasCloseLabel: showCloseButton && closeLabel !== undefined,
    }),
    [showCloseButton, closeLabel]
  )
  return (
    <DialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <DialogOverlay />
        <View style={styles.container}>
          <AnimatedView
            entering={POPUP_ENTERING}
            exiting={POPUP_EXITING}
            style={styles.containerInner}
          >
            <DialogPrimitive.Popup
              style={(state) => [
                styles.content,
                {
                  borderColor: withAlpha(colors.label, isDark ? 0.1 : 0.05),
                  backgroundColor: colors.surfaceRaised,
                },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            >
              <DialogCloseContext.Provider value={closeContext}>
                {children}
              </DialogCloseContext.Provider>
              {showCloseButton ? (
                <DialogCloseButton closeLabel={closeLabel} />
              ) : null}
            </DialogPrimitive.Popup>
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </DialogPortal>
  )
}

function DialogHeader({ style, ...props }: ViewProps) {
  const { hasCloseButton, hasCloseLabel } = React.useContext(DialogCloseContext)
  return (
    <View
      style={[
        styles.header,
        hasCloseButton && styles.headerClose,
        hasCloseLabel && styles.headerCloseLabel,
        style,
      ]}
      {...props}
    />
  )
}

function DialogFooter({
  style,
  showCloseButton = false,
  children,
  ...props
}: ViewProps & { showCloseButton?: boolean }) {
  const { width } = useWindowDimensions()
  return (
    <View
      style={[styles.footer, width >= 640 && styles.footerSm, style]}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close render={<Button variant="secondary" />}>
          <Text>Close</Text>
        </DialogPrimitive.Close>
      ) : null}
    </View>
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
        { color: colors.label },
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
        { color: colors.labelSecondary },
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
