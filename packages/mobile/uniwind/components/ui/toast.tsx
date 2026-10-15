import { cn } from "cn"
import { CheckIcon, ExclamationMarkIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  ActivityIndicator,
  Platform,
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
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const toast = ToastPrimitive.createToastManager()

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const GAP = 12

const PEEK = 12

const MAX_WIDTH = 384

const TIMING = { duration: 450, reduceMotion: ReduceMotion.System }

function ToastProvider(props: ToastPrimitive.ProviderProps) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal(props: ToastPrimitive.PortalProps) {
  return <ToastPrimitive.Portal {...props} />
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={(state) =>
        cn(
          "absolute top-0 right-0 bottom-0 left-0 z-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function Toast({
  className,
  style,
  toast: toastItem,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root>) {
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
  const measured = position.height > 0 ? position.height : undefined
  const height = !expanded && index > 0 && front > 0 ? front : measured
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
      <AnimatedView
        style={[
          { transformOrigin: "bottom", pointerEvents: "box-none" },
          stackStyle,
        ]}
      >
        <ToastPrimitive.Root
          toast={toastItem}
          className={(state) =>
            cn(
              "w-full rounded-xl border border-foreground/5 bg-popover shadow-[0_8px_32px_rgba(0,0,0,0.14)] dark:border-transparent dark:shadow-lg",
              resolveClassName(className, state)
            )
          }
          style={(state) => [
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
  className,
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
      className={(state) =>
        cn(
          "flex-row items-center gap-3 p-4",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      className={(state) =>
        cn(
          "text-sm font-semibold text-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      className={(state) =>
        cn("text-sm text-muted-foreground", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function ToastAction({
  className,
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
      className={(state) => cn("shrink-0", resolveClassName(className, state))}
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
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      render={render}
      accessibilityLabel="Close toast"
      hitSlop={8}
      className={(state) => cn("shrink-0", resolveClassName(className, state))}
      {...props}
    >
      {children ?? <Icon as={XIcon} className="size-4 text-muted-foreground" />}
    </ToastPrimitive.Close>
  )
}

function toastIcon(type: string | undefined) {
  if (type === "success") return CheckIcon
  if (type === "error") return XIcon
  return ExclamationMarkIcon
}

const TINT: Record<string, string> = {
  success: "bg-green-500",
  info: "bg-primary",
  warning: "bg-orange-500",
  error: "bg-destructive",
}

function ToastIcon({ type }: { type: string | undefined }) {
  if (type === "loading") {
    return (
      <View
        accessible={false}
        className="size-8 shrink-0 items-center justify-center"
      >
        <ActivityIndicator colorClassName="accent-primary" />
      </View>
    )
  }
  const tint = type ? TINT[type] : undefined
  if (!tint) return null
  const IconComponent = toastIcon(type)
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className={cn(
        "size-8 shrink-0 items-center justify-center rounded-full",
        tint
      )}
    >
      <View className={cn(type === "info" && "rotate-180")}>
        <Icon
          as={IconComponent}
          weight="bold"
          className="size-4 text-background"
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
        <View className="min-w-0 flex-1 gap-1">
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
