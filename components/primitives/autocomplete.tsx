import type * as React from "react"
import {
  Arrow,
  Backdrop,
  Clear,
  Collection,
  type ComboboxChangeEventDetails,
  type ComboboxChangeEventReason,
  type ComboboxFilter,
  type ComboboxItemGroup,
  type ItemProps as ComboboxItemProps,
  type ItemState as ComboboxItemState,
  ComboboxRootProvider,
  Empty,
  Group,
  GroupLabel,
  Icon,
  Input,
  InputGroup,
  Item,
  List,
  Popup,
  Portal,
  Positioner,
  Separator,
  Status,
  Trigger,
  useComboboxRoot,
  useComboboxRootContext,
  useFilter,
} from "./combobox"
import type { FloatingRootActions } from "./floating-root"

type AutocompleteChangeEventReason = ComboboxChangeEventReason

type AutocompleteChangeEventDetails = ComboboxChangeEventDetails

type AutocompleteMode = "list" | "both" | "inline" | "none"

interface RootProps<ItemValue> {
  children?: React.ReactNode
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?:
    | ((value: string, details: AutocompleteChangeEventDetails) => void)
    | undefined
  items?:
    | readonly ItemValue[]
    | readonly ComboboxItemGroup<ItemValue>[]
    | undefined
  filteredItems?:
    | readonly ItemValue[]
    | readonly ComboboxItemGroup<ItemValue>[]
    | undefined
  filter?: ComboboxFilter<ItemValue> | null | undefined
  limit?: number | undefined
  locale?: string | readonly string[] | undefined
  mode?: AutocompleteMode | undefined
  itemToStringValue?: ((itemValue: ItemValue) => string) | undefined
  openOnInputClick?: boolean | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, details: AutocompleteChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<FloatingRootActions | null> | undefined
  modal?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
}

function Root<ItemValue>({
  children,
  value,
  defaultValue,
  onValueChange,
  mode = "list",
  filter,
  itemToStringValue,
  openOnInputClick = false,
  ...props
}: RootProps<ItemValue>) {
  const filtering = mode === "list" || mode === "both"
  const context = useComboboxRoot({
    ...(props as Omit<
      RootProps<unknown>,
      | "children"
      | "value"
      | "defaultValue"
      | "onValueChange"
      | "mode"
      | "filter"
      | "itemToStringValue"
      | "openOnInputClick"
    >),
    selectionMode: "none",
    inputValue: value,
    defaultInputValue: defaultValue ?? "",
    onInputValueChange: onValueChange,
    filter: filtering ? (filter as ComboboxFilter | null | undefined) : null,
    itemToStringLabel: itemToStringValue as
      | ((itemValue: unknown) => string)
      | undefined,
    itemToStringValue: itemToStringValue as
      | ((itemValue: unknown) => string)
      | undefined,
    fillInputOnItemPress: true,
    openOnInputClick,
  })
  return <ComboboxRootProvider value={context}>{children}</ComboboxRootProvider>
}

Root.displayName = "AutocompleteRoot"

interface ValueProps {
  children?: React.ReactNode | ((value: string) => React.ReactNode)
}

function Value({ children }: ValueProps) {
  const { inputValue } = useComboboxRootContext("Autocomplete.Value")
  return <>{typeof children === "function" ? children(inputValue) : children}</>
}

Value.displayName = "AutocompleteValue"

type ItemState = Omit<ComboboxItemState, "selected">

type ItemProps = ComboboxItemProps

export type {
  AutocompleteChangeEventDetails,
  AutocompleteChangeEventReason,
  AutocompleteMode,
  ItemProps,
  ItemState,
  RootProps,
  ValueProps,
}
export {
  Arrow,
  Backdrop,
  Clear,
  Collection,
  Empty,
  Group,
  GroupLabel,
  Icon,
  Input,
  InputGroup,
  Item,
  List,
  Popup,
  Portal,
  Positioner,
  Root,
  Separator,
  Status,
  Trigger,
  useFilter,
}
