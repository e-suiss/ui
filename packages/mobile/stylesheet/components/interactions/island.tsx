import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import * as React from "react"
import {
  type AccessibilityActionEvent,
  AccessibilityInfo,
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import {
  ReduceMotion,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Svg, { Circle } from "react-native-svg"
import { useBackHandler } from "@/components/primitives/hooks"
import { Portal } from "@/components/primitives/portal"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon, IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, shadow, useTheme } from "@/components/ui/theme"

type IslandView = "hidden" | "compact" | "minimal" | "expanded" | "notice"

type IslandMode = "compact" | "minimal" | "expanded"

type IslandPartName = Exclude<IslandView, "hidden">

type IslandRegion = "leading" | "trailing" | "center" | "bottom"

type IslandNotice = {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  duration?: number
}

type IslandContextProps = {
  view: IslandView
  notice: IslandNotice | null
  expand: () => void
  collapse: () => void
  minimize: () => void
  notify: (notice: IslandNotice) => void
  dismiss: () => void
  registerActivity: () => () => void
}

type IslandSize = { width: number; height: number }

type IslandStageContextProps = {
  view: IslandView
  stageWidth: number
  reportSize: (part: IslandPartName, size: IslandSize) => void
}

const IslandContext = React.createContext<IslandContextProps | null>(null)

const IslandPauseContext = React.createContext<(paused: boolean) => void>(
  () => undefined
)

const IslandStageContext = React.createContext<IslandStageContextProps | null>(
  null
)

function useIsland() {
  const context = React.useContext(IslandContext)

  if (!context) {
    throw new Error("useIsland must be used within an <IslandProvider />")
  }

  return context
}

const NOTICE_DURATION = 4000

const HIDDEN_SIZE: IslandSize = { width: 126, height: 36 }

const MAX_WIDTH = 384

const SPRING = {
  damping: 22,
  stiffness: 260,
  mass: 1,
  reduceMotion: ReduceMotion.System,
}

const RADIUS: Record<IslandView, number> = {
  hidden: 18,
  compact: 18,
  minimal: 18,
  expanded: 28,
  notice: 28,
}

function islandView(
  notice: IslandNotice | null,
  mode: IslandMode,
  activityCount: number
): IslandView {
  if (notice) return "notice"
  if (activityCount <= 0) return "hidden"
  return mode
}

const styles = StyleSheet.create({
  part: { position: "absolute", top: 0 },
  notice: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  noticeIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  noticeBody: { minWidth: 0, flex: 1 },
  title: { ...fontSize.sm, fontWeight: "600" },
  description: { ...fontSize.sm },
  stage: { position: "absolute", top: 0, alignItems: "center" },
  backdrop: { ...StyleSheet.absoluteFill, zIndex: 40 },
  frame: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: "center",
  },
  island: { overflow: "hidden", ...shadow.xl },
  compact: {
    height: 36,
    minWidth: 144,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    paddingHorizontal: 10,
  },
  minimal: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  expanded: { width: "100%", flexDirection: "column", gap: 12, padding: 16 },
  expandedTop: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  spacer: { flex: 1 },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function plainText(node: React.ReactNode) {
  return typeof node === "string" || typeof node === "number"
    ? String(node)
    : ""
}

function wrapText(
  children: React.ReactNode,
  style: StyleProp<TextStyle>,
  numberOfLines?: number
) {
  if (typeof children === "string" || typeof children === "number") {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {children}
      </Text>
    )
  }
  return children
}

function IslandProvider({ children }: { children?: React.ReactNode }) {
  const [mode, setMode] = React.useState<IslandMode>("compact")
  const [notice, setNotice] = React.useState<
    (IslandNotice & { id: number }) | null
  >(null)
  const [activityCount, setActivityCount] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const idRef = React.useRef(0)

  const view = islandView(notice, mode, activityCount)

  const expand = React.useCallback(() => setMode("expanded"), [])

  const collapse = React.useCallback(() => setMode("compact"), [])

  const minimize = React.useCallback(() => setMode("minimal"), [])

  const dismiss = React.useCallback(() => {
    setNotice(null)
    setPaused(false)
  }, [])

  const notify = React.useCallback((next: IslandNotice) => {
    idRef.current += 1
    setNotice({ ...next, id: idRef.current })
  }, [])

  const registerActivity = React.useCallback(() => {
    setActivityCount((count) => count + 1)
    return () => {
      setActivityCount((count) => count - 1)
      setMode("compact")
    }
  }, [])

  React.useEffect(() => {
    if (!notice) return
    const message = [plainText(notice.title), plainText(notice.description)]
      .filter(Boolean)
      .join(", ")
    if (message) AccessibilityInfo.announceForAccessibility(message)
  }, [notice])

  React.useEffect(() => {
    if (!notice || paused) return
    const duration = notice.duration ?? NOTICE_DURATION
    if (!Number.isFinite(duration) || duration <= 0) return
    const timer = setTimeout(dismiss, duration)
    return () => clearTimeout(timer)
  }, [notice, paused, dismiss])

  const contextValue = React.useMemo(
    () => ({
      view,
      notice,
      expand,
      collapse,
      minimize,
      notify,
      dismiss,
      registerActivity,
    }),
    [
      view,
      notice,
      expand,
      collapse,
      minimize,
      notify,
      dismiss,
      registerActivity,
    ]
  )

  return (
    <IslandContext.Provider value={contextValue}>
      <IslandPauseContext.Provider value={setPaused}>
        {children}
      </IslandPauseContext.Provider>
    </IslandContext.Provider>
  )
}

function IslandPart({
  part,
  style,
  children,
}: {
  part: IslandPartName
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}) {
  const stage = React.useContext(IslandStageContext)
  const active = stage?.view === part
  const progress = useSharedValue(active ? 1 : 0)

  React.useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: active ? 300 : 150,
      reduceMotion: ReduceMotion.System,
    })
  }, [active, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.9 + progress.value * 0.1 }],
  }))

  return (
    <AnimatedView
      pointerEvents={active ? "box-none" : "none"}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? "auto" : "no-hide-descendants"}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout
        stage?.reportSize(part, { width, height })
      }}
      style={[styles.part, style, animatedStyle]}
    >
      {children}
    </AnimatedView>
  )
}

function IslandNoticeView({ current }: { current: IslandNotice | null }) {
  const { dismiss } = useIsland()
  const lastRef = React.useRef(current)
  if (current) lastRef.current = current
  const notice = current ?? lastRef.current
  const { colors } = useTheme()
  const stage = React.useContext(IslandStageContext)
  const width = Math.min((stage?.stageWidth ?? MAX_WIDTH) - 24, MAX_WIDTH)

  return (
    <IslandPart part="notice" style={{ width }}>
      <Pressable
        role="button"
        accessibilityActions={[{ name: "activate" }, { name: "dismiss" }]}
        onAccessibilityAction={(event) => {
          const action = event.nativeEvent.actionName
          if (action === "activate" || action === "dismiss") dismiss()
        }}
        onPress={dismiss}
        style={styles.notice}
      >
        {notice?.icon ? (
          <IconSizeContext.Provider value={24}>
            <View
              style={[
                styles.noticeIcon,
                { backgroundColor: withAlpha(colors.onMedia, 0.15) },
              ]}
            >
              {notice.icon}
            </View>
          </IconSizeContext.Provider>
        ) : null}
        <View style={styles.noticeBody}>
          {wrapText(notice?.title, styles.title, 1)}
          {notice?.description !== undefined
            ? wrapText(
                notice.description,
                [styles.description, { color: withAlpha(colors.onMedia, 0.7) }],
                1
              )
            : null}
        </View>
      </Pressable>
    </IslandPart>
  )
}

function IslandStage({
  width,
  stageWidth,
  stageHeight,
  children,
}: {
  width: SharedValue<number>
  stageWidth: number
  stageHeight: number
  children?: React.ReactNode
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    left: (width.value - stageWidth) / 2,
  }))

  return (
    <AnimatedView
      pointerEvents="box-none"
      style={[
        styles.stage,
        { width: stageWidth, height: stageHeight },
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedView>
  )
}

type IslandExpandedRegionProps = React.ComponentProps<typeof View> & {
  region: IslandRegion
}

const regionStyles = StyleSheet.create({
  leading: { flexShrink: 0 },
  trailing: { flexShrink: 0, alignItems: "flex-end" },
  center: { minWidth: 0, flex: 1 },
  bottom: { width: "100%", gap: 12 },
})

function IslandExpandedRegion({
  region,
  style,
  ...props
}: IslandExpandedRegionProps) {
  return <View style={[regionStyles[region], style]} {...props} />
}

type IslandRegions = Record<IslandRegion, React.ReactElement[]>

function collectRegions(
  children: React.ReactNode,
  regions: IslandRegions = {
    leading: [],
    trailing: [],
    center: [],
    bottom: [],
  }
) {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue
    if (child.type === React.Fragment) {
      collectRegions(
        (child.props as { children?: React.ReactNode }).children,
        regions
      )
    } else if (child.type === IslandExpandedRegion) {
      const { region } = child.props as IslandExpandedRegionProps
      regions[region].push(child)
    }
  }
  return regions
}

function IslandExpandedView({
  regions,
  accessibilityLabel,
}: {
  regions: IslandRegions
  accessibilityLabel?: string
}) {
  const { collapse } = useIsland()
  const stage = React.useContext(IslandStageContext)
  const width = Math.min((stage?.stageWidth ?? MAX_WIDTH) - 24, MAX_WIDTH)
  const hasTop =
    regions.leading.length > 0 ||
    regions.center.length > 0 ||
    regions.trailing.length > 0

  return (
    <IslandPart part="expanded" style={{ width }}>
      <View
        role="group"
        accessibilityLabel={accessibilityLabel}
        accessibilityActions={[{ name: "escape" }, { name: "collapse" }]}
        onAccessibilityAction={(event) => {
          const action = event.nativeEvent.actionName
          if (action === "escape" || action === "collapse") collapse()
        }}
        onAccessibilityEscape={collapse}
        style={styles.expanded}
      >
        {hasTop ? (
          <View style={styles.expandedTop}>
            {regions.leading}
            {regions.center.length > 0 ? (
              regions.center
            ) : (
              <View style={styles.spacer} />
            )}
            {regions.trailing}
          </View>
        ) : null}
        {regions.bottom}
      </View>
    </IslandPart>
  )
}

function Island({
  style,
  children,
  compactLeading,
  compactTrailing,
  minimal,
  accessibilityLabel,
  portalHost,
  ...props
}: React.ComponentProps<typeof View> & {
  compactLeading?: React.ReactNode
  compactTrailing?: React.ReactNode
  minimal?: React.ReactNode
  portalHost?: string
}) {
  const context = useIsland()
  const { colors } = useTheme()
  const setPaused = React.useContext(IslandPauseContext)
  const { notice, expand, collapse, dismiss, registerActivity } = context
  const insets = useSafeAreaInsets()
  const window = useWindowDimensions()
  const id = React.useId()
  const [sizes, setSizes] = React.useState<
    Partial<Record<IslandPartName, IslandSize>>
  >({})
  const width = useSharedValue(HIDDEN_SIZE.width)
  const height = useSharedValue(HIDDEN_SIZE.height)
  const radius = useSharedValue(RADIUS.hidden)
  const visible = useSharedValue(0)
  const translateY = useSharedValue(0)

  const hasCompact = compactLeading != null || compactTrailing != null
  const hasMinimal = minimal != null
  const active = hasCompact || hasMinimal

  React.useEffect(() => {
    if (!active) return
    return registerActivity()
  }, [active, registerActivity])

  let view: IslandView = context.view
  if (context.view === "minimal" && !hasMinimal) view = "compact"
  else if (context.view === "compact" && !hasCompact) view = "minimal"

  const regions = collectRegions(children)

  const reportSize = React.useCallback(
    (part: IslandPartName, size: IslandSize) => {
      setSizes((current) => {
        const previous = current[part]
        if (
          previous &&
          previous.width === size.width &&
          previous.height === size.height
        ) {
          return current
        }
        return { ...current, [part]: size }
      })
    },
    []
  )

  const target = view === "hidden" ? HIDDEN_SIZE : (sizes[view] ?? HIDDEN_SIZE)

  React.useEffect(() => {
    width.value = withSpring(target.width, SPRING)
    height.value = withSpring(target.height, SPRING)
    radius.value = withSpring(RADIUS[view], SPRING)
    visible.value = withTiming(view === "hidden" ? 0 : 1, {
      duration: view === "hidden" ? 400 : 300,
      reduceMotion: ReduceMotion.System,
    })
  }, [target.width, target.height, view, width, height, radius, visible])

  const swipeUp = React.useCallback(() => {
    if (view === "notice") dismiss()
    else if (view === "expanded") collapse()
  }, [view, dismiss, collapse])

  useBackHandler(view === "expanded", collapse)

  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-8, 8])
        .onStart(() => {
          runOnJS(setPaused)(true)
        })
        .onUpdate((event) => {
          translateY.value =
            event.translationY < 0
              ? event.translationY * 0.5
              : event.translationY * 0.15
        })
        .onEnd((event) => {
          translateY.value = withSpring(0, SPRING)
          runOnJS(setPaused)(false)
          if (event.translationY < -24 || event.velocityY < -500) {
            runOnJS(swipeUp)()
          }
        }),
    [translateY, setPaused, swipeUp]
  )

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: radius.value,
    opacity: visible.value,
    transform: [
      { translateY: translateY.value },
      { scale: 0.75 + visible.value * 0.25 },
    ],
  }))

  const stage = React.useMemo(
    () => ({ view, stageWidth: window.width, reportSize }),
    [view, window.width, reportSize]
  )

  const expandActions = [{ name: "activate" }, { name: "expand" }]

  const onExpandAction = (event: AccessibilityActionEvent) => {
    const action = event.nativeEvent.actionName
    if (action === "activate" || action === "expand") expand()
  }

  return (
    <Portal name={`island-${id}`} hostName={portalHost}>
      <IslandContext.Provider value={context}>
        <IslandPauseContext.Provider value={setPaused}>
          {view === "expanded" ? (
            <Pressable
              accessible={false}
              importantForAccessibility="no"
              onPress={collapse}
              style={styles.backdrop}
            />
          ) : null}
          <View
            pointerEvents="box-none"
            style={[styles.frame, { top: Math.max(12, insets.top + 4) }]}
          >
            <GestureDetector gesture={gesture}>
              <AnimatedView
                pointerEvents={view === "hidden" ? "none" : "auto"}
                onAccessibilityEscape={
                  view === "expanded" ? collapse : undefined
                }
                style={[
                  styles.island,
                  { backgroundColor: colors.media },
                  style,
                  animatedStyle,
                ]}
                {...props}
              >
                <TextStyleContext.Provider value={{ color: colors.onMedia }}>
                  <IconSizeContext.Provider value={20}>
                    <IslandStageContext.Provider value={stage}>
                      <IslandStage
                        width={width}
                        stageWidth={window.width}
                        stageHeight={window.height}
                      >
                        {hasCompact ? (
                          <IslandPart part="compact">
                            <Pressable
                              role="button"
                              accessibilityLabel={accessibilityLabel}
                              accessibilityState={{ expanded: false }}
                              accessibilityActions={expandActions}
                              onAccessibilityAction={onExpandAction}
                              onPress={expand}
                              style={styles.compact}
                            >
                              {compactLeading ?? <View />}
                              {compactTrailing ?? <View />}
                            </Pressable>
                          </IslandPart>
                        ) : null}
                        {hasMinimal ? (
                          <IslandPart part="minimal">
                            <Pressable
                              role="button"
                              accessibilityLabel={accessibilityLabel}
                              accessibilityState={{ expanded: false }}
                              accessibilityActions={expandActions}
                              onAccessibilityAction={onExpandAction}
                              onPress={expand}
                              style={styles.minimal}
                            >
                              {minimal}
                            </Pressable>
                          </IslandPart>
                        ) : null}
                        <IslandExpandedView
                          regions={regions}
                          accessibilityLabel={accessibilityLabel}
                        />
                        <IslandNoticeView current={notice} />
                      </IslandStage>
                    </IslandStageContext.Provider>
                  </IconSizeContext.Provider>
                </TextStyleContext.Provider>
              </AnimatedView>
            </GestureDetector>
          </View>
        </IslandPauseContext.Provider>
      </IslandContext.Provider>
    </Portal>
  )
}

const IslandRingValueContext = React.createContext(0)

const RING_RADIUS = 8

const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function IslandRingShape({ color, size, style }: PhosphorIconProps) {
  const value = React.useContext(IslandRingValueContext)
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      style={[style, { transform: [{ rotate: "-90deg" }] }]}
    >
      <Circle
        cx="10"
        cy="10"
        r={RING_RADIUS}
        fill="none"
        stroke={color}
        strokeOpacity={0.25}
        strokeWidth="2.5"
      />
      <Circle
        cx="10"
        cy="10"
        r={RING_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={
          RING_CIRCUMFERENCE * (1 - Math.min(Math.max(value, 0), 1))
        }
      />
    </Svg>
  )
}

function IslandRing({
  value,
  size = 20,
  color,
}: {
  value: number
  size?: number
  color?: string
}) {
  const { colors } = useTheme()
  return (
    <IslandRingValueContext.Provider value={value}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon as={IslandRingShape} size={size} color={color ?? colors.accent} />
      </View>
    </IslandRingValueContext.Provider>
  )
}

export type { IslandNotice, IslandRegion, IslandView }
export { Island, IslandExpandedRegion, IslandProvider, IslandRing, useIsland }
