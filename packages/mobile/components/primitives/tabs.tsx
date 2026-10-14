import * as React from "react"
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type LayoutRectangle,
  Pressable,
  View,
} from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  Orientation,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ActivationDirection = "left" | "right" | "up" | "down" | "none"

type ChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<
  ChangeEventReason,
  { activationDirection: ActivationDirection }
>

interface TabPosition {
  left: number
  right: number
  top: number
  bottom: number
}

interface TabSize {
  width: number
  height: number
}

interface RootState {
  orientation: Orientation
  tabActivationDirection: ActivationDirection
}

type ListState = RootState

interface TabState {
  disabled: boolean
  active: boolean
  orientation: Orientation
  tabActivationDirection: ActivationDirection
}

interface IndicatorState extends RootState {
  activeTabPosition: TabPosition | null
  activeTabSize: TabSize | null
}

interface PanelState extends RootState {
  hidden: boolean
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?:
    | ((value: string, eventDetails: ChangeEventDetails) => void)
    | undefined
  orientation?: Orientation | undefined
}

type ListProps = BaseUIComponentProps<typeof View, ListState>

type TabProps = Omit<
  BaseUIComponentProps<typeof Pressable, TabState>,
  "children"
> & {
  children?: React.ReactNode
  value: string
  disabled?: boolean | undefined
}

type IndicatorProps = BaseUIComponentProps<typeof View, IndicatorState>

type PanelProps = BaseUIComponentProps<typeof View, PanelState> & {
  value: string
  keepMounted?: boolean | undefined
}

interface RootContextValue {
  value: string | undefined
  orientation: Orientation
  tabActivationDirection: ActivationDirection
  state: RootState
  tabLayouts: ReadonlyMap<string, LayoutRectangle>
  setTabLayout: (value: string, layout: LayoutRectangle | null) => void
  selectTab: (
    value: string,
    event: GestureResponderEvent | undefined,
    trigger: View | null
  ) => boolean
}

interface ListContextValue {
  size: TabSize | null
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Tabs parts must be rendered inside Tabs.Root")
  }
  return context
}

const ListContext = React.createContext<ListContextValue | null>(null)

function useListContext() {
  const context = React.useContext(ListContext)
  if (!context) {
    throw new Error("Tabs.Indicator must be rendered inside Tabs.List")
  }
  return context
}

function getActivationDirection(
  previous: LayoutRectangle | undefined,
  next: LayoutRectangle | undefined,
  orientation: Orientation
): ActivationDirection {
  if (!previous || !next) return "none"
  if (orientation === "horizontal") {
    if (next.x > previous.x) return "right"
    if (next.x < previous.x) return "left"
    return "none"
  }
  if (next.y > previous.y) return "down"
  if (next.y < previous.y) return "up"
  return "none"
}

function isSameLayout(a: LayoutRectangle | undefined, b: LayoutRectangle) {
  return (
    a !== undefined &&
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height
  )
}

function Root({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const [value, setValue] = useControllableState<
    string | undefined,
    ChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as
      | ((value: string | undefined, eventDetails: ChangeEventDetails) => void)
      | undefined,
  })
  const [tabActivationDirection, setTabActivationDirection] =
    React.useState<ActivationDirection>("none")
  const [tabLayouts, setTabLayouts] = React.useState<
    ReadonlyMap<string, LayoutRectangle>
  >(() => new Map())

  const setTabLayout = React.useCallback(
    (tabValue: string, layout: LayoutRectangle | null) => {
      setTabLayouts((current) => {
        if (layout === null) {
          if (!current.has(tabValue)) return current
          const next = new Map(current)
          next.delete(tabValue)
          return next
        }
        if (isSameLayout(current.get(tabValue), layout)) return current
        const next = new Map(current)
        next.set(tabValue, layout)
        return next
      })
    },
    []
  )

  const selectTab = React.useCallback(
    (
      tabValue: string,
      event: GestureResponderEvent | undefined,
      trigger: View | null
    ) => {
      const activationDirection = getActivationDirection(
        value === undefined ? undefined : tabLayouts.get(value),
        tabLayouts.get(tabValue),
        orientation
      )
      const accepted = setValue(
        tabValue,
        createChangeEventDetails(REASONS.triggerPress, event, trigger, {
          activationDirection,
        })
      )
      if (accepted) setTabActivationDirection(activationDirection)
      return accepted
    },
    [value, tabLayouts, orientation, setValue]
  )

  const state = React.useMemo<RootState>(
    () => ({ orientation, tabActivationDirection }),
    [orientation, tabActivationDirection]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({
      value,
      orientation,
      tabActivationDirection,
      state,
      tabLayouts,
      setTabLayout,
      selectTab,
    }),
    [
      value,
      orientation,
      tabActivationDirection,
      state,
      tabLayouts,
      setTabLayout,
      selectTab,
    ]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: elementProps,
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "TabsRoot"

function List({ render, className, style, ref, ...elementProps }: ListProps) {
  const { state } = useRootContext()
  const [size, setSize] = React.useState<TabSize | null>(null)

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setSize((current) =>
      current && current.width === width && current.height === height
        ? current
        : { width, height }
    )
  }, [])

  const context = React.useMemo<ListContextValue>(() => ({ size }), [size])

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ accessibilityRole: "tablist", onLayout }, elementProps],
  })

  return <ListContext.Provider value={context}>{element}</ListContext.Provider>
}

List.displayName = "TabsList"

function Tab({
  value: tabValue,
  disabled = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TabProps) {
  const root = useRootContext()
  const { setTabLayout, selectTab } = root
  const active = root.value === tabValue
  const tabRef = React.useRef<View>(null)

  React.useEffect(
    () => () => setTabLayout(tabValue, null),
    [setTabLayout, tabValue]
  )

  const onLayout = (event: LayoutChangeEvent) => {
    setTabLayout(tabValue, event.nativeEvent.layout)
  }

  const onPress = (event: GestureResponderEvent) => {
    if (disabled || active) return
    selectTab(tabValue, event, tabRef.current)
  }

  const state = React.useMemo<TabState>(
    () => ({
      disabled,
      active,
      orientation: root.orientation,
      tabActivationDirection: root.tabActivationDirection,
    }),
    [disabled, active, root.orientation, root.tabActivationDirection]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: [ref, tabRef],
    props: [
      {
        accessibilityRole: "tab",
        accessibilityState: { selected: active, disabled },
        disabled,
        onPress,
        onLayout,
      },
      elementProps,
    ],
  })
}

Tab.displayName = "TabsTab"

function Indicator({
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps) {
  const root = useRootContext()
  const { size: listSize } = useListContext()
  const layout =
    root.value === undefined ? undefined : root.tabLayouts.get(root.value)

  const activeTabPosition = React.useMemo<TabPosition | null>(() => {
    if (!layout || !listSize) return null
    return {
      left: layout.x,
      top: layout.y,
      right: listSize.width - layout.x - layout.width,
      bottom: listSize.height - layout.y - layout.height,
    }
  }, [layout, listSize])

  const activeTabSize = React.useMemo<TabSize | null>(
    () => (layout ? { width: layout.width, height: layout.height } : null),
    [layout]
  )

  const state = React.useMemo<IndicatorState>(
    () => ({
      orientation: root.orientation,
      tabActivationDirection: root.tabActivationDirection,
      activeTabPosition,
      activeTabSize,
    }),
    [
      root.orientation,
      root.tabActivationDirection,
      activeTabPosition,
      activeTabSize,
    ]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: layout !== undefined,
    props: [
      {
        pointerEvents: "none",
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
        style: layout
          ? {
              position: "absolute",
              left: layout.x,
              top: layout.y,
              width: layout.width,
              height: layout.height,
            }
          : undefined,
      },
      elementProps,
    ],
  })
}

Indicator.displayName = "TabsIndicator"

const HIDDEN_STYLE = { display: "none" } as const

function Panel({
  value: panelValue,
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PanelProps) {
  const root = useRootContext()
  const hidden = root.value !== panelValue

  const state = React.useMemo<PanelState>(
    () => ({
      orientation: root.orientation,
      tabActivationDirection: root.tabActivationDirection,
      hidden,
    }),
    [root.orientation, root.tabActivationDirection, hidden]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: !hidden || keepMounted,
    props: [
      hidden
        ? {
            style: HIDDEN_STYLE,
            accessibilityElementsHidden: true,
            importantForAccessibility: "no-hide-descendants",
          }
        : null,
      elementProps,
    ],
  })
}

Panel.displayName = "TabsPanel"

export type {
  ActivationDirection,
  ChangeEventDetails,
  ChangeEventReason,
  IndicatorProps,
  IndicatorState,
  ListProps,
  ListState,
  PanelProps,
  PanelState,
  RootContextValue,
  RootProps,
  RootState,
  TabPosition,
  TabProps,
  TabSize,
  TabState,
}
export { Indicator, List, Panel, Root, Tab, useRootContext }
