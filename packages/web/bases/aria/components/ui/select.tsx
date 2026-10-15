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
      className={cn("scroll-my-1.5 p-1.5", className)}
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
      className={cn("flex flex-1 text-start", className)}
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
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-transparent bg-secondary px-3 py-2 text-base whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed group-data-invalid/select:border-destructive group-data-invalid/select:ring-3 group-data-invalid/select:ring-destructive/20 dark:group-data-invalid/select:ring-destructive/40 group-data-invalid/select:bg-destructive/5 dark:group-data-invalid/select:bg-destructive/10 has-data-placeholder:text-muted-foreground data-[size=default]:h-11 data-[size=sm]:h-9 data-[size=sm]:rounded-md *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 disabled:opacity-50",
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
        "cn-menu-target cn-menu-translucent relative isolate z-50 w-(--trigger-width) min-w-36 origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95",
        className
      )}
    >
      <div ref={trackHighlight} className="relative">
        <span
          aria-hidden="true"
          data-slot="select-highlight"
          className="pointer-events-none absolute rounded-md bg-accent opacity-0 transition-[top,left,width,height,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] data-instant:transition-none data-visible:opacity-100 motion-reduce:transition-none text-accent-foreground"
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
      className={cn(
        "px-3 py-2.5 text-xs font-semibold text-muted-foreground",
        className
      )}
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
        "relative flex w-full cursor-default items-center gap-2.5 rounded-md py-2 pe-8 ps-3 text-base outline-hidden select-none focus:text-foreground not-data-[variant=destructive]:focus:**:text-foreground data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 data-disabled:opacity-50",
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
      className={cn(
        "pointer-events-none -mx-1.5 my-1.5 h-px bg-border",
        className
      )}
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
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
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
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
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
