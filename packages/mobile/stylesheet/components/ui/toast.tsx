import { CheckIcon, ExclamationMarkIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native"
import {
  FadeOutDown,
  ReduceMotion,
  SlideInDown,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as ToastPrimitive from "@/components/primitives/toast"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  radius,
  shadow,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

const toast = ToastPrimitive.createToastManager()

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const GAP = 12

const PEEK = 12

const MAX_WIDTH = 384

const TIMING = { duration: 450, reduceMotion: ReduceMotion.System }

const styles = StyleSheet.create({
  viewport: { ...StyleSheet.absoluteFill, zIndex: 50 },
  stack: { transformOrigin: "bottom", pointerEvents: "box-none" },
  root: {
    width: "100%",
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  rootShadow: { boxShadow: "0 8px 32px rgba(0, 0, 0, 0.14)" },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  text: { minWidth: 0, flex: 1, gap: 4 },
  title: { ...fontSize.sm, fontWeight: "600" },
  description: { ...fontSize.sm },
  shrink: { flexShrink: 0 },
  icon: {
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  flipped: { transform: [{ rotate: "180deg" }] },
})

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

function ToastProvider(props: ToastPrimitive.ProviderProps) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal(props: ToastPrimitive.PortalProps) {
  return <ToastPrimitive.Portal {...props} />
}

function ToastViewport({
  style,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      style={(state) => [
        styles.viewport,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function Toast({
  style,
  toast: toastItem,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root>) {
  const { colors, isDark } = useTheme()
  const position = ToastPrimitive.useToastPosition(toastItem.id)
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const inset = Math.max(16, (width - MAX_WIDTH) / 2)
  const index = position.visibleIndex
  const expanded = position.expanded
  const scale = expanded ? 1 : Math.max(0, 1 - index * 0.1)
  const front = position.frontmostHeight
  const translateY = expanded
    ? -(position.offsetY + index * GAP)
    : -(index * PEEK) - (1 - scale) * front
  let height = position.height > 0 ? position.height : undefined
  if (!expanded && index > 0 && front > 0) height = front
  const hidden = position.limited

  const stackStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(hidden ? 0 : 1, TIMING),
      transform: [
        { translateY: withTiming(translateY, TIMING) },
        { scale: withTiming(scale, TIMING) },
      ],
    }),
    [hidden, translateY, scale]
  )

  const heightStyle = useAnimatedStyle(
    () =>
      height === undefined
        ? {}
        : {
            height: withTiming(height, {
              duration: 150,
              reduceMotion: ReduceMotion.System,
            }),
          },
    [height]
  )

  return (
    <AnimatedView
      entering={SlideInDown.duration(450).reduceMotion(ReduceMotion.System)}
      exiting={FadeOutDown.duration(250).reduceMotion(ReduceMotion.System)}
      style={{
        position: "absolute",
        left: inset,
        right: inset,
        bottom: insets.bottom + 16,
        zIndex: 1000 - index,
        pointerEvents: hidden ? "none" : "box-none",
      }}
    >
      <AnimatedView style={[styles.stack, stackStyle]}>
        <ToastPrimitive.Root
          toast={toastItem}
          style={(state) => [
            styles.root,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: isDark
                ? "transparent"
                : withAlpha(colors.label, 0.05),
            },
            isDark ? shadow.lg : styles.rootShadow,
            heightStyle,
            typeof style === "function" ? style(state) : style,
          ]}
          {...props}
        />
      </AnimatedView>
    </AnimatedView>
  )
}

function ToastContent({
  style,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Content>) {
  const { behind } = ToastPrimitive.useToastRootContext("ToastContent")
  const fadeStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(behind ? 0 : 1, {
        duration: 250,
        reduceMotion: ReduceMotion.System,
      }),
    }),
    [behind]
  )
  return (
    <ToastPrimitive.Content
      render={<AnimatedView style={fadeStyle} />}
      style={(state) => [
        styles.content,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function ToastTitle({
  style,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  const { colors } = useTheme()
  return (
    <ToastPrimitive.Title
      style={(state) => [
        styles.title,
        { color: colors.label },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function ToastDescription({
  style,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  const { colors } = useTheme()
  return (
    <ToastPrimitive.Description
      style={(state) => [
        styles.description,
        { color: colors.labelSecondary },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function ToastAction({
  style,
  children,
  render = <Button variant="outline" size="sm" />,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) {
  const { toast: toastItem } = ToastPrimitive.useToastRootContext("ToastAction")
  const content = children ?? toastItem.actionProps?.children
  if (content == null || content === false) return null
  return (
    <ToastPrimitive.Action
      render={render}
      style={(state) => [
        styles.shrink,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {typeof content === "string" || typeof content === "number" ? (
        <Text>{content}</Text>
      ) : (
        content
      )}
    </ToastPrimitive.Action>
  )
}

function ToastClose({
  style,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  const { colors } = useTheme()
  return (
    <ToastPrimitive.Close
      render={render}
      accessibilityLabel="Close toast"
      hitSlop={8}
      style={(state) => [
        styles.shrink,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children ?? <Icon as={XIcon} size={16} color={colors.labelSecondary} />}
    </ToastPrimitive.Close>
  )
}

function toastTint(type: string | undefined, colors: ThemeColors) {
  if (type === "success") return colors.green
  if (type === "info") return colors.accent
  if (type === "warning") return colors.orange
  if (type === "error") return colors.danger
  return
}

function toastIcon(type: string | undefined) {
  if (type === "success") return CheckIcon
  if (type === "error") return XIcon
  return ExclamationMarkIcon
}

function ToastIcon({ type }: { type: string | undefined }) {
  const { colors } = useTheme()
  if (type === "loading") {
    return (
      <View accessible={false} style={styles.icon}>
        <ActivityIndicator color={colors.accent} />
      </View>
    )
  }
  const tint = toastTint(type, colors)
  if (!tint) return null
  const IconComponent = toastIcon(type)
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.icon, { backgroundColor: tint }]}
    >
      <View style={type === "info" ? styles.flipped : undefined}>
        <Icon
          as={IconComponent}
          weight="bold"
          size={16}
          color={colors.surface}
        />
      </View>
    </View>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <View style={styles.text}>
          <ToastTitle />
          <ToastDescription />
        </View>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

function Toaster({
  children,
  toastManager = toast,
  portalHost,
  ...props
}: ToastPrimitive.ProviderProps & { portalHost?: string }) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal hostName={portalHost}>
        <FullWindowOverlay>
          <ToastViewport>
            <ToastList />
          </ToastViewport>
        </FullWindowOverlay>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager

const useToastManager = ToastPrimitive.useToastManager

export {
  createToastManager,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
}
