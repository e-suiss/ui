import { cn } from "cn"
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native"
import * as React from "react"
import {
  AccessibilityInfo,
  I18nManager,
  Pressable,
  type Text as RNText,
  ScrollView,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { useBackHandler } from "@/components/primitives/hooks"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

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

const TITLE_CLASS: Record<SplitViewColumn, string> = {
  sidebar: "px-3 pt-3 pb-2 text-xs font-semibold text-muted-foreground",
  list: "",
  detail: "pb-1 text-2xl font-semibold",
}

const PANE_CLASS: Record<SplitViewColumn, string> = {
  sidebar: "p-3 pt-1",
  list: "p-3",
  detail: "p-8",
}

type SplitViewPaneProps = ViewProps & {
  title?: React.ReactNode
}

function SplitView({
  column: columnProp,
  defaultColumn = "list",
  onColumnChange,
  breakpoint = 768,
  className,
  children,
  ...props
}: ViewProps & {
  column?: SplitViewColumn
  defaultColumn?: SplitViewColumn
  onColumnChange?: (column: SplitViewColumn) => void
  breakpoint?: number
}) {
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
        className={cn(
          "flex-1",
          !isCompact &&
            "flex-row overflow-hidden rounded-2xl border border-border",
          className
        )}
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
  className,
  children,
  ...props
}: SplitViewPaneProps & {
  kind: SplitViewColumn
}) {
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
          className="-ms-1.5 min-h-11 flex-row items-center gap-0.5 self-start pe-1.5 active:opacity-60"
        >
          <Icon
            as={CaretLeftIcon}
            weight="bold"
            mirrored={I18nManager.isRTL}
            className="size-4.5 text-primary"
          />
          <TextClassContext.Provider value="text-base text-primary">
            {typeof titles[backColumn] === "string" ? (
              <Text>{titles[backColumn]}</Text>
            ) : (
              titles[backColumn]
            )}
          </TextClassContext.Provider>
        </Pressable>
      ) : null}
      {title !== undefined && (isCompact || kind !== "list") ? (
        <Text
          ref={headingRef as unknown as React.Ref<typeof RNText>}
          role="heading"
          className={isCompact ? "pb-2 text-3xl font-bold" : TITLE_CLASS[kind]}
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
        className="flex-1"
        accessibilityLabel={typeof title === "string" ? title : undefined}
        {...props}
      >
        <ScrollView className="flex-1" contentContainerClassName={className}>
          {content}
        </ScrollView>
      </AnimatedView>
    )
  }

  return (
    <View
      className={cn("min-h-0", kinds[0] !== kind && "border-s border-border")}
      style={{ flex: RATIO[kind] / total }}
      accessibilityLabel={typeof title === "string" ? title : undefined}
      {...props}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName={cn(PANE_CLASS[kind], className)}
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
  className,
  children,
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  isActive?: boolean
  children?: React.ReactNode
}) {
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
      className={cn(
        "flex-row items-center gap-3",
        isCompact
          ? "min-h-11 border-b border-border py-3 active:opacity-80"
          : cn(
              "rounded-lg px-3 py-2",
              isActive ? "bg-muted" : "active:opacity-80",
              kind === "list" && "rounded-xl py-3"
            ),
        typeof className === "string" ? className : undefined
      )}
      {...props}
    >
      <View className="min-w-0 flex-1 gap-0.5">
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
          className="size-4 text-muted-foreground"
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
