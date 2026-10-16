import { cn } from "cn"
import { CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, View, type ViewProps } from "react-native"
import {
  Easing,
  Keyframe,
  ReduceMotion,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useBackHandler } from "@/components/primitives/hooks"
import { Portal } from "@/components/primitives/portal"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type SelectionListContextProps = {
  editing: boolean
  setEditing: (editing: boolean) => void
  selected: string[]
  setSelected: (selected: string[]) => void
  toggle: (value: string) => void
  selectAll: () => void
  clear: () => void
}

const SelectionListContext =
  React.createContext<SelectionListContextProps | null>(null)

const SelectionListItemsContext = React.createContext<
  ((value: string) => () => void) | null
>(null)

function useSelectionList() {
  const context = React.useContext(SelectionListContext)
  if (!context) {
    throw new Error("useSelectionList must be used within a <SelectionList />")
  }
  return context
}

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const EMPTY: string[] = []

const BAR_ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 80 }, { scale: 0.95 }] },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
    easing: EASING,
  },
})
  .duration(400)
  .reduceMotion(ReduceMotion.System)

const BAR_EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
  100: {
    opacity: 0,
    transform: [{ translateY: 80 }, { scale: 0.95 }],
    easing: EASING,
  },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

function wrapText(children: React.ReactNode) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text className="font-semibold">{children}</Text>
  }
  return children
}

function SelectionList({
  editing: editingProp,
  defaultEditing = false,
  onEditingChange,
  value,
  defaultValue = EMPTY,
  onValueChange,
  className,
  ...props
}: ViewProps & {
  editing?: boolean
  defaultEditing?: boolean
  onEditingChange?: (editing: boolean) => void
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}) {
  const [uncontrolledEditing, setUncontrolledEditing] =
    React.useState(defaultEditing)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const editing = editingProp ?? uncontrolledEditing
  const selected = value ?? uncontrolledValue
  const valuesRef = React.useRef<string[]>([])

  const setSelected = React.useCallback(
    (next: string[]) => {
      if (next.length === 0 && selected.length === 0) return
      if (value === undefined) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [value, selected, onValueChange]
  )

  const setEditing = React.useCallback(
    (next: boolean) => {
      if (editingProp === undefined) setUncontrolledEditing(next)
      onEditingChange?.(next)
      if (!next) setSelected([])
    },
    [editingProp, onEditingChange, setSelected]
  )

  const register = React.useCallback((item: string) => {
    valuesRef.current = [...valuesRef.current, item]
    return () => {
      valuesRef.current = valuesRef.current.filter((entry) => entry !== item)
    }
  }, [])

  useBackHandler(editing, () => setEditing(false))

  const contextValue = React.useMemo<SelectionListContextProps>(
    () => ({
      editing,
      setEditing,
      selected,
      setSelected,
      toggle: (item) =>
        setSelected(
          selected.includes(item)
            ? selected.filter((entry) => entry !== item)
            : [...selected, item]
        ),
      selectAll: () => setSelected([...valuesRef.current]),
      clear: () => setSelected([]),
    }),
    [editing, setEditing, selected, setSelected]
  )

  return (
    <SelectionListContext.Provider value={contextValue}>
      <SelectionListItemsContext.Provider value={register}>
        <View className={className} {...props} />
      </SelectionListItemsContext.Provider>
    </SelectionListContext.Provider>
  )
}

function SelectionListTrigger({
  children,
  onPress,
  accessibilityState,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { editing, setEditing } = useSelectionList()
  return (
    <Button
      variant="plain"
      accessibilityState={{ ...accessibilityState, selected: editing }}
      onPress={(event) => {
        onPress?.(event)
        setEditing(!editing)
      }}
      {...props}
    >
      {typeof children === "function"
        ? children
        : wrapText(children ?? (editing ? "Done" : "Select"))}
    </Button>
  )
}

const EDIT_TIMING = {
  duration: 400,
  easing: EASING,
  reduceMotion: ReduceMotion.System,
}

const RING_TIMING = {
  duration: 300,
  easing: EASING,
  reduceMotion: ReduceMotion.System,
}

const CHECK_TIMING = { duration: 200, reduceMotion: ReduceMotion.System }

function SelectionListItem({
  value,
  className,
  children,
  onPress,
  accessibilityState,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  value: string
  children?: React.ReactNode
}) {
  const { editing, selected, toggle } = useSelectionList()
  const register = React.useContext(SelectionListItemsContext)
  const checked = selected.includes(value)

  React.useEffect(() => register?.(value), [register, value])

  const slotStyle = useAnimatedStyle(
    () => ({
      width: withTiming(editing ? 40 : 0, EDIT_TIMING),
      opacity: withTiming(editing ? 1 : 0, EDIT_TIMING),
    }),
    [editing]
  )

  const ringStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(editing ? 1 : 0.5, RING_TIMING) }],
    }),
    [editing]
  )

  const checkStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(checked ? 1 : 0, CHECK_TIMING) }],
    }),
    [checked]
  )

  return (
    <Pressable
      accessible={editing}
      disabled={!editing}
      role={editing ? "checkbox" : undefined}
      accessibilityState={{
        ...accessibilityState,
        ...(editing ? { checked } : undefined),
      }}
      onPress={(event) => {
        onPress?.(event)
        toggle(value)
      }}
      className={cn("flex-row items-center", checked && "bg-accent", className)}
      {...props}
    >
      <AnimatedView
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="shrink-0 flex-row items-center overflow-hidden"
        style={slotStyle}
      >
        <AnimatedView
          className={cn(
            "ms-4 size-5.5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-muted-foreground",
            checked && "border-primary bg-primary"
          )}
          style={ringStyle}
        >
          <AnimatedView style={checkStyle}>
            <Icon
              as={CheckIcon}
              weight="bold"
              className="size-3.5 text-primary-foreground"
            />
          </AnimatedView>
        </AnimatedView>
      </AnimatedView>
      <View
        className="min-w-0 flex-1 flex-row items-center"
        style={{ pointerEvents: editing ? "none" : "auto" }}
      >
        {children}
      </View>
    </Pressable>
  )
}

function SelectionListBar({
  className,
  portalHost,
  ...props
}: ViewProps & { portalHost?: string }) {
  const context = useSelectionList()
  const insets = useSafeAreaInsets()
  const id = React.useId()
  return (
    <Portal name={`selection-list-bar-${id}`} hostName={portalHost}>
      <SelectionListContext.Provider value={context}>
        {context.editing ? (
          <AnimatedView
            entering={BAR_ENTERING}
            exiting={BAR_EXITING}
            className="absolute z-40 items-center"
            style={{
              left: insets.left + 16,
              right: insets.right + 16,
              bottom: Math.max(16, insets.bottom),
              pointerEvents: "box-none",
            }}
          >
            <View
              role="toolbar"
              className={cn(
                "h-13 w-full max-w-md flex-row items-center justify-between gap-2 rounded-full border border-border bg-card px-1.5 shadow-xl dark:bg-muted",
                className
              )}
              {...props}
            />
          </AnimatedView>
        ) : null}
      </SelectionListContext.Provider>
    </Portal>
  )
}

function SelectionListCount({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { selected } = useSelectionList()
  return (
    <Text
      numberOfLines={1}
      accessibilityLiveRegion="polite"
      className={cn(
        "min-w-0 flex-1 text-center text-sm font-medium tabular-nums",
        className
      )}
      {...props}
    >
      {children ??
        (selected.length === 0
          ? "Select items"
          : `${selected.length} selected`)}
    </Text>
  )
}

export {
  SelectionList,
  SelectionListBar,
  SelectionListCount,
  SelectionListItem,
  SelectionListTrigger,
  useSelectionList,
}
