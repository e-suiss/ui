import * as React from "react"
import {
  AccessibilityInfo,
  type GestureResponderEvent,
  type HostInstance,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputChangeEvent,
  View,
} from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import {
  FloatingPortal,
  type FloatingRootActions,
  FloatingRootContext,
  type FloatingRootValue,
  type FocusTarget,
  useFloatingPopup,
  useFloatingRoot,
} from "./floating-root"
import { fontFamily } from "./font"
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

const COMBOBOX_REASONS = {
  ...REASONS,
  inputChange: "input-change",
  inputClear: "input-clear",
  inputPress: "input-press",
  clearPress: "clear-press",
  chipRemovePress: "chip-remove-press",
} as const

type ComboboxChangeEventReason =
  (typeof COMBOBOX_REASONS)[keyof typeof COMBOBOX_REASONS]

type ComboboxChangeEventDetails =
  BaseUIChangeEventDetails<ComboboxChangeEventReason>

type SelectionMode = "single" | "multiple" | "none"

interface ComboboxItemGroup<Item = unknown> {
  value: unknown
  items: readonly Item[]
}

type ComboboxItems<Item = unknown> =
  | readonly Item[]
  | readonly ComboboxItemGroup<Item>[]

type ComboboxFilter<Item = unknown> = (
  item: Item,
  query: string,
  itemToString?: (item: Item) => string
) => boolean

type ComboboxValueType<
  Value,
  Multiple extends boolean | undefined,
> = Multiple extends true ? Value[] : Value

type ItemRenderer = {
  bivarianceHack(item: unknown, index: number): React.ReactNode
}["bivarianceHack"]

type ValueRenderer = {
  bivarianceHack(value: unknown): React.ReactNode
}["bivarianceHack"]

type Locale = string | readonly string[] | undefined

const ANCHOR_PRIORITY = {
  trigger: 1,
  input: 2,
  group: 3,
} as const

const HIDDEN_PROPS = {
  pointerEvents: "none",
  accessibilityElementsHidden: true,
  importantForAccessibility: "no-hide-descendants",
} as const

function isGroup(entry: unknown): entry is ComboboxItemGroup {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "items" in entry &&
    Array.isArray((entry as ComboboxItemGroup).items)
  )
}

function defaultItemToStringLabel(item: unknown): string {
  if (item === null || item === undefined) return ""
  if (typeof item === "object" && "label" in item) {
    return String((item as { label: unknown }).label)
  }
  return String(item)
}

function defaultItemToStringValue(item: unknown): string {
  if (item === null || item === undefined) return ""
  if (typeof item === "object" && "value" in item) {
    return String((item as { value: unknown }).value)
  }
  return defaultItemToStringLabel(item)
}

function normalize(text: string, locale: Locale) {
  return text.toLocaleLowerCase(locale as string | string[] | undefined).trim()
}

function createFilter(locale: Locale) {
  function match(
    mode: "contains" | "startsWith" | "endsWith",
    item: unknown,
    query: string,
    itemToString: (item: unknown) => string = defaultItemToStringLabel
  ) {
    const needle = normalize(query, locale)
    if (!needle) return true
    const haystack = normalize(itemToString(item), locale)
    if (mode === "startsWith") return haystack.startsWith(needle)
    if (mode === "endsWith") return haystack.endsWith(needle)
    return haystack.includes(needle)
  }
  return {
    contains: (
      item: unknown,
      query: string,
      itemToString?: (item: unknown) => string
    ) => match("contains", item, query, itemToString),
    startsWith: (
      item: unknown,
      query: string,
      itemToString?: (item: unknown) => string
    ) => match("startsWith", item, query, itemToString),
    endsWith: (
      item: unknown,
      query: string,
      itemToString?: (item: unknown) => string
    ) => match("endsWith", item, query, itemToString),
  }
}

interface UseFilterOptions {
  locale?: Locale
}

function useFilter({ locale }: UseFilterOptions = {}) {
  return React.useMemo(() => createFilter(locale), [locale])
}

function filterItems(
  items: ComboboxItems | undefined,
  predicate: ((item: unknown) => boolean) | null,
  limit: number | undefined
): readonly unknown[] {
  if (!items) return []
  const max =
    limit === undefined || limit < 0 ? Number.POSITIVE_INFINITY : limit
  let count = 0
  const result: unknown[] = []
  for (const entry of items as readonly unknown[]) {
    if (count >= max) break
    if (isGroup(entry)) {
      const groupItems: unknown[] = []
      for (const item of entry.items) {
        if (count >= max) break
        if (predicate && !predicate(item)) continue
        groupItems.push(item)
        count += 1
      }
      if (groupItems.length > 0) result.push({ ...entry, items: groupItems })
    } else if (!predicate || predicate(entry)) {
      result.push(entry)
      count += 1
    }
  }
  return result
}

function countItems(items: readonly unknown[]) {
  let count = 0
  for (const entry of items) {
    count += isGroup(entry) ? entry.items.length : 1
  }
  return count
}

interface ComboboxRootContextValue {
  floating: FloatingRootValue
  selectionMode: SelectionMode
  multiple: boolean
  value: unknown
  inputValue: string
  hasValue: boolean
  readOnly: boolean
  disabled: boolean
  openOnInputClick: boolean
  filteredItems: readonly unknown[]
  itemCount: number
  empty: boolean
  labelId: string | undefined
  setLabelId: (id: string | undefined) => void
  isSelected: (itemValue: unknown) => boolean
  selectItem: (itemValue: unknown, event?: ChangeEvent) => void
  removeItem: (itemValue: unknown, event?: ChangeEvent) => void
  clear: (event?: ChangeEvent) => void
  changeInputValue: (text: string, event?: TextInputChangeEvent) => void
  itemToStringLabel: (itemValue: unknown) => string
  registerAnchor: (priority: number, node: HostInstance | null) => void
}

const ComboboxRootContext =
  React.createContext<ComboboxRootContextValue | null>(null)

function useComboboxRootContext(componentName = "Combobox part") {
  const context = React.useContext(ComboboxRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Combobox.Root`)
  }
  return context
}

const AnchorGroupContext = React.createContext(false)

const PopupPresenceContext = React.createContext(false)

function useAnchorRef(priority: number, enabled: boolean) {
  const { registerAnchor } = useComboboxRootContext()
  return React.useCallback(
    (node: HostInstance | null) => {
      if (!enabled) return
      registerAnchor(priority, node)
      return () => registerAnchor(priority, null)
    },
    [enabled, registerAnchor, priority]
  )
}

interface UseComboboxRootParameters {
  selectionMode: SelectionMode
  value?: unknown
  defaultValue?: unknown
  onValueChange?:
    | ((value: unknown, details: ComboboxChangeEventDetails) => void)
    | undefined
  inputValue?: string | undefined
  defaultInputValue?: string | undefined
  onInputValueChange?:
    | ((value: string, details: ComboboxChangeEventDetails) => void)
    | undefined
  items?: ComboboxItems | undefined
  filteredItems?: ComboboxItems | undefined
  filter?: ComboboxFilter | null | undefined
  limit?: number | undefined
  locale?: Locale
  itemToStringLabel?: ((itemValue: unknown) => string) | undefined
  itemToStringValue?: ((itemValue: unknown) => string) | undefined
  isItemEqualToValue?:
    | ((itemValue: unknown, value: unknown) => boolean)
    | undefined
  fillInputOnItemPress?: boolean | undefined
  openOnInputClick?: boolean | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, details: ComboboxChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<FloatingRootActions | null> | undefined
  modal?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
}

function useComboboxRoot({
  selectionMode,
  value: valueProp,
  defaultValue,
  onValueChange,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputValueChange,
  items,
  filteredItems: filteredItemsProp,
  filter,
  limit,
  locale,
  itemToStringLabel: itemToStringLabelProp,
  itemToStringValue: itemToStringValueProp,
  isItemEqualToValue,
  fillInputOnItemPress = true,
  openOnInputClick = true,
  modal = false,
  disabled = false,
  readOnly = false,
  ...parameters
}: UseComboboxRootParameters): ComboboxRootContextValue {
  const multiple = selectionMode === "multiple"
  const single = selectionMode === "single"
  const floating = useFloatingRoot<ComboboxChangeEventReason>({
    ...parameters,
    onOpenChange: parameters.onOpenChange as
      | ((
          open: boolean,
          details: BaseUIChangeEventDetails<ComboboxChangeEventReason>
        ) => void)
      | undefined,
    modal,
    disabled,
  })
  const { open, setOpen, triggerRef, measureAnchor } = floating
  const anchorsRef = React.useRef(new Map<number, HostInstance>())
  const [labelId, setLabelId] = React.useState<string | undefined>(undefined)

  const itemToStringLabel = React.useCallback(
    (itemValue: unknown) =>
      itemToStringLabelProp
        ? itemToStringLabelProp(itemValue)
        : defaultItemToStringLabel(itemValue),
    [itemToStringLabelProp]
  )

  const itemToStringValue = React.useCallback(
    (itemValue: unknown) =>
      itemToStringValueProp
        ? itemToStringValueProp(itemValue)
        : defaultItemToStringValue(itemValue),
    [itemToStringValueProp]
  )

  const [value, setValue] = useControllableState<
    unknown,
    ComboboxChangeEventDetails
  >({
    value: valueProp,
    defaultValue: defaultValue ?? (multiple ? [] : null),
    onChange: onValueChange,
  })

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== null && value !== undefined

  const selectedLabel = single && hasValue ? itemToStringLabel(value) : ""

  const [inputValue, setInputValue] = useControllableState<
    string,
    ComboboxChangeEventDetails
  >({
    value: inputValueProp,
    defaultValue: defaultInputValue ?? selectedLabel,
    onChange: onInputValueChange,
  })

  const isEqual = React.useCallback(
    (itemValue: unknown, current: unknown) =>
      isItemEqualToValue
        ? isItemEqualToValue(itemValue, current)
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
      if (!single) return false
      return value !== null && value !== undefined && isEqual(itemValue, value)
    },
    [multiple, single, value, isEqual]
  )

  const query =
    single && hasValue && inputValue === selectedLabel ? "" : inputValue

  const filteredItems = React.useMemo(() => {
    if (filteredItemsProp) return filteredItemsProp as readonly unknown[]
    if (filter === null || !query) return filterItems(items, null, limit)
    const predicate = filter
      ? (item: unknown) => filter(item, query, itemToStringLabel)
      : (item: unknown) =>
          createFilter(locale).contains(item, query, itemToStringLabel)
    return filterItems(items, predicate, limit)
  }, [
    filteredItemsProp,
    filter,
    query,
    items,
    limit,
    locale,
    itemToStringLabel,
  ])

  const itemCount = countItems(filteredItems)

  const changeInputValue = React.useCallback(
    (text: string, event?: TextInputChangeEvent) => {
      setInputValue(
        text,
        createChangeEventDetails<ComboboxChangeEventReason>(
          COMBOBOX_REASONS.inputChange,
          event
        )
      )
      if (single && text === "" && hasValue) {
        setValue(
          null,
          createChangeEventDetails<ComboboxChangeEventReason>(
            COMBOBOX_REASONS.inputClear,
            event
          )
        )
      }
      if (!open) setOpen(true, COMBOBOX_REASONS.inputChange, event)
    },
    [setInputValue, single, hasValue, setValue, open, setOpen]
  )

  const selectItem = React.useCallback(
    (itemValue: unknown, event?: ChangeEvent) => {
      const details = createChangeEventDetails<ComboboxChangeEventReason>(
        COMBOBOX_REASONS.itemPress,
        event
      )
      if (multiple) {
        setValue((previous: unknown) => {
          const current: unknown[] = Array.isArray(previous) ? previous : []
          return current.some((entry) => isEqual(itemValue, entry))
            ? current.filter((entry) => !isEqual(itemValue, entry))
            : [...current, itemValue]
        }, details)
        setInputValue(
          "",
          createChangeEventDetails<ComboboxChangeEventReason>(
            COMBOBOX_REASONS.itemPress,
            event
          )
        )
        return
      }
      if (single) setValue(itemValue, details)
      if (fillInputOnItemPress) {
        setInputValue(
          single || !itemToStringValueProp
            ? itemToStringLabel(itemValue)
            : itemToStringValue(itemValue),
          createChangeEventDetails<ComboboxChangeEventReason>(
            COMBOBOX_REASONS.itemPress,
            event
          )
        )
      }
      setOpen(false, COMBOBOX_REASONS.itemPress, event)
    },
    [
      multiple,
      single,
      setValue,
      isEqual,
      setInputValue,
      fillInputOnItemPress,
      itemToStringLabel,
      itemToStringValueProp,
      itemToStringValue,
      setOpen,
    ]
  )

  const removeItem = React.useCallback(
    (itemValue: unknown, event?: ChangeEvent) => {
      if (!multiple) return
      setValue(
        (previous: unknown) =>
          (Array.isArray(previous) ? previous : []).filter(
            (entry: unknown) => !isEqual(itemValue, entry)
          ),
        createChangeEventDetails<ComboboxChangeEventReason>(
          COMBOBOX_REASONS.chipRemovePress,
          event
        )
      )
    },
    [multiple, setValue, isEqual]
  )

  const clear = React.useCallback(
    (event?: ChangeEvent) => {
      if (selectionMode !== "none") {
        setValue(
          multiple ? [] : null,
          createChangeEventDetails<ComboboxChangeEventReason>(
            COMBOBOX_REASONS.clearPress,
            event
          )
        )
      }
      setInputValue(
        "",
        createChangeEventDetails<ComboboxChangeEventReason>(
          COMBOBOX_REASONS.clearPress,
          event
        )
      )
    },
    [selectionMode, multiple, setValue, setInputValue]
  )

  React.useEffect(() => {
    if (!single || open || inputValue === selectedLabel) return
    setInputValue(
      selectedLabel,
      createChangeEventDetails<ComboboxChangeEventReason>(COMBOBOX_REASONS.none)
    )
  }, [single, open, selectedLabel, inputValue, setInputValue])

  React.useEffect(() => {
    if (open && multiple && Array.isArray(value)) measureAnchor()
  }, [open, multiple, value, measureAnchor])

  const registerAnchor = React.useCallback(
    (priority: number, node: HostInstance | null) => {
      const anchors = anchorsRef.current
      if (node) anchors.set(priority, node)
      else anchors.delete(priority)
      let best: HostInstance | null = null
      let bestPriority = -1
      for (const [key, entry] of anchors) {
        if (key > bestPriority) {
          bestPriority = key
          best = entry
        }
      }
      triggerRef.current = best
    },
    [triggerRef]
  )

  return React.useMemo<ComboboxRootContextValue>(
    () => ({
      floating,
      selectionMode,
      multiple,
      value,
      inputValue,
      hasValue,
      readOnly,
      disabled,
      openOnInputClick,
      filteredItems,
      itemCount,
      empty: itemCount === 0,
      labelId,
      setLabelId,
      isSelected,
      selectItem,
      removeItem,
      clear,
      changeInputValue,
      itemToStringLabel,
      registerAnchor,
    }),
    [
      floating,
      selectionMode,
      multiple,
      value,
      inputValue,
      hasValue,
      readOnly,
      disabled,
      openOnInputClick,
      filteredItems,
      itemCount,
      labelId,
      isSelected,
      selectItem,
      removeItem,
      clear,
      changeInputValue,
      itemToStringLabel,
      registerAnchor,
    ]
  )
}

interface ComboboxRootProviderProps {
  value: ComboboxRootContextValue
  children?: React.ReactNode
}

function ComboboxRootProvider({ value, children }: ComboboxRootProviderProps) {
  return (
    <ComboboxRootContext.Provider value={value}>
      <FloatingRootContext.Provider value={value.floating}>
        {children}
      </FloatingRootContext.Provider>
    </ComboboxRootContext.Provider>
  )
}

interface RootProps<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
> {
  children?: React.ReactNode
  value?: ComboboxValueType<Value, Multiple> | null | undefined
  defaultValue?: ComboboxValueType<Value, Multiple> | null | undefined
  onValueChange?:
    | ((
        value:
          | ComboboxValueType<Value, Multiple>
          | (Multiple extends true ? never : null),
        details: ComboboxChangeEventDetails
      ) => void)
    | undefined
  multiple?: Multiple | undefined
  inputValue?: string | undefined
  defaultInputValue?: string | undefined
  onInputValueChange?:
    | ((inputValue: string, details: ComboboxChangeEventDetails) => void)
    | undefined
  items?: readonly Item[] | readonly ComboboxItemGroup<Item>[] | undefined
  filteredItems?:
    | readonly Item[]
    | readonly ComboboxItemGroup<Item>[]
    | undefined
  filter?: ComboboxFilter<Item> | null | undefined
  limit?: number | undefined
  locale?: Locale
  itemToStringLabel?: ((itemValue: Value) => string) | undefined
  itemToStringValue?: ((itemValue: Value) => string) | undefined
  isItemEqualToValue?: ((itemValue: Value, value: Value) => boolean) | undefined
  openOnInputClick?: boolean | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, details: ComboboxChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<FloatingRootActions | null> | undefined
  modal?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
}

function Root<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>({ children, multiple, ...props }: RootProps<Value, Multiple, Item>) {
  const context = useComboboxRoot({
    ...(props as Omit<
      UseComboboxRootParameters,
      "selectionMode" | "fillInputOnItemPress"
    >),
    selectionMode: multiple ? "multiple" : "single",
  })
  return <ComboboxRootProvider value={context}>{children}</ComboboxRootProvider>
}

Root.displayName = "ComboboxRoot"

type LabelProps = BaseUIComponentProps<typeof Text, Record<never, never>>

const EMPTY_STATE: Record<never, never> = {}

function Label({
  nativeID: nativeIDProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: LabelProps) {
  const generatedId = React.useId()
  const nativeID = nativeIDProp ?? generatedId
  const { setLabelId } = useComboboxRootContext("Combobox.Label")

  React.useEffect(() => {
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

Label.displayName = "ComboboxLabel"

interface InputGroupState {
  open: boolean
  disabled: boolean
  readOnly: boolean
}

type InputGroupProps = BaseUIComponentProps<typeof View, InputGroupState>

function InputGroup({
  render,
  className,
  style,
  ref,
  ...elementProps
}: InputGroupProps) {
  const combobox = useComboboxRootContext("Combobox.InputGroup")
  const anchorRef = useAnchorRef(ANCHOR_PRIORITY.group, true)
  const { open } = combobox.floating
  const state = React.useMemo<InputGroupState>(
    () => ({
      open,
      disabled: combobox.disabled,
      readOnly: combobox.readOnly,
    }),
    [open, combobox.disabled, combobox.readOnly]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: [ref, anchorRef],
    props: [elementProps],
  })

  return (
    <AnchorGroupContext.Provider value={true}>
      {element}
    </AnchorGroupContext.Provider>
  )
}

InputGroup.displayName = "ComboboxInputGroup"

interface InputState {
  open: boolean
  disabled: boolean
  readOnly: boolean
  listEmpty: boolean
  popupSide: Side | null
}

type InputProps = BaseUIComponentProps<typeof TextInput, InputState> & {
  disabled?: boolean | undefined
}

function Input({
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: InputProps) {
  const combobox = useComboboxRootContext("Combobox.Input")
  const inGroup = React.useContext(AnchorGroupContext)
  const inPopup = React.useContext(PopupPresenceContext)
  const positioner = useOptionalPositionerContext()
  const anchorRef = useAnchorRef(ANCHOR_PRIORITY.input, !inGroup && !inPopup)
  const disabled = !!disabledProp || combobox.disabled
  const { open, setOpen } = combobox.floating
  const { readOnly, changeInputValue, openOnInputClick, labelId } = combobox

  const onChange = React.useCallback(
    (event: TextInputChangeEvent) => {
      if (disabled || readOnly) return
      changeInputValue(event.nativeEvent.text, event)
    },
    [disabled, readOnly, changeInputValue]
  )

  const onPress = React.useCallback(
    (event: NativeSyntheticEvent<unknown>) => {
      if (disabled || readOnly || open || !openOnInputClick || inPopup) return
      setOpen(true, COMBOBOX_REASONS.inputPress, event)
    },
    [disabled, readOnly, open, openOnInputClick, inPopup, setOpen]
  )

  const state = React.useMemo<InputState>(
    () => ({
      open,
      disabled,
      readOnly,
      listEmpty: combobox.empty,
      popupSide: open ? (positioner?.side ?? null) : null,
    }),
    [open, disabled, readOnly, combobox.empty, positioner?.side]
  )

  return useRender({
    defaultComponent: TextInput,
    render,
    className,
    style,
    state,
    ref: [ref, anchorRef],
    props: [
      { style: fontFamily() },
      {
        role: "combobox",
        accessibilityLabelledBy: labelId,
        accessibilityState: { expanded: open, disabled },
        autoCorrect: false,
        autoCapitalize: "none",
        editable: !disabled && !readOnly,
        value: combobox.inputValue,
        onChange,
        onPress,
      },
      elementProps,
    ],
  })
}

Input.displayName = "ComboboxInput"

interface TriggerState {
  open: boolean
  disabled: boolean
  readOnly: boolean
  listEmpty: boolean
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
  const combobox = useComboboxRootContext("Combobox.Trigger")
  const inGroup = React.useContext(AnchorGroupContext)
  const anchorRef = useAnchorRef(ANCHOR_PRIORITY.trigger, !inGroup)
  const disabled = !!disabledProp || combobox.disabled
  const { open, setOpen } = combobox.floating
  const { readOnly } = combobox

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || readOnly) return
      setOpen(!open, COMBOBOX_REASONS.triggerPress, event)
    },
    [disabled, readOnly, setOpen, open]
  )

  const state = React.useMemo<TriggerState>(
    () => ({
      open,
      disabled,
      readOnly,
      listEmpty: combobox.empty,
      placeholder: !combobox.hasValue,
    }),
    [open, disabled, readOnly, combobox.empty, combobox.hasValue]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: [ref, anchorRef],
    props: [
      {
        role: "button",
        accessibilityState: { expanded: open, disabled },
        disabled: disabled || undefined,
        onPress,
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "ComboboxTrigger"

interface ClearState {
  open: boolean
  disabled: boolean
  visible: boolean
}

type ClearProps = BaseUIComponentProps<typeof Pressable, ClearState> & {
  keepMounted?: boolean | undefined
}

function Clear({
  disabled: disabledProp,
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ClearProps) {
  const combobox = useComboboxRootContext("Combobox.Clear")
  const disabled = !!disabledProp || combobox.disabled
  const { open } = combobox.floating
  const { readOnly, clear } = combobox
  const visible = combobox.hasValue || combobox.inputValue !== ""

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || readOnly) return
      clear(event)
    },
    [disabled, readOnly, clear]
  )

  const state = React.useMemo<ClearState>(
    () => ({ open, disabled, visible }),
    [open, disabled, visible]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "button",
        accessibilityState: { disabled },
        disabled: disabled || undefined,
        onPress,
      },
      elementProps,
    ],
    enabled: keepMounted || visible,
  })
}

Clear.displayName = "ComboboxClear"

interface ValueState {
  value: unknown
  placeholder: boolean
}

type ValueProps = Omit<
  BaseUIComponentProps<typeof Text, ValueState>,
  "children"
> & {
  children?: React.ReactNode | ValueRenderer
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
  const combobox = useComboboxRootContext("Combobox.Value")
  const { value, hasValue, multiple, itemToStringLabel } = combobox

  const state = React.useMemo<ValueState>(
    () => ({ value, placeholder: !hasValue }),
    [value, hasValue]
  )

  const isFunction = typeof children === "function"

  let content: React.ReactNode
  if (isFunction) {
    content = children(value)
  } else if (children !== undefined && children !== null) {
    content = children
  } else if (!hasValue) {
    content = placeholder
  } else if (multiple && Array.isArray(value)) {
    content = value.map((entry: unknown) => itemToStringLabel(entry)).join(", ")
  } else {
    content = itemToStringLabel(value)
  }

  const element = useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    props: [{ children: content }, elementProps],
    enabled: !isFunction,
  })

  return isFunction ? content : element
}

Value.displayName = "ComboboxValue"

interface IconState {
  open: boolean
}

type IconProps = BaseUIComponentProps<typeof View, IconState>

function Icon({ render, className, style, ref, ...elementProps }: IconProps) {
  const { open } = useComboboxRootContext("Combobox.Icon").floating
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

Icon.displayName = "ComboboxIcon"

type ChipsProps = BaseUIComponentProps<typeof View, Record<never, never>>

function Chips({ render, className, style, ref, ...elementProps }: ChipsProps) {
  useComboboxRootContext("Combobox.Chips")
  const anchorRef = useAnchorRef(ANCHOR_PRIORITY.group, true)

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref: [ref, anchorRef],
    props: [{ role: "list" }, elementProps],
  })

  return (
    <AnchorGroupContext.Provider value={true}>
      {element}
    </AnchorGroupContext.Provider>
  )
}

Chips.displayName = "ComboboxChips"

interface ChipState {
  disabled: boolean
}

interface ChipContextValue {
  value: unknown
  index: number | undefined
  disabled: boolean
}

const ChipContext = React.createContext<ChipContextValue | null>(null)

type ChipProps = BaseUIComponentProps<typeof View, ChipState> & {
  value?: unknown
  index?: number | undefined
  disabled?: boolean | undefined
}

function Chip({
  value,
  index,
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ChipProps) {
  const combobox = useComboboxRootContext("Combobox.Chip")
  const disabled = !!disabledProp || combobox.disabled
  const state = React.useMemo<ChipState>(() => ({ disabled }), [disabled])
  const context = React.useMemo<ChipContextValue>(
    () => ({ value, index, disabled }),
    [value, index, disabled]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "listitem" }, elementProps],
  })

  return <ChipContext.Provider value={context}>{element}</ChipContext.Provider>
}

Chip.displayName = "ComboboxChip"

type ChipRemoveProps = BaseUIComponentProps<typeof Pressable, ChipState>

function ChipRemove({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ChipRemoveProps) {
  const combobox = useComboboxRootContext("Combobox.ChipRemove")
  const chip = React.useContext(ChipContext)
  if (!chip) {
    throw new Error("Combobox.ChipRemove must be rendered inside Combobox.Chip")
  }
  const disabled = chip.disabled || combobox.readOnly
  const { removeItem, value: selected } = combobox

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      if (chip.value !== undefined) {
        removeItem(chip.value, event)
        return
      }
      if (chip.index !== undefined && Array.isArray(selected)) {
        removeItem(selected[chip.index], event)
      }
    },
    [disabled, chip.value, chip.index, selected, removeItem]
  )

  const state = React.useMemo<ChipState>(() => ({ disabled }), [disabled])

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "button",
        accessibilityState: { disabled },
        disabled: disabled || undefined,
        onPress,
      },
      elementProps,
    ],
  })
}

ChipRemove.displayName = "ComboboxChipRemove"

interface PortalProps {
  children?: React.ReactNode
  keepMounted?: boolean | undefined
  hostName?: string | undefined
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const combobox = useComboboxRootContext("Combobox.Portal")
  return (
    <FloatingPortal
      root={combobox.floating}
      keepMounted={keepMounted}
      hostName={hostName}
    >
      <ComboboxRootContext.Provider value={combobox}>
        {children}
      </ComboboxRootContext.Provider>
    </FloatingPortal>
  )
}

Portal.displayName = "ComboboxPortal"

type PositionerProps = Omit<PositionerPrimitiveProps, "root">

function Positioner({
  side = "bottom",
  align = "start",
  ...props
}: PositionerProps) {
  const combobox = useComboboxRootContext("Combobox.Positioner")
  return (
    <PositionerPrimitive
      root={combobox.floating}
      side={side}
      align={align}
      {...props}
    />
  )
}

Positioner.displayName = "ComboboxPositioner"

interface PopupState {
  open: boolean
  side: Side
  align: Align
  anchorHidden: boolean
  empty: boolean
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState> & {
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
}

function Popup({
  initialFocus = false,
  finalFocus,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PopupProps) {
  const combobox = useComboboxRootContext("Combobox.Popup")
  const positioner = useOptionalPositionerContext()
  const { open } = combobox.floating
  const popup = useFloatingPopup({
    root: combobox.floating,
    ref,
    ready: positioner ? positioner.isPositioned : true,
    initialFocus,
    finalFocus,
  })

  const side = positioner?.side ?? "bottom"
  const align = positioner?.align ?? "start"
  const anchorHidden = positioner?.anchorHidden ?? false
  const state = React.useMemo<PopupState>(
    () => ({ open, side, align, anchorHidden, empty: combobox.empty }),
    [open, side, align, anchorHidden, combobox.empty]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: popup.ref,
    props: [popup.props, elementProps],
    enabled: open || positioner !== null,
  })

  return (
    <PopupPresenceContext.Provider value={true}>
      {element}
    </PopupPresenceContext.Provider>
  )
}

Popup.displayName = "ComboboxPopup"

interface ListState {
  empty: boolean
}

type ListProps = Omit<
  BaseUIComponentProps<typeof ScrollView, ListState>,
  "children"
> & {
  children?: React.ReactNode | ItemRenderer
}

function renderCollection(
  items: readonly unknown[],
  children: ItemRenderer
): React.ReactNode {
  return items.map((item, index) => children(item, index))
}

function List({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ListProps) {
  const combobox = useComboboxRootContext("Combobox.List")
  const state = React.useMemo<ListState>(
    () => ({ empty: combobox.empty }),
    [combobox.empty]
  )

  const content =
    typeof children === "function"
      ? renderCollection(combobox.filteredItems, children)
      : children

  return useRender({
    defaultComponent: ScrollView,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "list",
        keyboardShouldPersistTaps: "handled",
        nestedScrollEnabled: true,
        children: content,
      },
      elementProps,
    ],
  })
}

List.displayName = "ComboboxList"

const GroupItemsContext = React.createContext<readonly unknown[] | null>(null)

interface CollectionProps {
  children: ItemRenderer
}

function Collection({ children }: CollectionProps) {
  const combobox = useComboboxRootContext("Combobox.Collection")
  const groupItems = React.useContext(GroupItemsContext)
  return <>{renderCollection(groupItems ?? combobox.filteredItems, children)}</>
}

Collection.displayName = "ComboboxCollection"

interface StatusProps
  extends BaseUIComponentProps<typeof Text, Record<never, never>> {}

function announce(children: React.ReactNode) {
  if (typeof children !== "string" && typeof children !== "number") return
  const message = String(children)
  if (message) AccessibilityInfo.announceForAccessibility(message)
}

function Status({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: StatusProps) {
  useComboboxRootContext("Combobox.Status")

  React.useEffect(() => {
    announce(children)
  }, [children])

  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [
      { role: "status", accessibilityLiveRegion: "polite", children },
      elementProps,
    ],
  })
}

Status.displayName = "ComboboxStatus"

type EmptyProps = BaseUIComponentProps<typeof View, Record<never, never>>

function Empty({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: EmptyProps) {
  const { empty } = useComboboxRootContext("Combobox.Empty")

  React.useEffect(() => {
    if (empty) announce(children)
  }, [empty, children])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [{ accessibilityLiveRegion: "polite", children }, elementProps],
    enabled: empty,
  })
}

Empty.displayName = "ComboboxEmpty"

interface ArrowState {
  open: boolean
  side: Side
  align: Align
  uncentered: boolean
}

type ArrowProps = BaseUIComponentProps<typeof View, ArrowState>

function Arrow({ render, className, style, ref, ...elementProps }: ArrowProps) {
  const positioner = usePositionerContext("Combobox.Arrow")
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

Arrow.displayName = "ComboboxArrow"

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
  const { open } = useComboboxRootContext("Combobox.Backdrop").floating
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

Backdrop.displayName = "ComboboxBackdrop"

interface ItemState {
  disabled: boolean
  selected: boolean
  highlighted: boolean
}

const ItemContext = React.createContext<ItemState | null>(null)

type ItemProps = BaseUIComponentProps<typeof Pressable, ItemState> & {
  value?: unknown
  index?: number | undefined
}

function Item({
  value = null,
  index: _index,
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemProps) {
  const combobox = useComboboxRootContext("Combobox.Item")
  const { selectItem, isSelected, readOnly, itemToStringLabel } = combobox
  const disabled = !!disabledProp || combobox.disabled
  const selected = isSelected(value)
  const [highlighted, setHighlighted] = React.useState(false)

  const onPressIn = React.useCallback(() => setHighlighted(true), [])
  const onPressOut = React.useCallback(() => setHighlighted(false), [])

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || readOnly) return
      selectItem(value, event)
    },
    [disabled, readOnly, selectItem, value]
  )

  const state = React.useMemo<ItemState>(
    () => ({ disabled, selected, highlighted }),
    [disabled, selected, highlighted]
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
        accessibilityLabel: itemToStringLabel(value) || undefined,
        accessibilityState: { selected, disabled },
        disabled: disabled || undefined,
        onPress,
        onPressIn,
        onPressOut,
      },
      elementProps,
    ],
  })

  return <ItemContext.Provider value={state}>{element}</ItemContext.Provider>
}

Item.displayName = "ComboboxItem"

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
  const item = React.useContext(ItemContext)
  if (!item) {
    throw new Error(
      "Combobox.ItemIndicator must be rendered inside Combobox.Item"
    )
  }

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: item,
    ref,
    props: [HIDDEN_PROPS, elementProps],
    enabled: keepMounted || item.selected,
  })
}

ItemIndicator.displayName = "ComboboxItemIndicator"

interface GroupContextValue {
  setLabelId: (id: string | undefined) => void
}

const GroupContext = React.createContext<GroupContextValue | null>(null)

type GroupProps = BaseUIComponentProps<typeof View, Record<never, never>> & {
  items?: readonly unknown[] | undefined
}

function Group({
  items,
  render,
  className,
  style,
  ref,
  ...elementProps
}: GroupProps) {
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
    <GroupContext.Provider value={context}>
      <GroupItemsContext.Provider value={items ?? null}>
        {element}
      </GroupItemsContext.Provider>
    </GroupContext.Provider>
  )
}

Group.displayName = "ComboboxGroup"

type GroupLabelProps = BaseUIComponentProps<typeof Text, Record<never, never>>

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

GroupLabel.displayName = "ComboboxGroupLabel"

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

Separator.displayName = "ComboboxSeparator"

export type {
  ArrowProps,
  ArrowState,
  BackdropProps,
  BackdropState,
  ChipProps,
  ChipRemoveProps,
  ChipState,
  ChipsProps,
  ClearProps,
  ClearState,
  CollectionProps,
  ComboboxChangeEventDetails,
  ComboboxChangeEventReason,
  ComboboxFilter,
  ComboboxItemGroup,
  ComboboxItems,
  ComboboxRootContextValue,
  ComboboxValueType,
  EmptyProps,
  GroupLabelProps,
  GroupProps,
  IconProps,
  IconState,
  InputGroupProps,
  InputGroupState,
  InputProps,
  InputState,
  ItemIndicatorProps,
  ItemProps,
  ItemRenderer,
  ItemState,
  LabelProps,
  ListProps,
  ListState,
  PopupProps,
  PopupState,
  PortalProps,
  PositionerProps,
  RootProps,
  SelectionMode,
  SeparatorProps,
  SeparatorState,
  StatusProps,
  TriggerProps,
  TriggerState,
  UseComboboxRootParameters,
  UseFilterOptions,
  ValueProps,
  ValueRenderer,
  ValueState,
}
export {
  Arrow,
  Backdrop,
  Chip,
  ChipRemove,
  Chips,
  Clear,
  COMBOBOX_REASONS,
  Collection,
  ComboboxRootProvider,
  Empty,
  Group,
  GroupLabel,
  Icon,
  Input,
  InputGroup,
  Item,
  ItemIndicator,
  Label,
  List,
  Popup,
  Portal,
  Positioner,
  Root,
  Separator,
  Status,
  Trigger,
  useComboboxRoot,
  useComboboxRootContext,
  useFilter,
  Value,
}
