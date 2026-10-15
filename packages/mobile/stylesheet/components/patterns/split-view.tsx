import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native"
import * as React from "react"
import {
  AccessibilityInfo,
  I18nManager,
  Pressable,
  type Text as RNText,
  ScrollView,
  StyleSheet,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { useBackHandler } from "@/components/primitives/hooks"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type SplitViewColumn = "sidebar" | "list" | "detail"

type SplitViewContextProps = {
  isCompact: boolean
  column: SplitViewColumn
  setColumn: (column: SplitViewColumn) => void
  titles: Partial<Record<SplitViewColumn, React.ReactNode>>
  kinds: SplitViewColumn[]
}

const SplitViewContext = React.createContext<SplitViewContextProps | null>(null)

const SplitViewColumnContext = React.createContext<SplitViewColumn | null>(null)

function useSplitView() {
  const context = React.useContext(SplitViewContext)
  if (!context) {
    throw new Error("useSplitView must be used within a <SplitView />")
  }
  return context
}

const NEXT: Record<SplitViewColumn, SplitViewColumn> = {
  sidebar: "list",
  list: "detail",
  detail: "detail",
}

const PREVIOUS: Record<SplitViewColumn, SplitViewColumn | null> = {
  sidebar: null,
  list: "sidebar",
  detail: "list",
}

const RATIO: Record<SplitViewColumn, number> = {
  sidebar: 20,
  list: 32,
  detail: 48,
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  rootWide: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: radius["2xl"],
    borderWidth: 1,
  },
  back: {
    marginStart: -6,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-start",
    paddingEnd: 6,
  },
  pressed: { opacity: 0.6 },
  compactTitle: { paddingBottom: 8, ...fontSize["3xl"], fontWeight: "700" },
  sidebarTitle: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    ...fontSize.xs,
    fontWeight: "600",
  },
  detailTitle: { paddingBottom: 4, ...fontSize["2xl"], fontWeight: "600" },
  fill: { flex: 1 },
  pane: { minHeight: 0 },
  paneDivider: { borderStartWidth: 1 },
  sidebarPane: { padding: 12, paddingTop: 4 },
  listPane: { padding: 12 },
  detailPane: { padding: 32 },
  item: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemCompact: { minHeight: 44, borderBottomWidth: 1, paddingVertical: 12 },
  itemWide: {
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  itemWideList: { borderRadius: radius.xl, paddingVertical: 12 },
  itemBody: { minWidth: 0, flex: 1, gap: 2 },
})

const PANE_STYLE: Record<SplitViewColumn, ViewStyle> = {
  sidebar: styles.sidebarPane,
  list: styles.listPane,
  detail: styles.detailPane,
}

function titleStyle(
  kind: SplitViewColumn,
  isCompact: boolean,
  colors: ThemeColors
): TextStyle {
  if (isCompact) return styles.compactTitle
  if (kind === "sidebar") {
    return { ...styles.sidebarTitle, color: colors.mutedForeground }
  }
  return styles.detailTitle
}

type SplitViewPaneProps = ViewProps & {
  title?: React.ReactNode
}

function SplitView({
  column: columnProp,
  defaultColumn = "list",
  onColumnChange,
  breakpoint = 768,
  style,
  children,
  ...props
}: ViewProps & {
  column?: SplitViewColumn
  defaultColumn?: SplitViewColumn
  onColumnChange?: (column: SplitViewColumn) => void
  breakpoint?: number
}) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const isCompact = width < breakpoint
  const [uncontrolledColumn, setUncontrolledColumn] =
    React.useState(defaultColumn)
  const column = columnProp ?? uncontrolledColumn

  const panes = React.Children.toArray(children).filter(React.isValidElement)
  const titles: SplitViewContextProps["titles"] = {}
  const kinds: SplitViewColumn[] = []
  for (const pane of panes) {
    const kind = PANES.get(pane.type)
    if (!kind) continue
    kinds.push(kind)
    titles[kind] = (pane.props as { title?: React.ReactNode }).title
  }

  const setColumn = React.useCallback(
    (next: SplitViewColumn) => {
      if (columnProp === undefined) setUncontrolledColumn(next)
      onColumnChange?.(next)
    },
    [columnProp, onColumnChange]
  )

  const previous = PREVIOUS[column]
  const backColumn =
    previous && kinds.includes(previous) && titles[previous] !== undefined
      ? previous
      : null

  useBackHandler(isCompact && backColumn !== null, () => {
    if (backColumn) setColumn(backColumn)
  })

  const contextValue = { isCompact, column, setColumn, titles, kinds }

  return (
    <SplitViewContext.Provider value={contextValue}>
      <View
        style={[
          styles.root,
          !isCompact && [styles.rootWide, { borderColor: colors.border }],
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </SplitViewContext.Provider>
  )
}

function SplitViewPane({
  kind,
  title,
  style,
  children,
  ...props
}: SplitViewPaneProps & {
  kind: SplitViewColumn
}) {
  const { colors } = useTheme()
  const { isCompact, column, setColumn, titles, kinds } = useSplitView()
  const headingRef = React.useRef<RNText>(null)
  const mountedRef = React.useRef(false)
  const visible = !isCompact || column === kind
  const previous = PREVIOUS[kind]
  const backColumn =
    previous && kinds.includes(previous) && titles[previous] !== undefined
      ? previous
      : null
  const total = kinds.reduce((sum, item) => sum + RATIO[item], 0) || 1

  React.useEffect(() => {
    if (!isCompact || !visible) return
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    const node = headingRef.current
    if (!node) return
    const timeout = setTimeout(() => {
      AccessibilityInfo.sendAccessibilityEvent(node, "focus")
    }, 50)
    return () => clearTimeout(timeout)
  }, [isCompact, visible])

  if (!visible) return null

  const content = (
    <SplitViewColumnContext.Provider value={kind}>
      {isCompact && backColumn ? (
        <Pressable
          role="button"
          onPress={() => setColumn(backColumn)}
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Icon
            as={CaretLeftIcon}
            weight="bold"
            mirrored={I18nManager.isRTL}
            size={18}
            color={colors.primary}
          />
          <TextStyleContext.Provider
            value={{ ...fontSize.base, color: colors.primary }}
          >
            {typeof titles[backColumn] === "string" ? (
              <Text>{titles[backColumn]}</Text>
            ) : (
              titles[backColumn]
            )}
          </TextStyleContext.Provider>
        </Pressable>
      ) : null}
      {title !== undefined && (isCompact || kind !== "list") ? (
        <Text
          ref={headingRef as unknown as React.Ref<typeof RNText>}
          role="heading"
          style={titleStyle(kind, isCompact, colors)}
        >
          {title}
        </Text>
      ) : null}
      {children}
    </SplitViewColumnContext.Provider>
  )

  if (isCompact) {
    return (
      <AnimatedView
        key={kind}
        entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
        style={styles.fill}
        accessibilityLabel={typeof title === "string" ? title : undefined}
        {...props}
      >
        <ScrollView style={styles.fill} contentContainerStyle={style}>
          {content}
        </ScrollView>
      </AnimatedView>
    )
  }

  return (
    <View
      style={[
        styles.pane,
        kinds[0] !== kind && [
          styles.paneDivider,
          { borderColor: colors.border },
        ],
        { flex: RATIO[kind] / total },
      ]}
      accessibilityLabel={typeof title === "string" ? title : undefined}
      {...props}
    >
      <ScrollView
        style={styles.fill}
        contentContainerStyle={[PANE_STYLE[kind], style]}
      >
        {content}
      </ScrollView>
    </View>
  )
}

function SplitViewSidebar(props: SplitViewPaneProps) {
  return <SplitViewPane kind="sidebar" {...props} />
}

function SplitViewList(props: SplitViewPaneProps) {
  return <SplitViewPane kind="list" {...props} />
}

function SplitViewDetail(props: SplitViewPaneProps) {
  return <SplitViewPane kind="detail" {...props} />
}

const PANES = new Map<unknown, SplitViewColumn>([
  [SplitViewSidebar, "sidebar"],
  [SplitViewList, "list"],
  [SplitViewDetail, "detail"],
])

function SplitViewItem({
  isActive = false,
  style,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "style"> & {
  isActive?: boolean
  children?: React.ReactNode
  style?: ViewStyle
}) {
  const { colors } = useTheme()
  const { isCompact, setColumn } = useSplitView()
  const kind = React.useContext(SplitViewColumnContext) ?? "list"
  return (
    <Pressable
      role="button"
      accessibilityState={{ selected: isActive }}
      onPress={(event) => {
        onPress?.(event)
        setColumn(NEXT[kind])
      }}
      style={({ pressed }) => [
        styles.item,
        isCompact
          ? [styles.itemCompact, { borderColor: colors.border }]
          : [styles.itemWide, kind === "list" && styles.itemWideList],
        !isCompact && isActive && { backgroundColor: colors.muted },
        pressed && (isCompact || !isActive) && { opacity: 0.8 },
        style,
      ]}
      {...props}
    >
      <View style={styles.itemBody}>
        {typeof children === "string" || typeof children === "number" ? (
          <Text>{children}</Text>
        ) : (
          children
        )}
      </View>
      {isCompact && kind !== "detail" ? (
        <Icon
          as={CaretRightIcon}
          mirrored={I18nManager.isRTL}
          size={16}
          color={colors.mutedForeground}
        />
      ) : null}
    </Pressable>
  )
}

export {
  SplitView,
  type SplitViewColumn,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
  useSplitView,
}
