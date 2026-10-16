import * as React from "react"
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"
import {
  type BaseUIEventReason,
  createChangeEventDetails,
  REASONS,
} from "./event-details"
import {
  FloatingPortal,
  type FloatingRootActions,
  FloatingRootContext,
  type FloatingRootValue,
  type FocusTarget,
  useFloatingPopup,
  useFloatingRoot,
  useFloatingTrigger,
} from "./floating-root"
import {
  Positioner as PositionerPrimitive,
  type PositionerProps as PositionerPrimitiveProps,
  useOptionalPositionerContext,
  usePositionerContext,
} from "./positioner"
import type {
  Align,
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  ChangeEvent,
  Orientation,
  Side,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type SelectChangeEventReason = BaseUIEventReason

type SelectChangeEventDetails =
  BaseUIChangeEventDetails<SelectChangeEventReason>

interface SelectItemEntry {
  label: React.ReactNode
  value: unknown
}

interface SelectItemGroup {
  value: unknown
  items: readonly SelectItemEntry[]
}

type SelectItems =
  | Record<string, React.ReactNode>
  | readonly SelectItemEntry[]
  | readonly SelectItemGroup[]

type SelectValueType<
  Value,
  Multiple extends boolean | undefined,
> = Multiple extends true ? Value[] : Value

interface SelectRootContextValue {
  floating: FloatingRootValue
  value: unknown
  multiple: boolean
  readOnly: boolean
  hasValue: boolean
  isSelected: (itemValue: unknown) => boolean
  selectValue: (itemValue: unknown, event?: ChangeEvent) => void
  getLabel: (itemValue: unknown) => React.ReactNode
  registerLabel: (itemValue: unknown, label: React.ReactNode) => void
  labelId: string | undefined
  setLabelId: (id: string | undefined) => void
}

const SelectRootContext = React.createContext<SelectRootContextValue | null>(
  null
)

function useSelectRootContext(componentName = "Select part") {
  const context = React.useContext(SelectRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Select.Root`)
  }
  return context
}

function isGroup(entry: unknown): entry is SelectItemGroup {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "items" in entry &&
    Array.isArray((entry as SelectItemGroup).items)
  )
}

function findItemLabel(
  items: SelectItems | undefined,
  value: unknown,
  isEqual: (itemValue: unknown, value: unknown) => boolean
): { found: boolean; label: React.ReactNode } {
  if (!items) return { found: false, label: undefined }
  if (!Array.isArray(items)) {
    const record = items as Record<string, React.ReactNode>
    const key = String(value)
    if (key in record) return { found: true, label: record[key] }
    return { found: false, label: undefined }
  }
  for (const entry of items as readonly (SelectItemEntry | SelectItemGroup)[]) {
    if (isGroup(entry)) {
      const match = entry.items.find((item) => isEqual(item.value, value))
      if (match) return { found: true, label: match.label }
    } else if (isEqual(entry.value, value)) {
      return { found: true, label: entry.label }
    }
  }
  return { found: false, label: undefined }
}

interface RootProps<Value, Multiple extends boolean | undefined = false> {
  children?: React.ReactNode
  value?: SelectValueType<Value, Multiple> | null | undefined
  defaultValue?: SelectValueType<Value, Multiple> | null | undefined
  onValueChange?:
    | ((
        value:
          | SelectValueType<Value, Multiple>
          | (Multiple extends true ? never : null),
        details: SelectChangeEventDetails
      ) => void)
    | undefined
  multiple?: Multiple | undefined
  items?: SelectItems | undefined
  itemToStringLabel?: ((itemValue: Value) => string) | undefined
  isItemEqualToValue?: ((itemValue: Value, value: Value) => boolean) | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, details: SelectChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<FloatingRootActions | null> | undefined
  modal?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
}

function Root<Value, Multiple extends boolean | undefined = false>({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  multiple: multipleProp,
  items,
  itemToStringLabel,
  isItemEqualToValue,
  modal = true,
  disabled = false,
  readOnly = false,
  ...parameters
}: RootProps<Value, Multiple>) {
  const multiple = !!multipleProp
  const floating = useFloatingRoot<SelectChangeEventReason>({
    ...parameters,
    modal,
    disabled,
  })
  const labelsRef = React.useRef(new Map<unknown, React.ReactNode>())

  const [value, setValue] = useControllableState<
    unknown,
    SelectChangeEventDetails
  >({
    value: valueProp,
    defaultValue: defaultValue ?? (multiple ? [] : null),
    onChange: onValueChange as
      | ((value: unknown, details: SelectChangeEventDetails) => void)
      | undefined,
  })

  const isEqual = React.useCallback(
    (itemValue: unknown, current: unknown) =>
      isItemEqualToValue
        ? isItemEqualToValue(itemValue as Value, current as Value)
        : Object.is(itemValue, current),
    [isItemEqualToValue]
  )

  const isSelected = React.useCallback(
    (itemValue: unknown) => {
      if (multiple) {
        return (
          Array.isArray(value) &&
          value.some((entry: unknown) => isEqual(itemValue, entry))
        )
      }
      return value !== null && value !== undefined && isEqual(itemValue, value)
    },
    [multiple, value, isEqual]
  )

  const { setOpen } = floating

  const selectValue = React.useCallback(
    (itemValue: unknown, event?: ChangeEvent) => {
      const details = createChangeEventDetails<SelectChangeEventReason>(
        REASONS.itemPress,
        event
      )
      if (multiple) {
        setValue((previous: unknown) => {
          const current: unknown[] = Array.isArray(previous) ? previous : []
          return current.some((entry) => isEqual(itemValue, entry))
            ? current.filter((entry) => !isEqual(itemValue, entry))
            : [...current, itemValue]
        }, details)
        return
      }
      setValue(itemValue, details)
      setOpen(false, REASONS.itemPress, event)
    },
    [multiple, setValue, isEqual, setOpen]
  )

  const getLabel = React.useCallback(
    (itemValue: unknown): React.ReactNode => {
      const fromItems = findItemLabel(items, itemValue, isEqual)
      if (fromItems.found) return fromItems.label
      if (itemToStringLabel) return itemToStringLabel(itemValue as Value)
      for (const [key, label] of labelsRef.current) {
        if (isEqual(key, itemValue)) return label
      }
      if (itemValue === null || itemValue === undefined) return null
      return String(itemValue)
    },
    [items, itemToStringLabel, isEqual]
  )

  const registerLabel = React.useCallback(
    (itemValue: unknown, label: React.ReactNode) => {
      if (label === undefined) labelsRef.current.delete(itemValue)
      else labelsRef.current.set(itemValue, label)
    },
    []
  )

  const [labelId, setLabelId] = React.useState<string | undefined>(undefined)

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== null && value !== undefined

  const context = React.useMemo<SelectRootContextValue>(
    () => ({
      floating,
      value,
      multiple,
      readOnly,
      hasValue,
      isSelected,
      selectValue,
      getLabel,
      registerLabel,
      labelId,
      setLabelId,
    }),
    [
      floating,
      value,
      multiple,
      readOnly,
      hasValue,
      isSelected,
      selectValue,
      getLabel,
      registerLabel,
      labelId,
    ]
  )

  return (
    <SelectRootContext.Provider value={context}>
      <FloatingRootContext.Provider value={floating}>
        {children}
      </FloatingRootContext.Provider>
    </SelectRootContext.Provider>
  )
}

Root.displayName = "SelectRoot"

interface TriggerState {
  open: boolean
  disabled: boolean
  readOnly: boolean
  value: unknown
  placeholder: boolean
}

type TriggerProps = BaseUIComponentProps<typeof Pressable, TriggerState>

function Trigger({
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps) {
  const select = useSelectRootContext("Select.Trigger")
  const disabled = !!disabledProp || select.floating.disabled
  const trigger = useFloatingTrigger({
    root: select.floating,
    ref,
    disabled: disabled || select.readOnly,
    role: "combobox",
  })

  const { open } = select.floating
  const state = React.useMemo<TriggerState>(
    () => ({
      open,
      disabled,
      readOnly: select.readOnly,
      value: select.value,
      placeholder: !select.hasValue,
    }),
    [open, disabled, select.readOnly, select.value, select.hasValue]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: trigger.ref,
    props: [
      trigger.props,
      {
        accessibilityState: { expanded: open, disabled },
        accessibilityLabelledBy: select.labelId,
        disabled: disabled || undefined,
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "SelectTrigger"

interface LabelState {
  disabled: boolean
  readOnly: boolean
  open: boolean
}

type LabelProps = BaseUIComponentProps<typeof Text, LabelState>

function Label({
  nativeID: nativeIDProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: LabelProps) {
  const select = useSelectRootContext("Select.Label")
  const { setLabelId, readOnly } = select
  const { disabled, open } = select.floating
  const generatedId = React.useId()
  const nativeID = nativeIDProp ?? generatedId

  React.useEffect(() => {
    setLabelId(nativeID)
    return () => setLabelId(undefined)
  }, [setLabelId, nativeID])

  const state = React.useMemo<LabelState>(
    () => ({ disabled, readOnly, open }),
    [disabled, readOnly, open]
  )

  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    props: [{ nativeID }, elementProps],
  })
}

Label.displayName = "SelectLabel"

interface ValueState {
  value: unknown
  placeholder: boolean
}

type ValueProps = Omit<
  BaseUIComponentProps<typeof Text, ValueState>,
  "children"
> & {
  children?: React.ReactNode | ((value: unknown) => React.ReactNode)
  placeholder?: React.ReactNode
}

function Value({
  children,
  placeholder,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ValueProps) {
  const select = useSelectRootContext("Select.Value")
  const { value, hasValue, multiple, getLabel } = select

  const state = React.useMemo<ValueState>(
    () => ({ value, placeholder: !hasValue }),
    [value, hasValue]
  )

  let content: React.ReactNode
  if (typeof children === "function") {
    content = children(value)
  } else if (children !== undefined && children !== null) {
    content = children
  } else if (!hasValue) {
    content = placeholder
  } else if (multiple && Array.isArray(value)) {
    content = value.map((entry: unknown) => String(getLabel(entry))).join(", ")
  } else {
    content = getLabel(value)
  }

  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    props: [{ children: content }, elementProps],
  })
}

Value.displayName = "SelectValue"

interface IconState {
  open: boolean
}

type IconProps = BaseUIComponentProps<typeof View, IconState>

const HIDDEN_PROPS = {
  pointerEvents: "none",
  accessibilityElementsHidden: true,
  importantForAccessibility: "no-hide-descendants",
} as const

function Icon({ render, className, style, ref, ...elementProps }: IconProps) {
  const { open } = useSelectRootContext("Select.Icon").floating
  const state = React.useMemo<IconState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [HIDDEN_PROPS, elementProps],
  })
}

Icon.displayName = "SelectIcon"

interface PortalProps {
  children?: React.ReactNode
  keepMounted?: boolean | undefined
  hostName?: string | undefined
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const select = useSelectRootContext("Select.Portal")
  return (
    <FloatingPortal
      root={select.floating}
      keepMounted={keepMounted}
      hostName={hostName}
    >
      <SelectRootContext.Provider value={select}>
        {children}
      </SelectRootContext.Provider>
    </FloatingPortal>
  )
}

Portal.displayName = "SelectPortal"

type PositionerProps = Omit<PositionerPrimitiveProps, "root">

function Positioner({
  side = "bottom",
  align = "center",
  ...props
}: PositionerProps) {
  const select = useSelectRootContext("Select.Positioner")
  return (
    <PositionerPrimitive
      root={select.floating}
      side={side}
      align={align}
      {...props}
    />
  )
}

Positioner.displayName = "SelectPositioner"

interface PopupState {
  open: boolean
  side: Side
  align: Align
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState> & {
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
}

function Popup({
  initialFocus,
  finalFocus,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PopupProps) {
  const select = useSelectRootContext("Select.Popup")
  const positioner = useOptionalPositionerContext()
  const { open } = select.floating
  const popup = useFloatingPopup({
    root: select.floating,
    ref,
    ready: positioner ? positioner.isPositioned : true,
    initialFocus,
    finalFocus,
  })

  const side = positioner?.side ?? "bottom"
  const align = positioner?.align ?? "center"
  const state = React.useMemo<PopupState>(
    () => ({ open, side, align }),
    [open, side, align]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: popup.ref,
    props: [popup.props, elementProps],
    enabled: open || positioner !== null,
  })
}

Popup.displayName = "SelectPopup"

interface ListState {
  multiple: boolean
}

type ListProps = BaseUIComponentProps<typeof View, ListState>

function List({ render, className, style, ref, ...elementProps }: ListProps) {
  const { multiple } = useSelectRootContext("Select.List")
  const state = React.useMemo<ListState>(() => ({ multiple }), [multiple])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "list" }, elementProps],
  })
}

List.displayName = "SelectList"

interface ArrowState {
  open: boolean
  side: Side
  align: Align
  uncentered: boolean
}

type ArrowProps = BaseUIComponentProps<typeof View, ArrowState>

function Arrow({ render, className, style, ref, ...elementProps }: ArrowProps) {
  const positioner = usePositionerContext("Select.Arrow")
  const { setArrowSize } = positioner

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout
      setArrowSize({ width, height })
    },
    [setArrowSize]
  )

  React.useEffect(() => () => setArrowSize(null), [setArrowSize])

  const state = React.useMemo<ArrowState>(
    () => ({
      open: positioner.open,
      side: positioner.side,
      align: positioner.align,
      uncentered: positioner.arrow.uncentered,
    }),
    [
      positioner.open,
      positioner.side,
      positioner.align,
      positioner.arrow.uncentered,
    ]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      { style: positioner.arrowStyle, onLayout },
      HIDDEN_PROPS,
      elementProps,
    ],
  })
}

Arrow.displayName = "SelectArrow"

interface BackdropState {
  open: boolean
}

type BackdropProps = BaseUIComponentProps<typeof View, BackdropState>

function Backdrop({
  render,
  className,
  style,
  ref,
  ...elementProps
}: BackdropProps) {
  const { open } = useSelectRootContext("Select.Backdrop").floating
  const state = React.useMemo<BackdropState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ style: StyleSheet.absoluteFill }, HIDDEN_PROPS, elementProps],
    enabled: open,
  })
}

Backdrop.displayName = "SelectBackdrop"

interface ItemState {
  disabled: boolean
  selected: boolean
  highlighted: boolean
}

interface ItemContextValue extends ItemState {
  label: React.ReactNode
}

const ItemContext = React.createContext<ItemContextValue | null>(null)

function useItemContext(componentName: string) {
  const context = React.useContext(ItemContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Select.Item`)
  }
  return context
}

type ItemProps = BaseUIComponentProps<typeof Pressable, ItemState> & {
  value?: unknown
  label?: string | undefined
}

function Item({
  value = null,
  label,
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemProps) {
  const select = useSelectRootContext("Select.Item")
  const { selectValue, registerLabel, isSelected } = select
  const disabled = !!disabledProp
  const selected = isSelected(value)
  const [highlighted, setHighlighted] = React.useState(false)

  React.useEffect(() => {
    if (label !== undefined) registerLabel(value, label)
  }, [registerLabel, value, label])

  const onPressIn = React.useCallback(() => setHighlighted(true), [])
  const onPressOut = React.useCallback(() => setHighlighted(false), [])

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || select.readOnly) return
      selectValue(value, event)
    },
    [disabled, select.readOnly, selectValue, value]
  )

  const state = React.useMemo<ItemState>(
    () => ({ disabled, selected, highlighted }),
    [disabled, selected, highlighted]
  )

  const context = React.useMemo<ItemContextValue>(
    () => ({ ...state, label: label ?? select.getLabel(value) }),
    [state, label, select.getLabel, value]
  )

  const element = useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "option",
        accessibilityLabel: label,
        accessibilityState: { selected, disabled },
        disabled: disabled || undefined,
        onPress,
        onPressIn,
        onPressOut,
      },
      elementProps,
    ],
  })

  return <ItemContext.Provider value={context}>{element}</ItemContext.Provider>
}

Item.displayName = "SelectItem"

type ItemTextProps = BaseUIComponentProps<typeof Text, ItemState>

function ItemText({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemTextProps) {
  const item = useItemContext("Select.ItemText")
  const state = React.useMemo<ItemState>(
    () => ({
      disabled: item.disabled,
      selected: item.selected,
      highlighted: item.highlighted,
    }),
    [item.disabled, item.selected, item.highlighted]
  )

  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    props: [{ children: children ?? item.label }, elementProps],
  })
}

ItemText.displayName = "SelectItemText"

type ItemIndicatorProps = BaseUIComponentProps<typeof View, ItemState> & {
  keepMounted?: boolean | undefined
}

function ItemIndicator({
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemIndicatorProps) {
  const item = useItemContext("Select.ItemIndicator")
  const state = React.useMemo<ItemState>(
    () => ({
      disabled: item.disabled,
      selected: item.selected,
      highlighted: item.highlighted,
    }),
    [item.disabled, item.selected, item.highlighted]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [HIDDEN_PROPS, elementProps],
    enabled: keepMounted || item.selected,
  })
}

ItemIndicator.displayName = "SelectItemIndicator"

type GroupState = Record<never, never>

const EMPTY_STATE: GroupState = {}

interface GroupContextValue {
  setLabelId: (id: string | undefined) => void
}

const GroupContext = React.createContext<GroupContextValue | null>(null)

type GroupProps = BaseUIComponentProps<typeof View, GroupState>

function Group({ render, className, style, ref, ...elementProps }: GroupProps) {
  const [labelId, setLabelId] = React.useState<string | undefined>(undefined)
  const context = React.useMemo<GroupContextValue>(() => ({ setLabelId }), [])

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [{ role: "group", accessibilityLabelledBy: labelId }, elementProps],
  })

  return (
    <GroupContext.Provider value={context}>{element}</GroupContext.Provider>
  )
}

Group.displayName = "SelectGroup"

type GroupLabelProps = BaseUIComponentProps<typeof Text, GroupState>

function GroupLabel({
  nativeID: nativeIDProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: GroupLabelProps) {
  const generatedId = React.useId()
  const nativeID = nativeIDProp ?? generatedId
  const setLabelId = React.useContext(GroupContext)?.setLabelId

  React.useEffect(() => {
    if (!setLabelId) return
    setLabelId(nativeID)
    return () => setLabelId(undefined)
  }, [setLabelId, nativeID])

  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [{ nativeID }, elementProps],
  })
}

GroupLabel.displayName = "SelectGroupLabel"

interface SeparatorState {
  orientation: Orientation
}

type SeparatorProps = BaseUIComponentProps<typeof View, SeparatorState> & {
  orientation?: Orientation | undefined
}

function Separator({
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: SeparatorProps) {
  const state = React.useMemo<SeparatorState>(
    () => ({ orientation }),
    [orientation]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "separator" }, elementProps],
  })
}

Separator.displayName = "SelectSeparator"

export type {
  ArrowProps,
  ArrowState,
  BackdropProps,
  BackdropState,
  GroupLabelProps,
  GroupProps,
  GroupState,
  IconProps,
  IconState,
  ItemIndicatorProps,
  ItemProps,
  ItemState,
  ItemTextProps,
  LabelProps,
  LabelState,
  ListProps,
  ListState,
  PopupProps,
  PopupState,
  PortalProps,
  PositionerProps,
  RootProps,
  SelectChangeEventDetails,
  SelectChangeEventReason,
  SelectItemEntry,
  SelectItemGroup,
  SelectItems,
  SelectRootContextValue,
  SelectValueType,
  SeparatorProps,
  SeparatorState,
  TriggerProps,
  TriggerState,
  ValueProps,
  ValueState,
}
export {
  Arrow,
  Backdrop,
  Group,
  GroupLabel,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  List,
  Popup,
  Portal,
  Positioner,
  Root,
  Separator,
  Trigger,
  useSelectRootContext,
  Value,
}
