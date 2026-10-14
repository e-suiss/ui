import { cn } from "cn"
import {
  type Icon as PhosphorIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Pressable, View } from "react-native"
import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  ReduceMotion,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useBackHandler } from "@/components/primitives/hooks"
import { Portal } from "@/components/primitives/portal"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type FabSize = "default" | "lg"

const FabContext = React.createContext<{ close: () => void } | null>(null)

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

function isAction(node: React.ReactNode) {
  return React.isValidElement(node) && node.type === FabAction
}

function Fab({
  size = "default",
  icon = PlusIcon,
  label,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  portalHost,
  className,
  children,
  onPress,
  accessibilityState,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  size?: FabSize
  icon?: PhosphorIcon
  label?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  portalHost?: string
  children?: React.ReactNode
}) {
  const insets = useSafeAreaInsets()
  const id = React.useId()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const actions = React.Children.toArray(children).filter(isAction)
  const hasActions = actions.length > 0
  const open = hasActions && (openProp ?? uncontrolledOpen)
  const extended = label !== undefined && label !== null

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const close = React.useCallback(() => setOpen(false), [setOpen])

  useBackHandler(open, close)

  const rotated = open && icon === PlusIcon

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(rotated ? "45deg" : "0deg", {
          duration: 250,
          easing: EASING,
          reduceMotion: ReduceMotion.System,
        }),
      },
    ],
  }))

  const context = React.useMemo(() => ({ close }), [close])

  return (
    <Portal name={`fab-${id}`} hostName={portalHost}>
      <FabContext.Provider value={context}>
        {open ? (
          <AnimatedView
            as="Pressable"
            accessible={false}
            importantForAccessibility="no"
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(200).reduceMotion(ReduceMotion.System)}
            className="absolute inset-0 z-40 bg-scrim"
            onPress={close}
          />
        ) : null}
        <View
          className="absolute z-40 items-end"
          style={{
            bottom: insets.bottom + 16,
            end: (I18nManager.isRTL ? insets.left : insets.right) + 16,
            pointerEvents: "box-none",
          }}
        >
          <View
            className={cn("items-end gap-3", open && "mb-4")}
            onAccessibilityEscape={close}
            style={{ pointerEvents: "box-none" }}
          >
            {open
              ? actions.map((action, index) => (
                  <AnimatedView
                    key={React.isValidElement(action) ? action.key : index}
                    entering={FadeInDown.delay(
                      (actions.length - 1 - index) * 30
                    )
                      .duration(250)
                      .reduceMotion(ReduceMotion.System)}
                    exiting={FadeOutDown.duration(150).reduceMotion(
                      ReduceMotion.System
                    )}
                  >
                    {action}
                  </AnimatedView>
                ))
              : null}
          </View>
          <Pressable
            role="button"
            accessibilityState={
              hasActions
                ? { ...accessibilityState, expanded: open }
                : accessibilityState
            }
            onPress={(event) => {
              if (hasActions) setOpen(!open)
              onPress?.(event)
            }}
            className={cn(
              "flex-row items-center justify-center rounded-full bg-accent shadow-lg active:bg-accent-pressed",
              size === "lg"
                ? extended
                  ? "h-16 gap-2.5 px-6"
                  : "size-16"
                : extended
                  ? "h-14 gap-2 px-5"
                  : "size-14",
              className
            )}
            {...props}
          >
            <AnimatedView style={rotateStyle}>
              <Icon
                as={open && icon !== PlusIcon ? XIcon : icon}
                weight="bold"
                className={cn(
                  "text-on-accent",
                  size === "lg" ? "size-7" : "size-6"
                )}
              />
            </AnimatedView>
            {extended ? (
              typeof label === "string" || typeof label === "number" ? (
                <Text className="text-base font-semibold text-on-accent">
                  {label}
                </Text>
              ) : (
                label
              )
            ) : null}
          </Pressable>
        </View>
      </FabContext.Provider>
    </Portal>
  )
}

function FabAction({
  icon,
  className,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  icon: PhosphorIcon
  children?: React.ReactNode
}) {
  const fab = React.useContext(FabContext)
  return (
    <Pressable
      role="button"
      className={cn("flex-row items-center gap-3", className)}
      onPress={(event) => {
        onPress?.(event)
        fab?.close()
      }}
      {...props}
    >
      {({ pressed }) => (
        <>
          {children !== undefined ? (
            <View className="rounded-full bg-surface-raised px-3 py-1.5 shadow-md dark:bg-surface-secondary">
              {pressed ? (
                <View className="absolute inset-0 rounded-full bg-item-pressed" />
              ) : null}
              {typeof children === "string" || typeof children === "number" ? (
                <Text numberOfLines={1} className="text-sm font-medium">
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
          ) : null}
          <View className="size-11 items-center justify-center rounded-full bg-surface-raised shadow-md dark:bg-surface-secondary">
            {pressed ? (
              <View className="absolute inset-0 rounded-full bg-item-pressed" />
            ) : null}
            <Icon as={icon} className="size-5" />
          </View>
        </>
      )}
    </Pressable>
  )
}

export type { FabSize }
export { Fab, FabAction }
