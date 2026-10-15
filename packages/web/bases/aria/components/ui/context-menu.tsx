"use client"

import * as React from "react"
import {
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
  Pressable,
  type Selection,
  Separator as SeparatorPrimitive,
  SubmenuTrigger as SubmenuTriggerPrimitive,
} from "react-aria-components"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { useModifierKey } from "@/hooks/use-platform"
import { cn } from "@/lib/utils"

function ContextMenu({
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof MenuTriggerPrimitive>,
  "children" | "trigger"
> & {
  children?: React.ReactNode
}) {
  return (
    <MenuTriggerPrimitive trigger="contextMenu" {...props}>
      {children}
    </MenuTriggerPrimitive>
  )
}

function ContextMenuPortal({ children }: { children?: React.ReactNode }) {
  return children
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Pressable>
      <div
        role="button"
        tabIndex={0}
        data-slot="context-menu-trigger"
        className={cn("select-none", className)}
        {...props}
      />
    </Pressable>
  )
}

function ContextMenuContent({
  placement = "bottom start",
  offset = 0,
  crossOffset = 4,
  className,
  children,
  "data-slot": slot = "context-menu-content",
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
        "cn-menu-target cn-menu-translucent z-50 min-w-48 origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 outline-none data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95",
        className
      )}
    >
      <MenuPrimitive className="outline-none" {...props}>
        {children}
      </MenuPrimitive>
    </PopoverPrimitive>
  )
}

function useCheckboxSelection(children: React.ReactNode) {
  const prefix = React.useId()
  const nodes = React.Children.toArray(children)
  const items = nodes.flatMap((child, index) =>
    React.isValidElement<CheckboxItemProps>(child) &&
    child.type === ContextMenuCheckboxItem
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

function ContextMenuGroup({
  children,
  ...props
}: Omit<MenuSectionPrimitiveProps<object>, "children"> & {
  children?: React.ReactNode
}) {
  const selection = useCheckboxSelection(children)

  return (
    <MenuSectionPrimitive
      data-slot="context-menu-group"
      {...selection}
      {...props}
    />
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof HeaderPrimitive> & {
  inset?: boolean
}) {
  return (
    <HeaderPrimitive
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 py-2.5 text-xs font-semibold text-muted-foreground data-inset:ps-9.5",
        className
      )}
      {...props}
    />
  )
}

function textOf(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (
    React.isValidElement<{ children?: unknown }>(node) &&
    node.type !== ContextMenuShortcut
  )
    return textOf(node.props.children)
  return ""
}

function itemText(children: unknown, textValue?: string) {
  return textValue ?? (textOf(children).trim() || undefined)
}

function ContextMenuItem({
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
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      textValue={itemText(children, textValue)}
      className={cn(
        "group/context-menu-item relative flex cursor-default items-center gap-2.5 rounded-md px-3 py-2 text-base outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-9.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </MenuItemPrimitive>
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof SubmenuTriggerPrimitive>) {
  return <SubmenuTriggerPrimitive {...props} />
}

function ContextMenuSubTrigger({
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
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      textValue={itemText(children, textValue)}
      className={cn(
        "flex cursor-default items-center rounded-md px-3 py-2 text-base outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-9.5 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

function ContextMenuSubContent({
  placement = "end top",
  offset = 0,
  crossOffset = -6,
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className="cn-menu-target cn-menu-translucent shadow-lg"
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      {...props}
    />
  )
}

function ItemIndicator() {
  return (
    <span className="pointer-events-none absolute inset-e-2">
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

function ContextMenuCheckboxItem({
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
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      textValue={itemText(children, textValue)}
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-md py-2 pe-8 ps-3 text-base outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-9.5 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected ? <ItemIndicator /> : null}
          {children}
        </>
      ))}
    </MenuItemPrimitive>
  )
}

function ContextMenuRadioGroup({
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
      data-slot="context-menu-radio-group"
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

function ContextMenuRadioItem({
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
      data-slot="context-menu-radio-item"
      data-inset={inset}
      textValue={itemText(children, textValue)}
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-md py-2 pe-8 ps-3 text-base outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-9.5 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected ? <ItemIndicator /> : null}
          {children}
        </>
      ))}
    </MenuItemPrimitive>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="context-menu-separator"
      className={cn("-mx-1.5 my-1.5 h-px bg-border/50", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  mod,
  children,
  ...props
}: React.ComponentProps<"span"> & { mod?: boolean }) {
  const modifier = useModifierKey(children != null)

  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "max-md:hidden ms-auto text-xs text-muted-foreground group-focus/context-menu-item:text-foreground",
        className
      )}
      {...props}
    >
      {mod && modifier}
      {children}
    </span>
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
