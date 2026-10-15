import { ArrowDownIcon, ArrowUpIcon } from "phosphor-react-native"
import * as React from "react"
import {
  FlatList,
  type FlatListProps,
  Platform,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native"
import {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useComposedRefs } from "@/components/primitives/hooks"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type ViewableItemsChanged<T> = Parameters<
  NonNullable<FlatListProps<T>["onViewableItemsChanged"]>
>[0]

type MessageScrollerScrollDirection = "start" | "end"

type MessageScrollerScrollAlign = "start" | "center" | "end"

type MessageScrollerScrollOptions = {
  animated?: boolean
  align?: MessageScrollerScrollAlign
}

type MessageScrollerScrollable = {
  start: boolean
  end: boolean
}

type MessageScrollerVisibilityState = {
  currentAnchorId: string | null
  visibleMessageIds: string[]
}

type MessageScrollerOptions = {
  scrollEdgeThreshold?: number
}

type ScrollList = {
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void
  scrollToEnd: (params?: { animated?: boolean }) => void
  scrollToIndex: (params: {
    index: number
    animated?: boolean
    viewPosition?: number
  }) => void
}

const DEFAULT_SCROLL_EDGE_THRESHOLD = 8

const styles = StyleSheet.create({
  root: { position: "relative", minHeight: 0, flex: 1, overflow: "hidden" },
  viewport: { flex: 1 },
  contentContainer: { flexGrow: 1, gap: 32 },
  item: { minWidth: 0, flexShrink: 0, paddingHorizontal: 10 },
  buttonFrame: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    end: -6,
    height: 20,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingHorizontal: 6,
  },
  badgeText: { ...fontSize["2xs"], fontWeight: "600" },
})

const VIEW_POSITION: Record<MessageScrollerScrollAlign, number> = {
  start: 1,
  center: 0.5,
  end: 0,
}

class SnapshotStore<Snapshot> {
  private snapshot: Snapshot
  private readonly isEqual: (current: Snapshot, next: Snapshot) => boolean
  private readonly listeners = new Set<() => void>()

  constructor(
    initialSnapshot: Snapshot,
    isEqual: (current: Snapshot, next: Snapshot) => boolean
  ) {
    this.snapshot = initialSnapshot
    this.isEqual = isEqual
  }

  getSnapshot = () => this.snapshot

  setSnapshot(nextSnapshot: Snapshot) {
    if (this.isEqual(this.snapshot, nextSnapshot)) return
    this.snapshot = nextSnapshot
    for (const listener of this.listeners) listener()
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

class MessageScrollerController {
  readonly scrollableStore = new SnapshotStore<MessageScrollerScrollable>(
    { start: false, end: false },
    (current, next) => current.start === next.start && current.end === next.end
  )
  readonly unreadStore = new SnapshotStore<number>(0, Object.is)
  readonly visibilityStore = new SnapshotStore<MessageScrollerVisibilityState>(
    { currentAnchorId: null, visibleMessageIds: [] },
    (current, next) =>
      current.currentAnchorId === next.currentAnchorId &&
      current.visibleMessageIds.length === next.visibleMessageIds.length &&
      current.visibleMessageIds.every(
        (id, index) => id === next.visibleMessageIds[index]
      )
  )
  threshold: number
  private list: ScrollList | null = null
  private keys: string[] = []
  private offset = 0
  private viewport = 0
  private content = 0
  private pending: {
    index: number
    animated: boolean
    viewPosition: number
  } | null = null

  constructor(threshold: number) {
    this.threshold = threshold
  }

  setList = (list: ScrollList | null) => {
    this.list = list
  }

  setKeys(keys: string[]) {
    const previous = this.keys
    this.keys = keys
    if (previous.length === 0 || keys.length === 0) return
    const newest = previous.at(-1)
    if (newest === undefined || keys.at(-1) === newest) return
    const index = keys.lastIndexOf(newest)
    if (index < 0 || this.offset <= this.threshold) return
    this.unreadStore.setSnapshot(
      this.unreadStore.getSnapshot() + keys.length - 1 - index
    )
  }

  setOffset(offset: number) {
    this.offset = offset
    this.sync()
  }

  setViewport(height: number) {
    this.viewport = height
    this.sync()
  }

  setContent(height: number) {
    this.content = height
    this.sync()
  }

  setVisible(ids: string[]) {
    this.visibilityStore.setSnapshot({
      currentAnchorId: ids[0] ?? null,
      visibleMessageIds: ids,
    })
  }

  private sync() {
    const end = this.offset > this.threshold
    const start = this.offset + this.viewport < this.content - this.threshold
    if (!end) this.unreadStore.setSnapshot(0)
    this.scrollableStore.setSnapshot({ start, end })
  }

  scrollToEnd = ({ animated = true }: MessageScrollerScrollOptions = {}) => {
    if (!this.list) return false
    this.list.scrollToOffset({ offset: 0, animated })
    return true
  }

  scrollToStart = ({ animated = true }: MessageScrollerScrollOptions = {}) => {
    if (!this.list) return false
    this.list.scrollToEnd({ animated })
    return true
  }

  scrollToMessage = (
    messageId: string,
    { animated = true, align = "start" }: MessageScrollerScrollOptions = {}
  ) => {
    const position = this.keys.lastIndexOf(messageId)
    if (!this.list || position < 0) return false
    const index = this.keys.length - 1 - position
    const viewPosition = VIEW_POSITION[align]
    this.pending = { index, animated, viewPosition }
    this.list.scrollToIndex({ index, animated, viewPosition })
    return true
  }

  handleScrollToIndexFailed = (info: {
    index: number
    averageItemLength: number
  }) => {
    const pending = this.pending
    this.pending = null
    if (!this.list || !pending || pending.index !== info.index) return
    this.list.scrollToOffset({
      offset: info.averageItemLength * info.index,
      animated: false,
    })
    setTimeout(() => {
      this.list?.scrollToIndex({
        index: pending.index,
        animated: pending.animated,
        viewPosition: pending.viewPosition,
      })
    }, 50)
  }
}

const MessageScrollerContext =
  React.createContext<MessageScrollerController | null>(null)

function useMessageScrollerController(threshold: number) {
  const [controller] = React.useState(
    () => new MessageScrollerController(threshold)
  )
  controller.threshold = threshold
  return controller
}

function useMessageScrollerContext() {
  const controller = React.useContext(MessageScrollerContext)
  if (!controller) {
    throw new Error(
      "useMessageScroller must be used within a <MessageScrollerProvider /> or <MessageScroller />"
    )
  }
  return controller
}

function useMessageScroller() {
  const { scrollToEnd, scrollToMessage, scrollToStart } =
    useMessageScrollerContext()
  return { scrollToEnd, scrollToMessage, scrollToStart }
}

function useMessageScrollerScrollable() {
  const { scrollableStore } = useMessageScrollerContext()
  return React.useSyncExternalStore(
    scrollableStore.subscribe,
    scrollableStore.getSnapshot,
    scrollableStore.getSnapshot
  )
}

function useMessageScrollerUnreadCount() {
  const { unreadStore } = useMessageScrollerContext()
  return React.useSyncExternalStore(
    unreadStore.subscribe,
    unreadStore.getSnapshot,
    unreadStore.getSnapshot
  )
}

function useMessageScrollerVisibility() {
  const { visibilityStore } = useMessageScrollerContext()
  return React.useSyncExternalStore(
    visibilityStore.subscribe,
    visibilityStore.getSnapshot,
    visibilityStore.getSnapshot
  )
}

function MessageScrollerProvider({
  children,
  scrollEdgeThreshold = DEFAULT_SCROLL_EDGE_THRESHOLD,
}: MessageScrollerOptions & { children?: React.ReactNode }) {
  const controller = useMessageScrollerController(scrollEdgeThreshold)
  return (
    <MessageScrollerContext.Provider value={controller}>
      {children}
    </MessageScrollerContext.Provider>
  )
}

function MessageScroller({ style, ...props }: ViewProps) {
  const parent = React.useContext(MessageScrollerContext)
  const own = useMessageScrollerController(DEFAULT_SCROLL_EDGE_THRESHOLD)
  return (
    <MessageScrollerContext.Provider value={parent ?? own}>
      <View style={[styles.root, style]} {...props} />
    </MessageScrollerContext.Provider>
  )
}

type MessageScrollerViewportProps<T> = Omit<
  FlatListProps<T>,
  | "data"
  | "inverted"
  | "keyExtractor"
  | "renderItem"
  | "onEndReached"
  | "getItemLayout"
  | "initialScrollIndex"
  | "onScrollToIndexFailed"
> &
  React.RefAttributes<FlatList<T>> & {
    data: readonly T[]
    keyExtractor: (item: T, index: number) => string
    renderItem: (info: { item: T; index: number }) => React.ReactElement | null
    onLoadOlder?: () => void
  }

function MessageScrollerViewport<T>({
  data,
  keyExtractor,
  renderItem,
  onLoadOlder,
  onEndReachedThreshold = 0.5,
  style,
  contentContainerStyle,
  keyboardDismissMode = Platform.OS === "ios" ? "interactive" : "on-drag",
  keyboardShouldPersistTaps = "handled",
  scrollEventThrottle = 16,
  maintainVisibleContentPosition,
  onScroll,
  onLayout,
  onContentSizeChange,
  onViewableItemsChanged,
  ref,
  ...props
}: MessageScrollerViewportProps<T>) {
  const controller = useMessageScrollerContext()
  const composedRef = useComposedRefs<FlatList<T>>(ref, controller.setList)
  const reversed = React.useMemo(() => [...data].reverse(), [data])
  const keys = React.useMemo(
    () => data.map((item, index) => keyExtractor(item, index)),
    [data, keyExtractor]
  )
  const keysRef = React.useRef(keys)
  keysRef.current = keys
  const viewableRef = React.useRef(onViewableItemsChanged)
  viewableRef.current = onViewableItemsChanged

  React.useLayoutEffect(() => {
    controller.setKeys(keys)
  }, [controller, keys])

  const handleViewableItemsChanged = React.useCallback(
    (info: ViewableItemsChanged<T>) => {
      const ids = info.viewableItems
        .filter((token) => token.index !== null)
        .sort((a, b) => (b.index ?? 0) - (a.index ?? 0))
        .map((token) => token.key)
      controller.setVisible(ids)
      viewableRef.current?.(info)
    },
    [controller]
  )

  return (
    <FlatList
      ref={composedRef}
      data={reversed}
      inverted
      keyExtractor={(item, index) =>
        keyExtractor(item, reversed.length - 1 - index)
      }
      renderItem={({ item, index }) =>
        renderItem({ item, index: reversed.length - 1 - index })
      }
      onEndReached={onLoadOlder ? () => onLoadOlder() : undefined}
      onEndReachedThreshold={onEndReachedThreshold}
      maintainVisibleContentPosition={
        maintainVisibleContentPosition ?? {
          minIndexForVisible: 0,
          autoscrollToTopThreshold: controller.threshold,
        }
      }
      keyboardDismissMode={keyboardDismissMode}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollEventThrottle={scrollEventThrottle}
      style={[styles.viewport, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      onScroll={(event) => {
        controller.setOffset(event.nativeEvent.contentOffset.y)
        onScroll?.(event)
      }}
      onLayout={(event) => {
        controller.setViewport(event.nativeEvent.layout.height)
        onLayout?.(event)
      }}
      onContentSizeChange={(width, height) => {
        controller.setContent(height)
        onContentSizeChange?.(width, height)
      }}
      onViewableItemsChanged={handleViewableItemsChanged}
      onScrollToIndexFailed={controller.handleScrollToIndexFailed}
      {...props}
    />
  )
}

function MessageScrollerItem({ style, ...props }: ViewProps) {
  return <View style={[styles.item, style]} {...props} />
}

const ENTER_EASING = Easing.bezier(0.23, 1, 0.32, 1)

const EXIT_EASING = Easing.bezier(0.7, 0, 0.84, 0)

function MessageScrollerButton({
  direction = "end",
  animated = true,
  variant = "secondary",
  size = "icon-sm",
  style,
  children,
  accessibilityLabel,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  children?: React.ReactNode
  direction?: MessageScrollerScrollDirection
  animated?: boolean
}) {
  const { colors, isDark } = useTheme()
  const controller = useMessageScrollerContext()
  const scrollable = useMessageScrollerScrollable()
  const unread = useMessageScrollerUnreadCount()
  const active = scrollable[direction]
  const count = direction === "end" ? unread : 0
  const progress = useSharedValue(active ? 1 : 0)
  const sign = direction === "end" ? 1 : -1

  React.useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: active ? 200 : 400,
      easing: active ? ENTER_EASING : EXIT_EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [active, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 32 * sign },
      { scale: 0.95 + progress.value * 0.05 },
    ],
  }))

  let label = "Scroll to end"
  if (direction === "start") label = "Scroll to start"
  else if (count > 0) {
    label = `Scroll to end, ${count} new ${count === 1 ? "message" : "messages"}`
  }
  const pressedBackground = isDark ? colors.secondary : colors.muted
  const idleBackground = isDark ? colors.muted : colors.card

  return (
    <AnimatedView
      pointerEvents={active ? "box-none" : "none"}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? "auto" : "no-hide-descendants"}
      style={[
        styles.buttonFrame,
        direction === "end" ? { bottom: 16 } : { top: 16 },
        animatedStyle,
      ]}
    >
      <Button
        variant={variant}
        size={size}
        accessibilityLabel={accessibilityLabel ?? label}
        style={(state) => [
          {
            borderColor: colors.border,
            backgroundColor: state.pressed ? pressedBackground : idleBackground,
          },
          typeof style === "function" ? style(state) : style,
        ]}
        onPress={(event) => {
          onPress?.(event)
          if (direction === "start") controller.scrollToStart({ animated })
          else controller.scrollToEnd({ animated })
        }}
        {...props}
      >
        {children ?? (
          <Icon as={direction === "start" ? ArrowUpIcon : ArrowDownIcon} />
        )}
        {count > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text
              style={[styles.badgeText, { color: colors.primaryForeground }]}
            >
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        ) : null}
      </Button>
    </AnimatedView>
  )
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerUnreadCount,
  useMessageScrollerVisibility,
}
