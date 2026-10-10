import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  Orientation,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type AccordionValue = string[]

type ChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

interface RootState {
  value: AccordionValue
  disabled: boolean
  orientation: Orientation
}

interface ItemState extends RootState {
  open: boolean
  index: number
}

type HeaderState = ItemState

type TriggerState = ItemState

type PanelState = ItemState

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  value?: AccordionValue | undefined
  defaultValue?: AccordionValue | undefined
  onValueChange?:
    | ((value: AccordionValue, eventDetails: ChangeEventDetails) => void)
    | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  keepMounted?: boolean | undefined
  orientation?: Orientation | undefined
}

type ItemProps = BaseUIComponentProps<typeof View, ItemState> & {
  value?: string | undefined
  disabled?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
}

type HeaderProps = BaseUIComponentProps<typeof View, HeaderState>

type TriggerProps = Omit<
  BaseUIComponentProps<typeof Pressable, TriggerState>,
  "children"
> & {
  children?: React.ReactNode
}

type PanelProps = BaseUIComponentProps<typeof View, PanelState> & {
  keepMounted?: boolean | undefined
}

interface RootContextValue {
  value: AccordionValue
  multiple: boolean
  disabled: boolean
  keepMounted: boolean
  orientation: Orientation
  state: RootState
  setItemOpen: (
    itemValue: string,
    open: boolean,
    eventDetails: ChangeEventDetails
  ) => boolean
  registerItem: (itemValue: string) => () => void
  items: readonly string[]
}

interface ItemContextValue {
  value: string
  open: boolean
  disabled: boolean
  state: ItemState
  setOpen: (open: boolean, eventDetails: ChangeEventDetails) => boolean
}

const EMPTY_VALUE: AccordionValue = []

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Accordion parts must be rendered inside Accordion.Root")
  }
  return context
}

const ItemContext = React.createContext<ItemContextValue | null>(null)

function useItemContext() {
  const context = React.useContext(ItemContext)
  if (!context) {
    throw new Error("Accordion parts must be rendered inside Accordion.Item")
  }
  return context
}

function Root({
  value: valueProp,
  defaultValue = EMPTY_VALUE,
  onValueChange,
  multiple = false,
  disabled = false,
  keepMounted = false,
  orientation = "vertical",
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const [value, setValue] = useControllableState<
    AccordionValue,
    ChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  })

  const [items, setItems] = React.useState<readonly string[]>([])

  const registerItem = React.useCallback((itemValue: string) => {
    setItems((current) =>
      current.includes(itemValue) ? current : [...current, itemValue]
    )
    return () => {
      setItems((current) => current.filter((entry) => entry !== itemValue))
    }
  }, [])

  const setItemOpen = React.useCallback(
    (itemValue: string, open: boolean, eventDetails: ChangeEventDetails) =>
      setValue((current) => {
        if (open) {
          if (current.includes(itemValue)) return current
          return multiple ? [...current, itemValue] : [itemValue]
        }
        if (!current.includes(itemValue)) return current
        return current.filter((entry) => entry !== itemValue)
      }, eventDetails),
    [multiple, setValue]
  )

  const state = React.useMemo<RootState>(
    () => ({ value, disabled, orientation }),
    [value, disabled, orientation]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({
      value,
      multiple,
      disabled,
      keepMounted,
      orientation,
      state,
      setItemOpen,
      registerItem,
      items,
    }),
    [
      value,
      multiple,
      disabled,
      keepMounted,
      orientation,
      state,
      setItemOpen,
      registerItem,
      items,
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

Root.displayName = "AccordionRoot"

function Item({
  value: valueProp,
  disabled: disabledProp = false,
  onOpenChange,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemProps) {
  const root = useRootContext()
  const generatedValue = React.useId()
  const value = valueProp ?? generatedValue
  const disabled = root.disabled || disabledProp
  const open = root.value.includes(value)
  const index = root.items.indexOf(value)
  const { registerItem, setItemOpen } = root

  React.useLayoutEffect(() => registerItem(value), [registerItem, value])

  const state = React.useMemo<ItemState>(
    () => ({
      value: root.value,
      orientation: root.orientation,
      disabled,
      open,
      index,
    }),
    [root.value, root.orientation, disabled, open, index]
  )

  const setOpen = React.useCallback(
    (nextOpen: boolean, eventDetails: ChangeEventDetails) => {
      onOpenChange?.(nextOpen, eventDetails)
      if (eventDetails.isCanceled) return false
      return setItemOpen(value, nextOpen, eventDetails)
    },
    [onOpenChange, setItemOpen, value]
  )

  const context = React.useMemo<ItemContextValue>(
    () => ({ value, open, disabled, state, setOpen }),
    [value, open, disabled, state, setOpen]
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

  return <ItemContext.Provider value={context}>{element}</ItemContext.Provider>
}

Item.displayName = "AccordionItem"

function Header({
  render,
  className,
  style,
  ref,
  ...elementProps
}: HeaderProps) {
  const { state } = useItemContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ accessibilityRole: "header" }, elementProps],
  })
}

Header.displayName = "AccordionHeader"

function Trigger({
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps) {
  const { open, disabled, state, setOpen } = useItemContext()
  const triggerRef = React.useRef<View>(null)

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    setOpen(
      !open,
      createChangeEventDetails(REASONS.triggerPress, event, triggerRef.current)
    )
  }

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: [ref, triggerRef],
    props: [
      {
        accessibilityRole: "button",
        accessibilityState: { expanded: open, disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "AccordionTrigger"

const HIDDEN_STYLE = { display: "none" } as const

function Panel({
  keepMounted: keepMountedProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PanelProps) {
  const root = useRootContext()
  const { open, state } = useItemContext()
  const keepMounted = keepMountedProp ?? root.keepMounted

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: open || keepMounted,
    props: [
      open
        ? null
        : {
            style: HIDDEN_STYLE,
            accessibilityElementsHidden: true,
            importantForAccessibility: "no-hide-descendants",
          },
      elementProps,
    ],
  })
}

Panel.displayName = "AccordionPanel"

export type {
  AccordionValue,
  ChangeEventDetails,
  ChangeEventReason,
  HeaderProps,
  HeaderState,
  ItemContextValue,
  ItemProps,
  ItemState,
  PanelProps,
  PanelState,
  RootContextValue,
  RootProps,
  RootState,
  TriggerProps,
  TriggerState,
}
export { Header, Item, Panel, Root, Trigger, useItemContext, useRootContext }
