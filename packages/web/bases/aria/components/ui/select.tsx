"use client"

import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  composeRenderProps,
  Header as HeaderPrimitive,
  ListBoxItem as ListBoxItemPrimitive,
  type ListBoxItemProps as ListBoxItemPrimitiveProps,
  ListBox as ListBoxPrimitive,
  type ListBoxProps as ListBoxPrimitiveProps,
  ListBoxSection as ListBoxSectionPrimitive,
  type ListBoxSectionProps as ListBoxSectionPrimitiveProps,
  Popover as PopoverPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
  Select as SelectPrimitive,
  type SelectProps as SelectPrimitiveProps,
  SelectValue as SelectValuePrimitive,
  type SelectValueProps as SelectValuePrimitiveProps,
  Separator as SeparatorPrimitive,
} from "react-aria-components"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

function Select<
  T extends object = object,
  M extends "single" | "multiple" = "single",
>({ className, ...props }: SelectPrimitiveProps<T, M>) {
  return (
    <SelectPrimitive<T, M>
      data-slot="select"
      className={composeRenderProps(className, (className) =>
        cn("group/select contents", className)
      )}
      {...props}
    />
  )
}

function trackHighlight(list: HTMLDivElement | null) {
  const indicator = list?.querySelector<HTMLElement>(
    "[data-slot=select-highlight]"
  )
  if (!list || !indicator) return
  const update = () => {
    const item = list.querySelector<HTMLElement>(
      "[data-slot=select-item][data-focused]"
    )
    if (!item) {
      delete indicator.dataset.visible
      return
    }
    const instant = !("visible" in indicator.dataset)
    if (instant) indicator.dataset.instant = ""
    indicator.style.top = `${item.offsetTop}px`
    indicator.style.left = `${item.offsetLeft}px`
    indicator.style.width = `${item.offsetWidth}px`
    indicator.style.height = `${item.offsetHeight}px`
    indicator.dataset.visible = ""
    if (instant) {
      void indicator.offsetHeight
      delete indicator.dataset.instant
    }
  }
  update()
  const observer = new MutationObserver(update)
  observer.observe(list, {
    subtree: true,
    attributeFilter: ["data-focused"],
  })
  return () => observer.disconnect()
}

function SelectGroup({
  className,
  ...props
}: Omit<ListBoxSectionPrimitiveProps<object>, "className"> & {
  className?: string
}) {
  return (
    <ListBoxSectionPrimitive
      data-slot="select-group"
      className={cn("cn-select-group", className)}
      {...props}
    />
  )
}

function SelectValue({
  className,
  placeholder,
  children,
  ...props
}: Omit<SelectValuePrimitiveProps<object>, "className"> & {
  className?: string
  placeholder?: React.ReactNode
}) {
  return (
    <SelectValuePrimitive
      data-slot="select-value"
      className={cn("cn-select-value cn-select-value-aria", className)}
      {...props}
    >
      {children ??
        (({ isPlaceholder, defaultChildren }) =>
          isPlaceholder && placeholder !== undefined
            ? placeholder
            : defaultChildren)}
    </SelectValuePrimitive>
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: Omit<ButtonPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  size?: "sm" | "default"
}) {
  return (
    <ButtonPrimitive
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "cn-select-trigger flex items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:opacity-50 *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronsUpDownIcon"
        tabler="IconSelector"
        hugeicons="UnfoldMoreIcon"
        phosphor="CaretUpDownIcon"
        remixicon="RiExpandUpDownLine"
        className="pointer-events-none size-4 text-muted-foreground"
        aria-hidden="true"
      />
    </ButtonPrimitive>
  )
}

function SelectContent({
  className,
  children,
  placement = "bottom",
  offset = 4,
  crossOffset = 0,
  ...props
}: Omit<ListBoxPrimitiveProps<object>, "className" | "children"> &
  Pick<PopoverPrimitiveProps, "placement" | "offset" | "crossOffset"> & {
    className?: string
    children?: React.ReactNode
  }) {
  return (
    <PopoverPrimitive
      data-slot="select-content"
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      className={cn(
        "cn-menu-target cn-menu-translucent cn-select-content-aria overflow-x-hidden overflow-y-auto cn-menu-translucent-aria relative isolate z-50 w-(--trigger-width) origin-(--trigger-anchor-point)",
        className
      )}
    >
      <div ref={trackHighlight} className="relative">
        <span
          aria-hidden="true"
          data-slot="select-highlight"
          className="cn-select-highlight"
        />
        <ListBoxPrimitive className="relative outline-none" {...props}>
          {children}
        </ListBoxPrimitive>
      </div>
    </PopoverPrimitive>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof HeaderPrimitive>) {
  return (
    <HeaderPrimitive
      data-slot="select-label"
      className={cn("cn-select-label", className)}
      {...props}
    />
  )
}

function textOf(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (React.isValidElement<{ children?: unknown }>(node))
    return textOf(node.props.children)
  return ""
}

function SelectItem({
  className,
  children,
  value,
  textValue,
  ...props
}: Omit<
  ListBoxItemPrimitiveProps<object>,
  "className" | "children" | "id" | "value"
> & {
  className?: string
  children?: React.ReactNode
  value: string
}) {
  return (
    <ListBoxItemPrimitive
      id={value}
      data-slot="select-item"
      textValue={textValue ?? (textOf(children).trim() || value)}
      className={cn(
        "cn-select-item cn-select-item-aria relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50 not-data-[variant=destructive]:focus:**:text-foreground [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      {({ isSelected }) => (
        <>
          <span className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
            {children}
          </span>
          {isSelected ? (
            <span className="pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center">
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                className="pointer-events-none text-primary! **:text-primary!"
              />
            </span>
          ) : null}
        </>
      )}
    </ListBoxItemPrimitive>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="select-separator"
      className={cn("cn-select-separator pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="select-scroll-up-button"
      className={cn(
        "cn-select-scroll-up-button top-0 w-full flex [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronUpIcon"
        tabler="IconChevronUp"
        hugeicons="ArrowUp01Icon"
        phosphor="CaretUpIcon"
        remixicon="RiArrowUpSLine"
      />
    </div>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="select-scroll-down-button"
      className={cn(
        "cn-select-scroll-down-button bottom-0 w-full flex [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconChevronDown"
        hugeicons="ArrowDown01Icon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
      />
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
