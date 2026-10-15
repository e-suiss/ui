import {
  type Icon as PhosphorIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import {
  I18nManager,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native"
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
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

type FabSize = "default" | "lg"

const FabContext = React.createContext<{ close: () => void } | null>(null)

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const styles = StyleSheet.create({
  scrim: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 40,
  },
  frame: { position: "absolute", zIndex: 40, alignItems: "flex-end" },
  actions: { alignItems: "flex-end", gap: 12 },
  actionsOpen: { marginBottom: 16 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    ...shadow.lg,
  },
  default: { width: 56, height: 56 },
  lg: { width: 64, height: 64 },
  defaultExtended: { height: 56, gap: 8, paddingHorizontal: 20 },
  lgExtended: { height: 64, gap: 10, paddingHorizontal: 24 },
  label: { ...fontSize.base, fontWeight: "600" },
  action: { flexDirection: "row", alignItems: "center", gap: 12 },
  pill: {
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...shadow.md,
  },
  pillText: { ...fontSize.sm, fontWeight: "500" },
  circle: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    ...shadow.md,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
  },
})

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
  style,
  children,
  onPress,
  accessibilityState,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children" | "style"> & {
  style?: StyleProp<ViewStyle>
  size?: FabSize
  icon?: PhosphorIcon
  label?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  portalHost?: string
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
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
  const extendedKey = size === "lg" ? "lgExtended" : "defaultExtended"
  const compactKey = size === "lg" ? "lg" : "default"
  const labelNode =
    typeof label === "string" || typeof label === "number" ? (
      <Text style={[styles.label, { color: colors.onAccent }]}>{label}</Text>
    ) : (
      label
    )

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
            style={[styles.scrim, { backgroundColor: colors.scrim }]}
            onPress={close}
          />
        ) : null}
        <View
          style={[
            styles.frame,
            {
              bottom: insets.bottom + 16,
              end: (I18nManager.isRTL ? insets.left : insets.right) + 16,
              pointerEvents: "box-none",
            },
          ]}
        >
          <View
            onAccessibilityEscape={close}
            style={[
              styles.actions,
              open && styles.actionsOpen,
              { pointerEvents: "box-none" },
            ]}
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
            style={({ pressed }) => [
              styles.button,
              styles[extended ? extendedKey : compactKey],
              {
                backgroundColor: pressed ? colors.accentPressed : colors.accent,
              },
              style,
            ]}
            {...props}
          >
            <AnimatedView style={rotateStyle}>
              <Icon
                as={open && icon !== PlusIcon ? XIcon : icon}
                weight="bold"
                size={size === "lg" ? 28 : 24}
                color={colors.onAccent}
              />
            </AnimatedView>
            {extended ? labelNode : null}
          </Pressable>
        </View>
      </FabContext.Provider>
    </Portal>
  )
}

function FabAction({
  icon,
  style,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children" | "style"> & {
  icon: PhosphorIcon
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}) {
  const { colors, isDark } = useTheme()
  const raised = {
    backgroundColor: isDark ? colors.surfaceSecondary : colors.surfaceRaised,
  }
  const overlay = [styles.overlay, { backgroundColor: colors.itemPressed }]
  const fab = React.useContext(FabContext)
  return (
    <Pressable
      role="button"
      style={[styles.action, style]}
      onPress={(event) => {
        onPress?.(event)
        fab?.close()
      }}
      {...props}
    >
      {({ pressed }) => (
        <>
          {children !== undefined ? (
            <View style={[styles.pill, raised]}>
              {pressed ? <View style={overlay} /> : null}
              {typeof children === "string" || typeof children === "number" ? (
                <Text numberOfLines={1} style={styles.pillText}>
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
          ) : null}
          <View style={[styles.circle, raised]}>
            {pressed ? <View style={overlay} /> : null}
            <Icon as={icon} size={20} />
          </View>
        </>
      )}
    </Pressable>
  )
}

export type { FabSize }
export { Fab, FabAction }
