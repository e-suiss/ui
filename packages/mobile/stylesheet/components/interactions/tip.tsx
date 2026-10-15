import { XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import {
  Easing,
  FadeInDown,
  FadeOut,
  Keyframe,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PopoverPrimitive from "@/components/primitives/popover"
import type { Align, Side } from "@/components/primitives/types"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon, IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

type TipStorage = {
  getItem: (key: string) => string | null | Promise<string | null>
  setItem: (key: string, value: string) => void | Promise<void>
}

type TipContextProps = {
  id: string
  titleId: string
  visible: boolean
  dismiss: () => void
  anchorRef: React.RefObject<View | null>
}

type TipGroupContextProps = {
  current: string | null
  storage: TipStorage
  register: (id: string) => () => void
  resolve: (id: string, dismissed: boolean) => void
  complete: (id: string) => void
}

const TipContext = React.createContext<TipContextProps | null>(null)

const TipGroupContext = React.createContext<TipGroupContextProps | null>(null)

function useTip() {
  const context = React.useContext(TipContext)
  if (!context) {
    throw new Error("useTip must be used within a <Tip />")
  }
  return context
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: radius["2xl"],
    padding: 16,
    paddingEnd: 48,
  },
  anchor: { flexDirection: "row", alignSelf: "flex-start" },
  positioner: { zIndex: 50 },
  popup: {
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    padding: 16,
    paddingEnd: 48,
    ...shadow.lg,
  },
  arrow: { width: 16, height: 16 },
  arrowSquare: {
    width: 12,
    height: 12,
    borderRadius: radius.xs,
    transform: [{ translateX: 2 }, { translateY: 2 }, { rotate: "45deg" }],
  },
  icon: { flexShrink: 0, flexDirection: "row" },
  content: { minWidth: 0, flex: 1, flexDirection: "column", gap: 2 },
  title: { ...fontSize.base, fontWeight: "600" },
  description: { ...fontSize.sm },
  close: {
    position: "absolute",
    end: 8,
    top: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
})

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

const STORAGE_PREFIX = "tip:"

const DISMISSED = "dismissed"

const memory = new Map<string, string>()

const memoryStorage: TipStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value)
  },
}

async function resetTips(ids: string[], storage: TipStorage = memoryStorage) {
  try {
    await Promise.all(ids.map((id) => storage.setItem(STORAGE_PREFIX + id, "")))
    return true
  } catch {
    return false
  }
}

function TipGroup({
  storage = memoryStorage,
  children,
}: {
  storage?: TipStorage
  children?: React.ReactNode
}) {
  const [order, setOrder] = React.useState<string[]>([])
  const [resolved, setResolved] = React.useState<string[]>([])
  const [completed, setCompleted] = React.useState<string[]>([])

  let current: string | null = null
  for (const id of order) {
    if (completed.includes(id)) continue
    current = resolved.includes(id) ? id : null
    break
  }

  const register = React.useCallback((id: string) => {
    setOrder((ids) => (ids.includes(id) ? ids : [...ids, id]))
    return () => setOrder((ids) => ids.filter((entry) => entry !== id))
  }, [])

  const resolve = React.useCallback((id: string, dismissed: boolean) => {
    if (dismissed) setCompleted((ids) => [...ids, id])
    else setResolved((ids) => [...ids, id])
  }, [])

  const complete = React.useCallback((id: string) => {
    setCompleted((ids) => [...ids, id])
  }, [])

  const contextValue = React.useMemo(
    () => ({ current, storage, register, resolve, complete }),
    [current, storage, register, resolve, complete]
  )

  return (
    <TipGroupContext.Provider value={contextValue}>
      {children}
    </TipGroupContext.Provider>
  )
}

function Tip({
  id,
  delay = 0,
  onDismiss,
  children,
}: {
  id: string
  delay?: number
  onDismiss?: () => void
  children?: React.ReactNode
}) {
  const group = React.useContext(TipGroupContext)
  const storage = group?.storage ?? memoryStorage
  const [stored, setStored] = React.useState<boolean | null>(null)
  const [ready, setReady] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)
  const anchorRef = React.useRef<View>(null)
  const titleId = `${React.useId()}-title`
  const register = group?.register
  const resolve = group?.resolve
  const complete = group?.complete
  const turn = !group || group.current === id
  const visible = ready && turn && !dismissed && stored === false

  React.useEffect(() => register?.(id), [register, id])

  React.useEffect(() => {
    let cancelled = false
    Promise.resolve(storage.getItem(STORAGE_PREFIX + id))
      .catch(() => null)
      .then((value) => {
        if (cancelled) return
        const isDismissed = value === DISMISSED
        setStored(isDismissed)
        resolve?.(id, isDismissed)
      })
    return () => {
      cancelled = true
    }
  }, [storage, id, resolve])

  React.useEffect(() => {
    if (stored !== false || !turn) return
    const timer = setTimeout(() => setReady(true), delay)
    return () => clearTimeout(timer)
  }, [stored, turn, delay])

  const dismiss = React.useCallback(() => {
    setDismissed(true)
    Promise.resolve(storage.setItem(STORAGE_PREFIX + id, DISMISSED)).catch(
      () => undefined
    )
    complete?.(id)
    onDismiss?.()
  }, [storage, id, complete, onDismiss])

  const contextValue = React.useMemo(
    () => ({ id, titleId, visible, dismiss, anchorRef }),
    [id, titleId, visible, dismiss]
  )

  return (
    <TipContext.Provider value={contextValue}>{children}</TipContext.Provider>
  )
}

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

function TipCard({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  const { visible } = useTip()
  if (!visible) return null
  return (
    <AnimatedView
      entering={FadeInDown.duration(400)
        .easing(EASING)
        .reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.System)}
    >
      <View
        role="note"
        style={[styles.card, { backgroundColor: colors.muted }, style]}
        {...props}
      />
    </AnimatedView>
  )
}

function TipAnchor({ style, ...props }: ViewProps) {
  const { anchorRef, visible, dismiss } = useTip()
  return (
    <View
      ref={anchorRef}
      collapsable={false}
      onStartShouldSetResponderCapture={() => {
        if (visible) dismiss()
        return false
      }}
      style={[styles.anchor, style]}
      {...props}
    />
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.9 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: EASING },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

const EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.9 }], easing: EASING },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

const ARROW_OFFSET: Record<Side, ViewStyle> = {
  top: { bottom: -8 },
  bottom: { top: -8 },
  left: { right: -8 },
  right: { left: -8 },
}

function TipPopover({
  style,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 10,
  portalHost,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> & {
  side?: Side
  align?: Align
  sideOffset?: number
  portalHost?: string
}) {
  const { colors, isDark } = useTheme()
  const tip = useTip()
  const { visible, dismiss, anchorRef, titleId } = tip
  const { width } = useWindowDimensions()
  return (
    <PopoverPrimitive.Root
      open={visible}
      modal={false}
      onOpenChange={(open) => {
        if (!open) dismiss()
      }}
    >
      <PopoverPrimitive.Portal hostName={portalHost}>
        <FullWindowOverlay>
          <PopoverPrimitive.Positioner
            anchor={anchorRef}
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={16}
            style={styles.positioner}
          >
            <PopoverPrimitive.Popup
              initialFocus={false}
              finalFocus={false}
              accessibilityLabelledBy={titleId}
              render={<AnimatedView entering={ENTERING} exiting={EXITING} />}
              style={(state): StyleProp<ViewStyle> => [
                styles.popup,
                {
                  width: Math.min(320, width - 32),
                  borderColor: withAlpha(
                    colors.foreground,
                    isDark ? 0.1 : 0.05
                  ),
                  backgroundColor: colors.popover,
                },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            >
              <PopoverPrimitive.Arrow
                style={(state) => [styles.arrow, ARROW_OFFSET[state.side]]}
              >
                <View
                  style={[
                    styles.arrowSquare,
                    { backgroundColor: colors.popover },
                  ]}
                />
              </PopoverPrimitive.Arrow>
              <TextStyleContext.Provider
                value={{ ...fontSize.base, color: colors.foreground }}
              >
                <TipContext.Provider value={tip}>
                  {children}
                </TipContext.Provider>
              </TextStyleContext.Provider>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </FullWindowOverlay>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function TipIcon({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider value={{ color: colors.primary }}>
      <IconSizeContext.Provider value={32}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.icon, style]}
          {...props}
        />
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function TipContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />
}

function TipTitle({ style, ...props }: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  const { titleId } = useTip()
  return (
    <Text
      nativeID={titleId}
      style={[styles.title, { color: colors.foreground }, style]}
      {...props}
    />
  )
}

function TipDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.description, { color: colors.mutedForeground }, style]}
      {...props}
    />
  )
}

function TipClose({
  style,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children">) {
  const { colors } = useTheme()
  const { dismiss } = useTip()
  return (
    <Pressable
      role="button"
      accessibilityLabel="Dismiss tip"
      hitSlop={6}
      onPress={(event) => {
        onPress?.(event)
        dismiss()
      }}
      style={(state): StyleProp<ViewStyle> => [
        styles.close,
        state.pressed && { opacity: 0.8 },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <Icon as={XIcon} weight="bold" size={16} color={colors.mutedForeground} />
    </Pressable>
  )
}

export type { TipStorage }
export {
  resetTips,
  Tip,
  TipAnchor,
  TipCard,
  TipClose,
  TipContent,
  TipDescription,
  TipGroup,
  TipIcon,
  TipPopover,
  TipTitle,
  useTip,
}
