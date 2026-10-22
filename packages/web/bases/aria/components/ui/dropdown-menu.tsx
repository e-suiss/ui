"use client"

import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  composeRenderProps,
  Header as HeaderPrimitive,
  MenuItem as MenuItemPrimitive,
  type MenuItemProps as MenuItemPrimitiveProps,
  Menu as MenuPrimitive,
  type MenuProps as MenuPrimitiveProps,
  MenuSection as MenuSectionPrimitive,
  type MenuSectionProps as MenuSectionPrimitiveProps,
  MenuTrigger as MenuTriggerPrimitive,
  Popover as PopoverPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
  type Selection,
  Separator as SeparatorPrimitive,
  SubmenuTrigger as SubmenuTriggerPrimitive,
} from "react-aria-components"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { useModifierKey } from "@/hooks/use-platform"
import { cn } from "@/lib/utils"

function DropdownMenu({
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuTriggerPrimitive>, "children"> & {
  children?: React.ReactNode
}) {
  return <MenuTriggerPrimitive {...props}>{children}</MenuTriggerPrimitive>
}

function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return children
}

function DropdownMenuTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="dropdown-menu-trigger"
      className={className}
      {...props}
    />
  )
}

function DropdownMenuContent({
  placement = "bottom start",
  offset = 4,
  crossOffset = 0,
  className,
  children,
  "data-slot": slot = "dropdown-menu-content",
  ...props
}: Omit<MenuPrimitiveProps<object>, "className" | "children"> &
  Pick<PopoverPrimitiveProps, "placement" | "offset" | "crossOffset"> & {
    className?: string
    children?: React.ReactNode
    "data-slot"?: string
  }) {
  return (
    <PopoverPrimitive
      data-slot={slot}
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      className={cn(
        "cn-menu-target cn-menu-translucent z-50 w-(--trigger-width) min-w-48 origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 outline-none data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:overflow-hidden data-exiting:fade-out-0 data-exiting:zoom-out-95",
        className
      )}
    >
      <MenuPrimitive className="outline-none" {...props}>
        {children}
      </MenuPrimitive>
    </PopoverPrimitive>
  )
}

const CheckboxGroupContext = React.createContext(false)

function useCheckboxSelection(children: React.ReactNode) {
  const prefix = React.useId()
  const nodes = React.Children.toArray(children)
  const items = nodes.flatMap((child, index) =>
    React.isValidElement<CheckboxItemProps>(child) &&
    child.type === DropdownMenuCheckboxItem
      ? [{ child, index, id: String(child.props.id ?? `${prefix}${index}`) }]
      : []
  )
  const [uncontrolled, setUncontrolled] = React.useState(
    () =>
      new Set(
        items
          .filter(({ child }) => child.props.defaultSelected)
          .map(({ id }) => id)
      )
  )
  if (items.length === 0) return { children }

  const isSelected = ({ child, id }: (typeof items)[number]) =>
    child.props.isSelected ?? uncontrolled.has(id)

  return {
    children: nodes.map((node, index) => {
      const item = items.find((entry) => entry.index === index)
      return item ? React.cloneElement(item.child, { id: item.id }) : node
    }),
    selectionMode: "multiple" as const,
    selectedKeys: new Set(items.filter(isSelected).map(({ id }) => id)),
    onSelectionChange: (keys: Selection) => {
      const next = new Set(uncontrolled)
      for (const item of items) {
        const selected = keys === "all" || keys.has(item.id)
        if (selected === isSelected(item)) continue
        if (selected) next.add(item.id)
        else next.delete(item.id)
        item.child.props.onChange?.(selected)
      }
      setUncontrolled(next)
    },
  }
}

function DropdownMenuGroup({
  children,
  ...props
}: Omit<MenuSectionPrimitiveProps<object>, "children"> & {
  children?: React.ReactNode
}) {
  const selection = useCheckboxSelection(children)

  return (
    <CheckboxGroupContext.Provider value={"selectionMode" in selection}>
      <MenuSectionPrimitive
        data-slot="dropdown-menu-group"
        {...selection}
        {...props}
      />
    </CheckboxGroupContext.Provider>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof HeaderPrimitive> & {
  inset?: boolean
}) {
  return (
    <HeaderPrimitive
      data-slot="dropdown-menu-label"
      data-inset={inset ? "" : undefined}
      className={cn("cn-dropdown-menu-label", className)}
      {...props}
    />
  )
}

function textOf(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (
    React.isValidElement<{ children?: unknown }>(node) &&
    node.type !== DropdownMenuShortcut
  )
    return textOf(node.props.children)
  return ""
}

function itemText(children: unknown, textValue?: string) {
  return textValue ?? (textOf(children).trim() || undefined)
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  children,
  textValue,
  ...props
}: Omit<MenuItemPrimitiveProps<object>, "className"> & {
  className?: string
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuItemPrimitive
      data-slot="dropdown-menu-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      textValue={itemText(children, textValue)}
      className={cn(
        "cn-dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 group/dropdown-menu-item not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </MenuItemPrimitive>
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof SubmenuTriggerPrimitive>) {
  return <SubmenuTriggerPrimitive {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  textValue,
  ...props
}: Omit<MenuItemPrimitiveProps<object>, "className"> & {
  className?: string
  inset?: boolean
}) {
  return (
    <MenuItemPrimitive
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      textValue={itemText(children, textValue)}
      className={cn(
        "cn-dropdown-menu-sub-trigger flex cursor-default items-center outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
            className="rtl:rotate-180 ms-auto"
          />
        </>
      ))}
    </MenuItemPrimitive>
  )
}

function DropdownMenuSubContent({
  placement = "end top",
  crossOffset = -3,
  offset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "cn-menu-target cn-menu-translucent cn-dropdown-menu-sub-content-aria w-auto",
        className
      )}
      placement={placement}
      crossOffset={crossOffset}
      offset={offset}
      {...props}
    />
  )
}

function ItemIndicator({ slot }: { slot: string }) {
  return (
    <span
      className="pointer-events-none absolute inset-e-2 flex items-center justify-center"
      data-slot={slot}
    >
      <IconPlaceholder
        lucide="CheckIcon"
        tabler="IconCheck"
        hugeicons="Tick02Icon"
        phosphor="CheckIcon"
        remixicon="RiCheckLine"
      />
    </span>
  )
}

type CheckboxItemProps = Omit<
  MenuItemPrimitiveProps<object>,
  "className" | "onChange"
> & {
  className?: string
  inset?: boolean
  isSelected?: boolean
  defaultSelected?: boolean
  onChange?: (isSelected: boolean) => void
}

function DropdownMenuCheckboxItem(props: CheckboxItemProps) {
  const grouped = React.useContext(CheckboxGroupContext)

  return grouped ? (
    <CheckboxMenuItem {...props} />
  ) : (
    <StandaloneCheckboxItem {...props} />
  )
}

function StandaloneCheckboxItem({
  id,
  isSelected,
  defaultSelected = false,
  onChange,
  ...props
}: CheckboxItemProps) {
  const fallbackId = React.useId()
  const key = String(id ?? fallbackId)
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelected)
  const selected = isSelected ?? uncontrolled

  return (
    <MenuSectionPrimitive
      selectionMode="multiple"
      selectedKeys={selected ? [key] : []}
      onSelectionChange={(keys) => {
        const next = keys === "all" || keys.has(key)
        setUncontrolled(next)
        onChange?.(next)
      }}
    >
      <CheckboxMenuItem {...props} id={key} />
    </MenuSectionPrimitive>
  )
}

function CheckboxMenuItem({
  className,
  children,
  inset,
  textValue,
  isSelected: _isSelected,
  defaultSelected: _defaultSelected,
  onChange: _onChange,
  ...props
}: CheckboxItemProps) {
  return (
    <MenuItemPrimitive
      shouldCloseOnSelect={false}
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset ? "" : undefined}
      textValue={itemText(children, textValue)}
      className={cn(
        "cn-dropdown-menu-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected ? (
            <ItemIndicator slot="dropdown-menu-checkbox-item-indicator" />
          ) : null}
          {children}
        </>
      ))}
    </MenuItemPrimitive>
  )
}

function DropdownMenuRadioGroup({
  value,
  defaultValue,
  onChange,
  ...props
}: Omit<
  MenuSectionPrimitiveProps<object>,
  | "children"
  | "value"
  | "selectionMode"
  | "selectedKeys"
  | "defaultSelectedKeys"
  | "onSelectionChange"
> & {
  children?: React.ReactNode
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}) {
  return (
    <MenuSectionPrimitive
      data-slot="dropdown-menu-radio-group"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={value === undefined ? undefined : [value]}
      defaultSelectedKeys={
        defaultValue === undefined ? undefined : [defaultValue]
      }
      onSelectionChange={(keys) => {
        const [key] = keys === "all" ? [] : keys
        if (key !== undefined) onChange?.(String(key))
      }}
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  value,
  textValue,
  ...props
}: Omit<MenuItemPrimitiveProps<object>, "className" | "id" | "value"> & {
  className?: string
  inset?: boolean
  value: string
}) {
  return (
    <MenuItemPrimitive
      id={value}
      shouldCloseOnSelect={false}
      data-slot="dropdown-menu-radio-item"
      data-inset={inset ? "" : undefined}
      textValue={itemText(children, textValue)}
      className={cn(
        "cn-dropdown-menu-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected ? (
            <ItemIndicator slot="dropdown-menu-radio-item-indicator" />
          ) : null}
          {children}
        </>
      ))}
    </MenuItemPrimitive>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="dropdown-menu-separator"
      className={cn("cn-dropdown-menu-separator", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  mod,
  children,
  ...props
}: React.ComponentProps<"span"> & { mod?: boolean }) {
  const modifier = useModifierKey(children != null)

  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("cn-dropdown-menu-shortcut", className)}
      {...props}
    >
      {mod && modifier}
      {children}
    </span>
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
